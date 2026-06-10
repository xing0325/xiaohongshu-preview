#!/usr/bin/env node
/**
 * Export the current cards.config.js deck into a publish-ready package.
 *
 * Output:
 *   dist/xhs-pack/images/*.png
 *   dist/xhs-pack/title.txt
 *   dist/xhs-pack/body.txt
 *   dist/xhs-pack/topics.txt
 *   dist/xhs-pack/caption-full.txt
 *   dist/xhs-pack/publish.json
 *
 * No npm dependency is required. The script uses an installed Chrome/Edge in
 * headless mode. Override browser discovery with CHROME_PATH=/path/to/chrome.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const CONFIG_FILE = path.join(ROOT, 'cards.config.js');
const OUT_DIR = path.join(ROOT, 'dist', 'xhs-pack');
const CARD_WIDTH = 1242;
const CARD_HEIGHT = 1656;

function parseArgs(argv) {
  const args = { out: OUT_DIR, browser: process.env.CHROME_PATH || '', keep: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--out') args.out = path.resolve(argv[++i]);
    else if (arg === '--browser') args.browser = argv[++i];
    else if (arg === '--keep') args.keep = true;
    else if (arg === '-h' || arg === '--help') {
      console.log(`Usage: npm run export -- [--out dist/xhs-pack] [--browser /path/to/chrome] [--keep]\n\nExports cards.config.js into PNG images + publish.json.`);
      process.exit(0);
    }
    else throw new Error(`Unknown option: ${arg}`);
  }
  args.imageDir = path.join(args.out, 'images');
  return args;
}

function readConfig() {
  if (!fs.existsSync(CONFIG_FILE)) throw new Error(`Missing ${CONFIG_FILE}`);
  const source = fs.readFileSync(CONFIG_FILE, 'utf8');
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: CONFIG_FILE });
  const cfg = sandbox.window.CARDS_CONFIG;
  if (!cfg || !Array.isArray(cfg.cards) || cfg.cards.length === 0) {
    throw new Error('cards.config.js must define window.CARDS_CONFIG.cards');
  }
  if (cfg.cards.length > 9) {
    throw new Error(`Xiaohongshu supports at most 9 images; config has ${cfg.cards.length}`);
  }
  return cfg;
}

function candidateBrowsers() {
  const home = os.homedir();
  if (process.platform === 'win32') {
    return [
      process.env.CHROME_PATH,
      path.join(process.env.PROGRAMFILES || 'C:/Program Files', 'Google/Chrome/Application/chrome.exe'),
      path.join(process.env['PROGRAMFILES(X86)'] || 'C:/Program Files (x86)', 'Google/Chrome/Application/chrome.exe'),
      path.join(process.env.LOCALAPPDATA || path.join(home, 'AppData/Local'), 'Google/Chrome/Application/chrome.exe'),
      path.join(process.env.PROGRAMFILES || 'C:/Program Files', 'Microsoft/Edge/Application/msedge.exe'),
      path.join(process.env['PROGRAMFILES(X86)'] || 'C:/Program Files (x86)', 'Microsoft/Edge/Application/msedge.exe'),
    ].filter(Boolean);
  }
  if (process.platform === 'darwin') {
    return [
      process.env.CHROME_PATH,
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ].filter(Boolean);
  }
  return [
    process.env.CHROME_PATH,
    'google-chrome-stable',
    'google-chrome',
    'chromium-browser',
    'chromium',
    'microsoft-edge',
  ].filter(Boolean);
}

function findBrowser(override) {
  if (override) {
    if (!fs.existsSync(override) && path.isAbsolute(override)) throw new Error(`Browser not found: ${override}`);
    return override;
  }
  for (const c of candidateBrowsers()) {
    if (!c) continue;
    if (path.isAbsolute(c)) {
      if (fs.existsSync(c)) return c;
    } else {
      const probe = spawnSync(c, ['--version'], { encoding: 'utf8', shell: false });
      if (!probe.error) return c;
    }
  }
  throw new Error('Could not find Chrome/Edge. Install Chrome or run with CHROME_PATH=/path/to/chrome npm run export');
}

function safeName(cardPath, index) {
  const base = path.basename(cardPath, '.html')
    .replace(/[^\p{Script=Han}\w.-]+/gu, '-')
    .replace(/^-+|-+$/g, '') || `card-${index + 1}`;
  return `${String(index + 1).padStart(2, '0')}-${base}.png`;
}

function normalizeTopics(post) {
  return (post.hashtags || post.topics || [])
    .map((t) => String(t).replace(/^#/, '').trim())
    .filter(Boolean);
}

function writeText(file, text) {
  fs.writeFileSync(file, `${text ?? ''}`.replace(/\r\n/g, '\n'), 'utf8');
}

function renderCard(browser, cardFile, outFile) {
  const url = pathToFileURL(cardFile).href;
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--allow-file-access-from-files',
    `--window-size=${CARD_WIDTH},${CARD_HEIGHT}`,
    '--force-device-scale-factor=1',
    '--virtual-time-budget=5000',
    `--screenshot=${outFile}`,
    url,
  ];
  const result = spawnSync(browser, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Chrome failed for ${cardFile}\n${result.stderr || result.stdout}`);
  }
  if (!fs.existsSync(outFile)) throw new Error(`Screenshot missing: ${outFile}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cfg = readConfig();
  const post = cfg.post || {};
  const browser = findBrowser(args.browser);

  if (!args.keep && fs.existsSync(args.out)) fs.rmSync(args.out, { recursive: true, force: true });
  fs.mkdirSync(args.imageDir, { recursive: true });

  const images = [];
  for (let i = 0; i < cfg.cards.length; i += 1) {
    const rel = cfg.cards[i];
    const cardFile = path.resolve(ROOT, rel);
    if (!fs.existsSync(cardFile)) throw new Error(`Card not found: ${rel}`);
    const outFile = path.join(args.imageDir, safeName(rel, i));
    console.log(`[export] ${rel} -> ${path.relative(ROOT, outFile)}`);
    renderCard(browser, cardFile, outFile);
    images.push(path.relative(args.out, outFile).replace(/\\/g, '/'));
  }

  const topics = normalizeTopics(post);
  const title = String(post.title || '').trim();
  const body = String(post.body || '').trim();
  const captionFull = [
    title,
    '',
    body,
    '',
    topics.map((t) => `#${t}`).join(' '),
  ].join('\n').trim();

  const publish = {
    title,
    body,
    topics,
    images,
    author_name: post.author_name || '',
    exported_at: new Date().toISOString(),
    source_config: 'cards.config.js',
  };

  writeText(path.join(args.out, 'title.txt'), title);
  writeText(path.join(args.out, 'body.txt'), body);
  writeText(path.join(args.out, 'topics.txt'), topics.join(','));
  writeText(path.join(args.out, 'caption-full.txt'), captionFull);
  fs.writeFileSync(path.join(args.out, 'publish.json'), `${JSON.stringify(publish, null, 2)}\n`, 'utf8');

  console.log(`\n[done] Publish pack written to ${path.relative(ROOT, args.out)}`);
  console.log(`[done] ${images.length} images, title=${JSON.stringify(title)}, topics=${topics.length}`);
}

main().catch((err) => {
  console.error(`[export:error] ${err.message}`);
  process.exit(1);
});
