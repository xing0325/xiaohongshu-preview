#!/usr/bin/env node
/**
 * Refresh cards/99-lixon.html from the user's current Xiaohongshu creator data.
 *
 * Design goals:
 * - Recent highlights should change as the account updates.
 * - Export must not break when OpenCLI login expires: fall back to cached data.
 * - Prefer creator note-manager covers; fall back to text-only highlights.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const CARD_FILE = path.join(ROOT, 'cards', '99-lixon.html');
const ASSET_DIR = path.join(ROOT, 'assets', 'profile');
const CACHE_FILE = path.join(ASSET_DIR, 'recent-notes.json');
const AVATAR_FILE = path.join(ASSET_DIR, 'lixon-avatar.jpg');
const QUIET = process.argv.includes('--quiet');
const STRICT = process.argv.includes('--strict');

function log(...args) {
  if (!QUIET) console.log('[lixon-card]', ...args);
}

function warn(...args) {
  if (!QUIET) console.warn('[lixon-card:warn]', ...args);
}

function run(cmd, args, { timeout = 120000 } = {}) {
  // shell:true is intentional here: on this Windows/npm setup the global OpenCLI
  // executable is exposed as opencli.cmd and may not be found by direct execFile.
  return spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    timeout,
    windowsHide: true,
    shell: true,
  });
}

function runShell(command, { timeout = 120000 } = {}) {
  return spawnSync(command, {
    cwd: ROOT,
    encoding: 'utf8',
    timeout,
    windowsHide: true,
    shell: true,
  });
}

function parseJsonLoose(text) {
  const s = String(text || '').trim();
  if (!s) throw new Error('empty output');
  try { return JSON.parse(s); } catch {}
  const firstArray = s.indexOf('[');
  const firstObject = s.indexOf('{');
  const starts = [firstArray, firstObject].filter((n) => n >= 0).sort((a, b) => a - b);
  if (!starts.length) throw new Error(`no JSON start in output: ${s.slice(0, 120)}`);
  return JSON.parse(s.slice(starts[0]));
}

function fetchCreatorNotes(limit = 6) {
  const res = run('opencli', [
    'xiaohongshu', 'creator-notes',
    '--limit', String(limit),
    '--window', 'background',
    '--site-session', 'persistent',
    '-f', 'json',
  ], { timeout: 180000 });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(res.stderr || res.stdout || `opencli exited ${res.status}`);
  const rows = parseJsonLoose(res.stdout);
  if (!Array.isArray(rows) || !rows.length) throw new Error('creator-notes returned no rows');
  return rows.map((r, index) => ({
    rank: index + 1,
    id: String(r.id || ''),
    title: String(r.title || '').trim(),
    date: String(r.date || r.published_at || '').trim(),
    views: r.views ?? '',
    likes: r.likes ?? '',
    collects: r.collects ?? '',
    comments: r.comments ?? '',
    url: String(r.url || ''),
  })).filter((r) => r.title);
}

function fetchNoteManagerImages(limit = 6) {
  const open = run('opencli', ['browser', 'site:xiaohongshu', 'open', 'https://creator.xiaohongshu.com/new/note-manager'], { timeout: 90000 });
  if (open.error || open.status !== 0) throw new Error(open.stderr || open.stdout || 'failed to open note-manager');
  // Wait for the React list to paint. Keep it short; this script is a best-effort pre-export refresh.
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 4500);
  const expr = `(()=>{const imgs=[...document.images].filter(i=>i.naturalWidth>200&&i.naturalHeight>200&&!String(i.src).includes('avatar')&&!String(i.src).includes('noContent')).map(i=>i.src).filter(Boolean);return imgs.slice(0,${limit});})()`;
  const ev = runShell(`opencli browser site:xiaohongshu eval ${JSON.stringify(expr)}`, { timeout: 90000 });
  if (ev.error || ev.status !== 0) throw new Error(ev.stderr || ev.stdout || 'failed to eval note-manager');
  const imgs = parseJsonLoose(ev.stdout);
  return Array.isArray(imgs) ? imgs.filter(Boolean) : [];
}

async function download(url, file) {
  if (!url) return false;
  try {
    const normalized = String(url).replace(/^http:\/\//, 'https://');
    const resp = await fetch(normalized, { redirect: 'follow' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const buf = Buffer.from(await resp.arrayBuffer());
    if (buf.length < 1024) throw new Error(`too small (${buf.length} bytes)`);
    fs.writeFileSync(file, buf);
    return true;
  } catch (err) {
    warn(`cover download failed: ${url} — ${err.message}`);
    return false;
  }
}

function fmtNumber(n) {
  if (n === '' || n == null) return '';
  const num = Number(String(n).replace(/,/g, ''));
  if (!Number.isFinite(num)) return String(n);
  if (num >= 10000) return `${(num / 10000).toFixed(num >= 100000 ? 0 : 1)}w`;
  return String(num);
}

function classify(title) {
  const t = String(title || '').toLowerCase();
  if (/obsidian|工作流|提示词|画板|manus|ai/.test(t)) return '工作流';
  if (/vibe|coder|star|cardputer|网站|项目|coding/.test(t)) return '项目记录';
  if (/创伤|洗澡|灵感|日记|碎碎念|00:01/.test(t)) return '灵感/日记';
  return '最近更新';
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPastCard(note, index) {
  const cover = note.cover_local ? `<img class="past-cover" src="${esc(note.cover_local)}" alt="${esc(note.title)} cover">` : '<div class="past-cover fallback"></div>';
  const metaLeft = `${fmtNumber(note.likes)}赞 · ${fmtNumber(note.collects)}藏`;
  return `        <div class="past-card">
          ${cover}
          <div class="past-shade"></div>
          <div class="past-rank">RECENT ${String(index + 1).padStart(2, '0')}</div>
          <div class="past-title">${esc(note.title)}</div>
          <div class="past-meta"><span>${esc(metaLeft)}</span><span>${esc(classify(note.title))}</span></div>
        </div>`;
}

function renderCard(notes) {
  const safeNotes = notes.slice(0, 3);
  while (safeNotes.length < 3) {
    safeNotes.push({ title: '下一篇项目记录，正在路上', likes: '', collects: '', cover_local: '' });
  }
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>99 · Lixon</title>
<style>
  :root{--bg:#0b1020;--panel:#111827;--paper:#f8f3e7;--ink:#101827;--muted:#6b7280;--blue:#60a5fa;--green:#34d399;--pink:#fb7185;--amber:#fbbf24;--line:rgba(255,255,255,.14)}
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:1242px;height:1656px;overflow:hidden;position:relative;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;color:white;background:radial-gradient(620px 520px at 16% 8%,rgba(96,165,250,.38),transparent 62%),radial-gradient(760px 680px at 92% 26%,rgba(52,211,153,.28),transparent 62%),radial-gradient(620px 520px at 72% 100%,rgba(251,113,133,.24),transparent 62%),linear-gradient(180deg,#090d1a 0%,#101827 100%)}
  body:before{content:"";position:absolute;inset:0;opacity:.22;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:54px 54px;mask-image:linear-gradient(180deg,rgba(0,0,0,.9),rgba(0,0,0,.35))}
  .wrap{position:absolute;inset:72px 76px 64px;z-index:1}.top{display:flex;justify-content:space-between;align-items:center;color:rgba(255,255,255,.58);font-size:24px;letter-spacing:.16em;text-transform:uppercase}.top b{color:var(--green);font-weight:800;letter-spacing:.02em}
  .hero{margin-top:66px;display:grid;grid-template-columns:310px 1fr;gap:52px;align-items:center}.avatar-box{position:relative;width:300px;height:300px;border-radius:56px;padding:10px;background:linear-gradient(135deg,var(--blue),var(--green),var(--pink));box-shadow:0 26px 80px rgba(0,0,0,.38)}.avatar-box img{width:100%;height:100%;object-fit:cover;border-radius:46px;border:5px solid rgba(255,255,255,.9)}.tag{position:absolute;right:-30px;bottom:24px;padding:13px 22px;border-radius:999px;background:#101827;border:1px solid rgba(255,255,255,.2);box-shadow:0 16px 36px rgba(0,0,0,.28);font-size:24px;font-weight:800;color:var(--amber)}
  h1{font-size:122px;line-height:.95;letter-spacing:-.06em;font-weight:950}h1 span{display:block;background:linear-gradient(90deg,#fff,#bfdbfe 45%,#bbf7d0);-webkit-background-clip:text;color:transparent}.name-sub{margin-top:28px;font-size:36px;line-height:1.45;color:rgba(255,255,255,.78)}.name-sub b{color:white}.chips{display:flex;flex-wrap:wrap;gap:16px;margin-top:30px}.chip{padding:13px 20px;border-radius:999px;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.14);font-size:24px;color:rgba(255,255,255,.86)}
  .main-card{margin-top:54px;padding:38px 42px;border-radius:42px;background:rgba(248,243,231,.95);color:var(--ink);box-shadow:0 28px 80px rgba(0,0,0,.28);position:relative;overflow:hidden}.main-card:after{content:"TREE(3) → 数字病人Lixon";position:absolute;right:28px;top:20px;font-size:18px;color:rgba(16,24,39,.20);letter-spacing:.16em;font-weight:900}.intro-title{font-size:38px;font-weight:950;letter-spacing:-.03em;margin-bottom:20px;color:#111827}.intro{font-size:31px;line-height:1.62;color:#273244;font-weight:650;max-width:940px}.intro b{color:#0f766e}.three{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:28px}.mini{padding:22px 20px;border-radius:28px;background:#fff;border:1px solid rgba(16,24,39,.08);min-height:140px}.mini .k{font-size:19px;color:#64748b;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px}.mini .v{font-size:27px;font-weight:900;line-height:1.25;color:#111827}
  .past{margin-top:38px}.section-title{display:flex;align-items:center;gap:14px;font-size:34px;font-weight:950;letter-spacing:-.03em;color:white;margin-bottom:20px}.section-title i{width:12px;height:12px;border-radius:50%;background:var(--green);box-shadow:0 0 0 8px rgba(52,211,153,.12)}.past-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.past-card{height:250px;border-radius:30px;padding:22px;position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.13);background:linear-gradient(135deg,rgba(96,165,250,.26),rgba(255,255,255,.08));box-shadow:0 22px 46px rgba(0,0,0,.20)}.past-cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.95) contrast(.95);opacity:.78}.past-cover.fallback{background:linear-gradient(135deg,rgba(96,165,250,.32),rgba(52,211,153,.18));opacity:1}.past-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(3,7,18,.26),rgba(3,7,18,.84))}.past-rank{position:relative;z-index:1;font-size:18px;color:rgba(255,255,255,.72);font-weight:900;letter-spacing:.12em;margin-bottom:72px}.past-title{position:relative;z-index:1;font-size:28px;line-height:1.25;font-weight:950;color:#fff;letter-spacing:-.03em;text-shadow:0 2px 10px rgba(0,0,0,.38)}.past-meta{position:absolute;left:22px;right:22px;bottom:20px;font-size:20px;color:rgba(255,255,255,.80);font-weight:800;display:flex;justify-content:space-between;z-index:1}.bye{position:absolute;left:76px;right:76px;bottom:64px;display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid rgba(255,255,255,.14);padding-top:28px;color:rgba(255,255,255,.72)}.bye .next{font-size:35px;font-weight:950;color:white;letter-spacing:-.03em}.bye .small{font-size:23px;line-height:1.5;text-align:right;max-width:520px}
</style>
</head>
<body>
  <div class="wrap">
    <div class="top"><span>creator card · see you next time</span><b>最后一页</b></div>
    <section class="hero"><div class="avatar-box"><img src="../assets/profile/lixon-avatar.jpg" alt="Lixon avatar"><div class="tag">数字病人</div></div><div><h1><span>Lixon</span></h1><div class="name-sub">一个走创新教育路径的休学 <b>vibe coder</b></div><div class="chips"><div class="chip">18 岁</div><div class="chip">agent / 工作流 / 开源补丁</div><div class="chip">野生青少年独立开发者</div></div></div></section>
    <section class="main-card"><div class="intro-title">这个账号在记录什么？</div><div class="intro">我会记录 <b>vibe coding 项目</b>、各种突然冒出来的灵感，也记录一个普通人怎么把 AI 真的用进产品、自媒体和自己的工作流里。不是大神教程，更像一个 18 岁休学的人一边折腾做产品，一边把流程越改越顺。</div><div class="three"><div class="mini"><div class="k">01 / try</div><div class="v">尝试别人的项目，写真实体感</div></div><div class="mini"><div class="k">02 / build</div><div class="v">做自己的小工具和产品</div></div><div class="mini"><div class="k">03 / diary</div><div class="v">日记、碎碎念、灵感爆炸</div></div></div></section>
    <section class="past"><div class="section-title"><i></i><span>往期精彩 · 随更新自动刷新</span></div><div class="past-grid">
${safeNotes.map(renderPastCard).join('\n')}
      </div></section>
  </div>
  <div class="bye"><div class="next">下期见。</div><div class="small">如果你也在用 AI 做东西，或者想看一个野生青少年怎么折腾项目和流程，可以先关注我。<br>—— 数字病人 Lixon</div></div>
</body>
</html>
`;
}

async function main() {
  fs.mkdirSync(ASSET_DIR, { recursive: true });
  let notes = [];
  let source = 'cache';
  try {
    notes = fetchCreatorNotes(6);
    source = 'opencli creator-notes';
    try {
      const images = fetchNoteManagerImages(6);
      notes = notes.map((n, i) => ({ ...n, cover_url: images[i] || '' }));
      if (images.length) source += ' + note-manager covers';
    } catch (err) {
      warn(`could not fetch note-manager covers: ${err.message}`);
    }
    for (let i = 0; i < Math.min(3, notes.length); i += 1) {
      const localName = `recent-${String(i + 1).padStart(2, '0')}.jpg`;
      const localFile = path.join(ASSET_DIR, localName);
      if (await download(notes[i].cover_url, localFile)) {
        notes[i].cover_local = `../assets/profile/${localName}`;
      }
    }
    fs.writeFileSync(CACHE_FILE, `${JSON.stringify({ source, updated_at: new Date().toISOString(), notes }, null, 2)}\n`, 'utf8');
    log(`fetched ${notes.length} notes from ${source}`);
  } catch (err) {
    warn(`live refresh failed: ${err.message}`);
    if (fs.existsSync(CACHE_FILE)) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      notes = Array.isArray(cached.notes) ? cached.notes : [];
      source = `cache (${cached.updated_at || 'unknown time'})`;
      log(`using ${notes.length} cached notes`);
    } else if (STRICT) {
      throw err;
    } else {
      notes = [];
    }
  }

  if (!fs.existsSync(AVATAR_FILE)) warn(`missing avatar asset: ${path.relative(ROOT, AVATAR_FILE)}`);
  fs.writeFileSync(CARD_FILE, renderCard(notes), 'utf8');
  log(`wrote ${path.relative(ROOT, CARD_FILE)} using ${source}`);
}

main().catch((err) => {
  console.error(`[lixon-card:error] ${err.stack || err.message}`);
  process.exit(STRICT ? 1 : 0);
});
