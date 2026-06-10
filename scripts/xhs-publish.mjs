#!/usr/bin/env node
/**
 * Send the exported publish pack to Xiaohongshu through opencli.
 *
 * Default mode is draft. Direct publish is available with --publish.
 * Use --dry-run to inspect the generated opencli command without launching it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const DEFAULT_PACK = path.join(ROOT, 'dist', 'xhs-pack');
const MAX_TITLE_LEN = 20;

function parseArgs(argv) {
  const args = {
    pack: DEFAULT_PACK,
    mode: 'draft',
    dryRun: false,
    window: 'foreground',
    siteSession: 'persistent',
    keepTab: 'true',
    title: '',
    body: '',
    topics: '',
    opencli: process.env.OPENCLI_BIN || 'opencli',
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--pack') args.pack = path.resolve(argv[++i]);
    else if (arg === '--draft') args.mode = 'draft';
    else if (arg === '--publish') args.mode = 'publish';
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--window') args.window = argv[++i];
    else if (arg === '--site-session') args.siteSession = argv[++i];
    else if (arg === '--keep-tab') args.keepTab = argv[++i];
    else if (arg === '--title') args.title = argv[++i];
    else if (arg === '--body') args.body = argv[++i];
    else if (arg === '--topics') args.topics = argv[++i];
    else if (arg === '--opencli') args.opencli = argv[++i];
    else if (arg === '-h' || arg === '--help') {
      console.log(`Usage:\n  npm run xhs:draft -- [--pack dist/xhs-pack] [--dry-run]\n  npm run xhs:publish -- [--pack dist/xhs-pack]\n\nOptions:\n  --draft / --publish          Save draft or directly publish\n  --title <text>               Override pack title\n  --body <text>                Override pack body\n  --topics <a,b,c>             Override topics\n  --window foreground|background\n  --site-session persistent|ephemeral\n  --dry-run                    Print opencli command only`);
      process.exit(0);
    }
    else throw new Error(`Unknown option: ${arg}`);
  }
  return args;
}

function shellQuote(value) {
  if (/^[A-Za-z0-9_./:=,@+-]+$/.test(value)) return value;
  return `'${value.replace(/'/g, `'"'"'`)}'`;
}

function readPack(packDir) {
  const publishFile = path.join(packDir, 'publish.json');
  if (!fs.existsSync(publishFile)) {
    throw new Error(`Missing ${publishFile}. Run: npm run export`);
  }
  const pack = JSON.parse(fs.readFileSync(publishFile, 'utf8'));
  const images = (pack.images || []).map((p) => path.resolve(packDir, p));
  for (const image of images) {
    if (!fs.existsSync(image)) throw new Error(`Image missing: ${image}`);
  }
  if (!images.length) throw new Error('publish.json has no images');
  return { ...pack, images };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const pack = readPack(args.pack);
  const title = String(args.title || pack.title || '').trim();
  const body = String(args.body || pack.body || '').trim();
  const topics = String(args.topics || (pack.topics || []).join(',')).trim();

  if (!title) throw new Error('Missing title. Set cards.config.js post.title or pass --title.');
  if (title.length > MAX_TITLE_LEN) {
    throw new Error(`Title is ${title.length} chars, but opencli/xhs requires ≤ ${MAX_TITLE_LEN}. Pass --title "短标题" or shorten cards.config.js.`);
  }
  if (!body) throw new Error('Missing body. Set cards.config.js post.body or pass --body.');

  const opencliArgs = [
    'xiaohongshu', 'publish', body,
    '--title', title,
    '--images', pack.images.join(','),
    '--window', args.window,
    '--site-session', args.siteSession,
    '--keep-tab', args.keepTab,
    '-f', 'yaml',
  ];
  if (topics) opencliArgs.push('--topics', topics);
  if (args.mode === 'draft') opencliArgs.push('--draft');

  console.log(`[xhs] mode=${args.mode}`);
  console.log(`[xhs] title=${title}`);
  console.log(`[xhs] images=${pack.images.length}`);
  if (pack.images.length > 9) {
    console.warn('[xhs:warn] This pack has more than 9 images. The local workflow no longer blocks it, but Xiaohongshu/opencli may still enforce a platform-side limit. If upload fails, split the deck or retry manually.');
  }
  if (topics) console.log(`[xhs] topics=${topics}`);

  const pretty = [args.opencli, ...opencliArgs].map(shellQuote).join(' ');
  if (args.dryRun) {
    console.log(`\n[dry-run] ${pretty}`);
    return;
  }

  console.log('\n[xhs] launching opencli...');
  const result = spawnSync(args.opencli, opencliArgs, { stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

try {
  main();
} catch (err) {
  console.error(`[xhs:error] ${err.message}`);
  process.exit(1);
}
