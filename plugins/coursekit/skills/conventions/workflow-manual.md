# coursekit Workflow Manual

This manual describes how to use Claude Code to author lecture material in a coursekit course repository. It covers the full lifecycle of a topic — research, planning, generation, refinement, and image management — and sets the conventions that keep sessions efficient, context-rich, and cost-effective.

---

## Core Principles

**Author once, in English.** All planning, authoring, refinement, and rendering happen in English, with one source file per artifact (`slides.qmd`, `index.qmd`). Localization is not supported in this version.

**Two independent creative cycles.** Every topic goes through two distinct cycles — slides first, guide second. Each cycle has its own planning phase, generation step, and refinement loop. The guide cycle cannot begin until the slides are substantially complete, because the slides are its structural input. Do not conflate the two cycles.

**Plan before you generate — and do not generate until the plan is approved.** Every cycle begins with a planning session that produces an approved plan document. Generation starts only once the plan is explicitly approved. This is a hard rule, not a suggestion.

**Generate once, refine surgically.** First drafts are produced in a single dedicated session using the most capable model. All later work targets specific slides or sections — never full-file regeneration.

**Files are the memory.** Claude Code has no memory between sessions. Plan documents, `session-log.md`, and the feedback files are the continuity mechanism. Always read them before starting work.

**Feedback is written, not typed.** The author writes feedback in numbered files under `feedback/`, calmly and completely, and points Claude Code to them. The history of these files shows recurring requests and feeds improvements to the process.

**Skills reduce repetition.** Any instruction repeated across sessions belongs in a skill. Generic skills live in the coursekit plugin. Course-specific skills live in the course repo's `.claude/skills/`.

---

## Model Selection

*Valid as of 2026-10-01. The model line-up and the controls around it (e.g. effort levels) change over time; revisit this table when they do.*

| Phase | Model | Reason |
|-------|-------|--------|
| Planning (both cycles) | Sonnet | Fast, iterative, good for discussion |
| Generation — slides | Opus | Best structural and prose quality |
| Generation — guide | Opus | Coherence across long documents |
| Surgical refinement | Sonnet | Sufficient quality, much faster |
| Manifest, session log, metadata | Sonnet | Lightweight tasks |

As of this date, Claude Code also offers an effort setting (`/effort`). Higher effort suits generation, and lower effort suits refinement and lightweight tasks.

---

## Topic Folder Structure

```
topics/<topic-slug>/
  index.qmd              ← Guide (rendered)
  slides.qmd             ← Reveal.js slides (rendered)
  meta.json              ← Topic metadata (id, title, desc, guide, slides, optional order)
  plan-slides.md         ← Cycle A plan
  plan-guide.md          ← Cycle B plan
  session-log.md         ← Running log of all sessions
  docs/
    objectives.md        ← Topic scope and learning objectives
    research-<x>.md      ← Research synthesis
    sources-<x>.md       ← Source lists
    queries-<x>.md       ← NotebookLM queries and responses
    assignment-<x>.md    ← Assignment briefs
  feedback/
    notes.md             ← Running notes
    slide-plan-NN.md     ← Feedback on plan-slides.md
    slide-deck-NN.md     ← Feedback on slides.qmd
    guide-plan-NN.md     ← Feedback on plan-guide.md
    guide-doc-NN.md      ← Feedback on index.qmd
  assets/
    manifest.md          ← Image tracking table
    *.png / *.jpg        ← Image files
```

Only `.qmd` files listed in `_quarto.yml`'s render globs are rendered. The `.md` working files are not published.

---

## Repository Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `create-topic.js` | `npm run create-topic -- "Topic Name" [--desc "Short description"]` | Scaffolds a new topic folder with every file above, each stubbed with a one-line purpose note |
| `generate-index.js` | `npm run generate` | Rebuilds the home page (`index.qmd`) and the topics index (`topics/index.qmd`) from each topic's `meta.json` |
| `describe-assets.js` | `npm run describe-assets -- topics/<slug>` | **Stub in v1**: prints a "not yet implemented" message. Descriptions are written by hand until it is implemented |

