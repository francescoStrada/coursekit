#!/usr/bin/env node
// managed by coursekit — do not edit in the course repo; change it in coursekit and re-copy (version: see .coursekit-version)
// scripts/create-topic.js
// Usage:
//   node scripts/create-topic.js "Virtual Production"
//   node scripts/create-topic.js "Virtual Production" --desc "Short description"
//
// Creates topics/<kebab-slug>/ with every authoring file stubbed. Each stub
// only states its purpose; the coursekit workflow skills fill in the content.
//   index.qmd, slides.qmd, meta.json
//   plan-slides.md, plan-guide.md, session-log.md
//   docs/       objectives.md, research.md, sources.md, queries.md
//   feedback/   notes.md, slide-plan-00.md, slide-deck-00.md, guide-plan-00.md, guide-doc-00.md
//   assets/     manifest.md

const fs = require('fs');
const path = require('path');

// ── Helpers ──────────────────────────────────────────────────────────────────

function toKebab(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function toTitleCase(s) {
  return String(s)
    .trim()
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getArg(flag) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : null;
}

// A markdown stub: title line + one-line purpose note.
function mdStub(title, purpose) {
  return `# ${title}\n\n> Purpose: ${purpose}\n`;
}

// ── Args ─────────────────────────────────────────────────────────────────────

const raw = process.argv[2];
if (!raw) {
  console.log('Usage: node scripts/create-topic.js "Topic Name" [--desc "Short description"]');
  process.exit(1);
}

const slug       = toKebab(raw);
const title      = toTitleCase(raw);
const desc       = getArg('--desc') || `Short description for ${title}.`;
const today      = new Date().toISOString().slice(0, 10);

// ── Paths ─────────────────────────────────────────────────────────────────────

const topicsDir   = path.join(process.cwd(), 'topics');
const topicDir    = path.join(topicsDir, slug);
const docsDir     = path.join(topicDir, 'docs');
const feedbackDir = path.join(topicDir, 'feedback');
const assetsDir   = path.join(topicDir, 'assets');

if (!fs.existsSync(topicsDir)) {
  console.error('Error: topics/ directory not found. Run this from the repo root.');
  process.exit(1);
}

if (fs.existsSync(topicDir)) {
  console.error(`Error: topic already exists — topics/${slug}`);
  process.exit(1);
}

// ── Create directories ────────────────────────────────────────────────────────

for (const dir of [topicDir, docsDir, feedbackDir, assetsDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

// ── File stubs ────────────────────────────────────────────────────────────────

const files = {
  // meta.json — read by generate-index.js
  'meta.json': JSON.stringify({
    id:     slug,
    title:  title,
    desc:   desc,
    guide:  `./${slug}/`,
    slides: `./${slug}/slides.html`
  }, null, 2) + '\n',

  // Rendered outputs
  'slides.qmd': `---
title: "${title}"
format: revealjs
---

<!-- Purpose: the topic's Reveal.js slide deck. Generated in Cycle A from the approved plan-slides.md (coursekit:workflow-slides). -->
`,

  'index.qmd': `---
title: "${title}"
format: html
---

::: {.callout-note}
**Slides:** [Open presentation](./slides.html)
:::

<!-- Purpose: the topic's long-form guide. Generated in Cycle B from the approved plan-guide.md (coursekit:workflow-guide). -->
`,

  // Plans and log
  'plan-slides.md': mdStub(`Slides Plan — ${title}`,
    'Cycle A plan for slides.qmd. Written during A1 planning and approved before generation (coursekit:workflow-slides).'),
  'plan-guide.md': mdStub(`Guide Plan — ${title}`,
    'Cycle B plan for index.qmd. Written during B1 planning, after the slides are approved (coursekit:workflow-guide).'),
  'session-log.md': `# Session Log — ${title}

## ${today} (Topic created)
Folder scaffolded with create-topic.js.
Cycles A, B, C not yet started.
`,

  // docs/
  'docs/objectives.md': mdStub(`Objectives — ${title}`,
    'Topic scope, learning objectives, scope boundary, and NotebookLM description. Written first, in Cycle 0 (coursekit:workflow-research, Step 0.1).'),
  'docs/research.md': mdStub(`Topic Research — ${title}`,
    'Research synthesis that feeds Cycle A and B planning. Built from the NotebookLM responses (coursekit:workflow-research, Step 0.6). Add a suffix (research-<x>.md) if the topic needs more than one.'),
  'docs/sources.md': mdStub(`Sources — ${title}`,
    'Working source list from automated and manual research, reviewed before loading into NotebookLM (coursekit:workflow-research, Step 0.3).'),
  'docs/queries.md': mdStub(`NotebookLM Queries — ${title}`,
    'NotebookLM interrogation queries with the raw responses pasted below each one (coursekit:workflow-research, Step 0.5).'),

  // feedback/
  'feedback/notes.md': mdStub(`Notes — ${title}`,
    'Running notes that come up while working on this topic. Not a feedback round.'),
  'feedback/slide-plan-00.md': mdStub(`Feedback — Slide Plan 00`,
    'First round of written feedback on plan-slides.md. Process it with /coursekit:process-feedback. Next rounds: slide-plan-01.md, 02, …'),
  'feedback/slide-deck-00.md': mdStub(`Feedback — Slide Deck 00`,
    'First round of written feedback on slides.qmd, applied in Cycle A refinement with /coursekit:process-feedback. Next rounds: slide-deck-01.md, 02, …'),
  'feedback/guide-plan-00.md': mdStub(`Feedback — Guide Plan 00`,
    'First round of written feedback on plan-guide.md. Process it with /coursekit:process-feedback. Next rounds: guide-plan-01.md, 02, …'),
  'feedback/guide-doc-00.md': mdStub(`Feedback — Guide Doc 00`,
    'First round of written feedback on index.qmd, applied in Cycle B refinement with /coursekit:process-feedback. Next rounds: guide-doc-01.md, 02, …'),

  // assets/
  'assets/manifest.md': mdStub(`Image Manifest — ${title}`,
    'Tracks every image needed, sourced, and placed for this topic. Built in Cycle C from the image placeholders (coursekit:manifest).'),
};

for (const [rel, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(topicDir, rel), content);
}

// ── Done ──────────────────────────────────────────────────────────────────────

console.log(`\n✅ Topic created: topics/${slug}/\n`);
console.log('   Files generated:');
for (const rel of Object.keys(files)) {
  console.log(`   ├── ${rel}`);
}
console.log('\nNext: write docs/objectives.md (Cycle 0 — coursekit:workflow-research), then run `npm run generate`.\n');
