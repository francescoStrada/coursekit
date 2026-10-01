// managed by coursekit — do not edit in the course repo; change it in coursekit and re-copy (version: see .coursekit-version)
// scripts/generate-index.js
// Node 14+
// - Generates root index.qmd (home page) by combining home_content.qmd (default) or --content <file>
//   and auto-generated topic cards from topics/*/meta.json
// - Also writes topics/index.qmd (overall topics page)
// - Normalizes links to root-relative paths so they work from any page
// - Supports sorting: numeric meta.order first (ascending), then remaining topics alphabetically by title

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const topicsDir = path.join(repoRoot, 'topics');
const outRootIndex = path.join(repoRoot, 'index.qmd');
const outTopicsIndex = path.join(topicsDir, 'index.qmd');
const defaultContentFile = path.join(repoRoot, 'home_content.qmd');

function parseArgs() {
  const argv = process.argv.slice(2);
  let content = null;
  for (let i = 0; i < argv.length; i++) {
    if ((argv[i] === '--content' || argv[i] === '-c') && argv[i + 1]) {
      content = argv[i + 1];
      i++;
    } else if (argv[i] === '--help' || argv[i] === '-h') {
      console.log('Usage: node scripts/generate-index.js [--content path/to/file.qmd]');
      process.exit(0);
    }
  }
  return { content };
}

function readMeta(folder) {
  const metaPath = path.join(folder, 'meta.json');
  if (!fs.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch (e) {
    console.error('Error parsing', metaPath, e.message);
    return null;
  }
}

function slugFromMetaOrFolder(m, folderName) {
  if (m && m.id) return String(m.id).trim();
  // fallback: use folder name (already likely kebab-case)
  return String(folderName || '').trim();
}

function cleanSlug(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeToRootTopicPath(value, slug, type) {
  // type: 'guide' or 'slides'
  // Return a root-relative path starting with '/'
  if (value) {
    const v = String(value).trim();
    if (v.startsWith('/')) return v; // already root-relative
    if (v.includes('topics/')) {
      // ensure leading slash and remove leading './' if present
      const s = v.replace(/^\.\//, '');
      return s.startsWith('/') ? s : '/' + s;
    }
    // if the value looks like './slug' or 'slug' or './slug/' or './slug/slides.html'
    const cleaned = v.replace(/^\.\//, '').replace(/^\/+/, '').replace(/\/$/, '');
    if (cleaned === slug) return `/topics/${slug}/`;
    if (cleaned === `${slug}/slides.html` || cleaned === `${slug}/slides`) return `/topics/${slug}/slides.html`;
    // otherwise treat it as relative to root
    return '/' + cleaned;
  }

  // default when missing
  return type === 'slides' ? `/topics/${slug}/slides.html` : `/topics/${slug}/`;
}

function buildCompactListHtml(topics) {
  const links = topics.map(m => {
    const slug = cleanSlug(m.id || m._folder);
    const guideHref = normalizeToRootTopicPath(m.guide, slug, 'guide');
    const title = m.title ? m.title : slug;
    return `<a href="${guideHref}">${title}</a>`;
  });
  return `\n<p class="topics-compact">${links.join(' &nbsp;·&nbsp; ')}</p>\n`;
}

function buildCardHtml(m, slug) {
  const guideHref = normalizeToRootTopicPath(m.guide, slug, 'guide');
  const slidesHref = normalizeToRootTopicPath(m.slides, slug, 'slides');
  const desc = m.desc ? m.desc : '';
  const title = m.title ? m.title : slug;

  // Raw HTML lines starting at column 0 (no leading spaces)
  return `
<section class="topic-card">
<h2>${title}</h2>
<div class="topic-row">
<div class="topic-buttons">
<a class="btn btn-primary" href="${guideHref}">📖 Guide</a>
<a class="btn btn-secondary" href="${slidesHref}" target="_blank">🎞 Presentation</a>
</div>
<div class="topic-desc">
<p>${desc}</p>
</div>
</div>
</section>
`;
}

// Build ordered list of topic metadata objects with slug
function collectTopics() {
  if (!fs.existsSync(topicsDir)) return [];

  const folders = fs.readdirSync(topicsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(n => !n.startsWith('.'));

  const items = [];
  for (const folder of folders) {
    const folderPath = path.join(topicsDir, folder);
    const meta = readMeta(folderPath);
    if (!meta) continue; // skip folders with no meta.json (not a publishable topic)
    const rawSlug = slugFromMetaOrFolder(meta, folder);
    const slug = cleanSlug(rawSlug || folder);
    items.push(Object.assign({}, meta, { id: slug, _folder: folder, _hasMeta: true }));
  }

  // Sorting:
  // - Items with numeric 'order' (meta.order) come first, ascending by order
  // - Items without 'order' come after, sorted alphabetically by title (case-insensitive)
  items.sort((a, b) => {
    const aHas = typeof a.order === 'number';
    const bHas = typeof b.order === 'number';
    if (aHas && bHas) return a.order - b.order;
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    // neither has order -> alphabetical by title (fallback to id)
    const ta = String(a.title || a.id || '').toLowerCase();
    const tb = String(b.title || b.id || '').toLowerCase();
    return ta.localeCompare(tb);
  });

  return items;
}

function loadHomeContent(explicitPath) {
  // If explicit path provided, load it (absolute or relative to repo root)
  if (explicitPath) {
    const full = path.isAbsolute(explicitPath) ? explicitPath : path.join(repoRoot, explicitPath);
    if (!fs.existsSync(full)) {
      console.error('Content file not found:', full);
      process.exit(1);
    }
    return fs.readFileSync(full, 'utf8'); // include full content & front matter
  }

  // Default: use home_content.qmd if exists
  if (fs.existsSync(defaultContentFile)) {
    return fs.readFileSync(defaultContentFile, 'utf8');
  }

  // fallback built-in minimal page header+intro
  return `---
title: "Lecture Material Pipeline"
format: html
---

# Lecture Material Pipeline

Create a file named \`home_content.qmd\` to customize this page.

## Topics
`;
}

function writeRootIndex(content, topicsHtml) {
  const out = content + '\n' + topicsHtml;
  fs.writeFileSync(outRootIndex, out, 'utf8');
  console.log('Wrote', outRootIndex);
}

function writeTopicsIndex(topicsHtml) {
  // write a topics/index.qmd with a minimal header and topics list (useful as an overall topics page)
  const header = `---
title: "Topics"
format: html
---

# Topics

Below is the list of topics.
`;
  const out = header + '\n' + topicsHtml;
  fs.writeFileSync(outTopicsIndex, out, 'utf8');
  console.log('Wrote', outTopicsIndex);
}

function main() {
  const args = parseArgs();

  if (!fs.existsSync(topicsDir)) {
    console.warn('Warning: topics/ directory not found. Nothing to generate (no topics).');
  }

  // Build topics
  const topics = collectTopics();

  // Build HTML for compact list and full cards
  let topicsHtml = '';
  for (const m of topics) {
    const slug = cleanSlug(m.id || m._folder);
    topicsHtml += buildCardHtml(m, slug);
  }
  const compactHtml = buildCompactListHtml(topics);

  // Load home content (explicit override or default file or fallback)
  const homeContent = loadHomeContent(args.content);

  // Write root index and topics index
  writeRootIndex(homeContent, compactHtml + topicsHtml);
  // also write topics/index.qmd for the overall topics page
  writeTopicsIndex(compactHtml + topicsHtml);

  console.log('Generation complete. Topics:', topics.length);
}

main();