`npm run preview` runs `generate` and then `quarto preview`. `npm run build` runs `generate` and then `quarto render`, which is what CI runs on every push to `main`.

These scripts are managed coursekit files. Do not edit them in the course repo.

---

## Skills Reference

| Skill | Purpose |
|-------|---------|
| `coursekit:conventions` | Standing conventions — loaded at the start of every session |
| `coursekit:workflow-research` | Full Cycle 0 instructions (objectives, source discovery, NotebookLM, research synthesis) |
| `coursekit:writing-style` | Tone, register, and content guidelines for all drafting |
| `coursekit:slides-style` | Slide conventions: deck template, density, archetypes, pacing, visual identity |
| `coursekit:quarto` | Quarto-native syntax conventions for both Reveal.js and HTML output |
| `coursekit:revise` | Standing instructions for surgical refinement |
| `coursekit:session-log` | Format and append convention for `session-log.md` |
| `coursekit:manifest` | Rules for building and updating the image manifest |
| `coursekit:workflow-slides` | Full Cycle A instructions (plan + generate + refine slides) |
| `coursekit:workflow-guide` | Full Cycle B instructions (plan + generate + refine guide) |
| `coursekit:workflow-images` | Full Cycle C instructions (manifest + source + describe + place) |
| `coursekit:image-search-slides` | Finding remote image URLs for slide placeholders |
| `coursekit:process-feedback` | Processing any feedback file (plans, deck, guide, notes) |
| `coursekit:init-course` | Scaffolding a new course repository |
| `coursekit:version` | Checking which coursekit copy and version is loaded |

---

## Content Cycles

Before any content cycle begins, **Cycle 0 (Research)** must be complete. The course author runs Cycle 0 manually. It produces the documents that feed all later cycles: `docs/objectives.md` (topic scope and learning objectives) and `docs/research-*.md` (knowledge synthesised from curated sources via NotebookLM). See `coursekit:workflow-research`.

### Cycle A — Slides

**A1. Planning (Sonnet).** The planning session is a discussion, not a specification exercise. It supports two modes, and Claude Code adapts to what you bring:

- **High-level mode**: you provide learning objectives, key concepts, and target lecture duration. Claude Code proposes the full slide structure autonomously — number of slides, titles, sequencing — and you react to it.
- **Collaborative mode**: you bring specific slide ideas, possibly unordered. You discuss structure and sequencing together, and Claude Code proposes a final arrangement.

The output is `plan-slides.md`. **Claude Code must not generate any qmd content until the plan is explicitly approved.** Planning feedback can be given in `feedback/slide-plan-NN.md` and processed with `/coursekit:process-feedback`.

**A2. Generation (Opus).** Once `plan-slides.md` is approved, Claude Code generates `slides.qmd` in one session, following `writing-style`, `slides-style`, and `quarto`, and inserting 📸 image placeholder callouts wherever visuals would strengthen the content.

**A3. Refinement (Sonnet).** Review the slides in Quarto preview, then refine surgically, either by naming a target or by writing `feedback/slide-deck-NN.md` and processing it with `/coursekit:process-feedback`. Repeat as many times as needed. Cycle A is complete when you say so.

### Cycle B — Guide

Cycle B begins only when the slides are substantially complete. The guide is not a prose version of the slides. It is a resource map that expands on the slide structure with deeper explanation, tutorial references, and documentation pointers, each with a brief note on why it matters and what students should look for.

**B1. Planning (Sonnet)** produces `plan-guide.md` (feedback in `feedback/guide-plan-NN.md`). **B2. Generation (Opus)** produces `index.qmd`. **B3. Refinement (Sonnet)** works the same way as Cycle A refinement (feedback in `feedback/guide-doc-NN.md`). Every feedback file, whatever its type, goes through `/coursekit:process-feedback`, which also checks earlier rounds for recurring requests.

### Cycle C — Images

Image resolution runs partly in parallel with Cycle B and has four steps. The manifest is the handoff document between automated and manual work.

1. **C1** — Claude Code builds or updates `assets/manifest.md` from all placeholder callouts. New entries are marked 🔍 needed.
2. **C2** — The author sources images and drops them into `assets/`, then marks them 📥 sourced. Tutorial sequences use numbered filenames (`01-open-aws-console.png`, …).
3. **C3** — Descriptions are written into the manifest (by hand in v1).
4. **C4** — Claude Code replaces placeholders with Quarto image includes, using the manifest descriptions as alt text, and marks the entries ✅ placed.

---

## Shared Content

For content that appears in both files, use Quarto includes rather than duplicating it:

```
topics/<slug>/_shared.qmd
```

Reference it in both documents as:

```markdown
{{< include _shared.qmd >}}
```

Extract shared content after the first drafts are complete, not during generation.

---

## Session Log Convention

Maintained by Claude Code using `coursekit:session-log`. Read it first when resuming any topic session.

```markdown
# Session Log — Shaders and Materials

## 2026-03-13 (Cycle A Planning — Sonnet)
High-level mode. Defined objectives and key concepts. Claude proposed 9 slides for 1.5h.
Open: decide whether to include a slide on render pipeline impact.

## 2026-03-18 (Cycle A Generation — Opus)
Generated slides.qmd — 9 slides, 6 image placeholders.
Refinement pending after preview review.

## 2026-03-20 (Cycle A Refinement — Sonnet)
Applied feedback/slide-deck-00.md. Revised slides 4 and 7. Slides approved.
```

**On manual edits:** when you have edited a file manually between sessions, tell Claude Code:
```
I made manual edits to [filename] since the last session.
```
Claude Code re-reads the file and logs the edit. No in-file annotation is needed.

---

## Repository Conventions

- Topic folder names: kebab-case, lowercase; a numeric prefix may be used for ordering (e.g. `03-lighting`)
- Image files: descriptive kebab-case, or sequential for tutorials (`01-step-name.png`)
- Managed files (scripts, `styles.css`, `package.json`, the deploy workflow) are never edited in the course repo — fix them in coursekit and re-copy
- Claude Code never commits or pushes. Commit convention: `[topic-slug] cycle — description`
  - e.g. `shaders-materials cycle-a — slides first draft`
  - e.g. `shaders-materials cycle-c — 7 images placed`

---

## Quick Reference — Session Openers

The course repo's `CLAUDE.md` tells Claude Code to load `coursekit:conventions` first, so openers only need the cycle, phase, and slug.

**Cycle 0 — New topic:**
```
Use coursekit:workflow-research — Step 0.1. Topic: [name], slug: [slug].
Assignment: [N — name, or "standalone lecture"]. Help me write docs/objectives.md.
```

**Cycle A — Planning:**
```
Use coursekit:workflow-slides — planning. Topic: [slug].
Assignment: [N]. Session duration: [time].
docs/objectives.md and docs/research-*.md are ready.
```

**Cycle A — Generation:**
```
Use coursekit:workflow-slides — generation. Topic: [slug]. plan-slides.md is approved.
```

**Any feedback file (slide-plan, slide-deck, guide-plan, guide-doc, notes):**
```
/coursekit:process-feedback topics/[slug]/feedback/<type>-NN.md
```

**Cycle A or B — Refinement with a named target:**
```
Use coursekit:workflow-slides — refinement. Topic: [slug].
Target: [slide number or title]. Change: [description].
```

**Cycle B — Planning:**
```
Use coursekit:workflow-guide — planning. Topic: [slug]. Slides are approved.
```

**Cycle B — Generation:**
```
Use coursekit:workflow-guide — generation. Topic: [slug]. plan-guide.md is approved.
```

**Cycle C — Manifest:**
```
Use coursekit:workflow-images — C1. Topic: [slug].
```

**Cycle C — Image placement:**
```
Use coursekit:workflow-images — C4. Topic: [slug]. Place all 📥 sourced images.
```

**Resuming any session:**
```
Topic: [slug]. Read the session log and summarise where we left off before proceeding.
```
