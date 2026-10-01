---
name: conventions
description: Standing conventions for a coursekit course repository — repository layout, authoring cycles, session continuity, editing discipline, and hard rules. Load at the start of every session in a course repo, before taking any action.
---

# coursekit — Conventions

These are the standing rules for any course repository authored with coursekit. Load this skill at the start of every session, before taking any action. Do not duplicate information available in the referenced documents. Read those documents when their content is needed.

---

## What a Course Repository Is

A coursekit course repository holds the material for one course. It uses a Quarto-based pipeline to generate a course website with long-form HTML guides, and Reveal.js slide decks, from a shared authoring system. All material is authored and rendered in **English**, with one source file per artifact.

The course itself is described by three documents in the course repo. Read them when their content is needed:

| File | Contents |
|------|----------|
| `docs/course-overview.md` | Philosophy and reasoning behind the course, its structure, how it is delivered, assignments, evaluation |
| `docs/course-topics.md` | High-level summary of the course topics and their contents |
| `docs/course-profile.md` | Structural course elements the skills rely on: audience, domain anchor, research defaults, and any overrides of the coursekit style defaults |

The course repo's `CLAUDE.md` adds course-specific rules. Where it deviates from these conventions, `CLAUDE.md` wins.

For the full authoring lifecycle (cycles, phases, model selection, session openers), see [workflow-manual.md](workflow-manual.md). For a map of every document and when to read it, see [documentation-map.md](documentation-map.md).

---

## Repository Structure

```
/
├── CLAUDE.md                     ← Course-specific rules (loads coursekit)
├── docs/
│   ├── course-overview.md        ← Philosophy, structure, delivery, assignments
│   ├── course-topics.md          ← High-level topic summary
│   └── course-profile.md         ← Structural elements and style overrides
├── topics/
│   └── <topic-slug>/
│       ├── index.qmd             ← Guide (rendered)
│       ├── slides.qmd            ← Reveal.js slides (rendered)
│       ├── meta.json             ← Topic metadata
│       ├── plan-slides.md        ← Cycle A plan
│       ├── plan-guide.md         ← Cycle B plan
│       ├── session-log.md        ← Running session log
│       ├── docs/
│       │   ├── objectives.md     ← Topic scope, learning objectives, NotebookLM description
│       │   ├── research-<x>.md   ← Topic research synthesis (suffix optional)
│       │   ├── sources-<x>.md    ← Working source lists (research phase)
│       │   ├── queries-<x>.md    ← NotebookLM queries and responses
│       │   └── assignment-<x>.md ← Assignment briefs related to the topic
│       ├── feedback/
│       │   ├── notes.md          ← Running notes from working on the topic
│       │   ├── slide-plan-NN.md  ← Author feedback on plan-slides.md
│       │   ├── slide-deck-NN.md  ← Author feedback on slides.qmd
│       │   ├── guide-plan-NN.md  ← Author feedback on plan-guide.md
│       │   └── guide-doc-NN.md   ← Author feedback on index.qmd
│       └── assets/
│           ├── manifest.md       ← Image tracking table
│           └── *.png / *.jpg
├── scripts/                      ← create-topic.js, generate-index.js, describe-assets.js (managed)
├── _quarto.yml
├── styles.css                    ← managed
└── package.json                  ← managed
```

Files marked **managed** are copies of coursekit templates and carry a `managed by coursekit vX` header. Never edit them in the course repo. Changes go into coursekit and are copied back.

---

## Quarto Context

All generated content uses Quarto-native syntax and exploits Quarto capabilities fully. Load `coursekit:quarto` before any generation session.

Each slide deck carries its own Reveal.js format configuration in its YAML frontmatter, following the deck template in `coursekit:slides-style` or the override in `docs/course-profile.md`. Guides use the HTML format configured in `_quarto.yml`.

The only image placeholder format is the 📸 callout defined in `coursekit:quarto`.

---

## Authoring Sequence

Every topic begins with a research phase (Cycle 0), followed by three content cycles in strict order:

| Cycle | What | Prerequisite |
|-------|------|-------------|
| 0 | Research — objectives, sources, NotebookLM, research synthesis | None |
| A | Slides — plan, generate, refine | Cycle 0 complete |
| B | Guide — plan, generate, refine | Cycle A complete |
| C | Images — manifest, source, describe, place | Generation complete |

Cycle 0 is executed manually by the course author. See `coursekit:workflow-research` for the full process. Each subsequent cycle has its own planning phase. **Do not begin generation for any cycle until the plan for that cycle is explicitly approved.**

---

## Slide Philosophy

Load `coursekit:slides-style` before generating slides. Key principles:

- One clear idea per slide — split rather than cram
- Slides are informative but not verbose; they support spoken explanation, they do not replace it
- Claude Code determines the appropriate number of slides from objectives, key concepts, and target duration — this is not negotiated slide by slide during planning
- Planning provides constraints; Claude Code provides structure

---

## Writing Guidelines

Load `coursekit:writing-style` before any drafting or editing. Key principles:

- Ground concepts in what students will actually do or see in the course's domain (see *Domain anchor* in `docs/course-profile.md`)
- Connect new concepts to the students' prior knowledge (see *Audience* in `docs/course-profile.md`)
- The long-form guide is a **resource map**: reference tutorials and documentation with brief explanations of why each resource matters and what students should look for
- Keep the "small but effective" principle present — scope is always constrained, quality is not
- Master's level register: precise, professional, accessible — no padding or filler

---

## Skills

Load skills explicitly when their task is relevant. Do not guess at skill contents — load the skill.

| Skill | When to use |
|-------|------------|
| `coursekit:workflow-research` | When beginning work on a new topic (Cycle 0) |
| `coursekit:quarto` | Every generation session |
| `coursekit:writing-style` | Every drafting or editing session |
| `coursekit:slides-style` | Every slides generation session |
| `coursekit:workflow-slides` | Cycle A sessions |
| `coursekit:workflow-guide` | Cycle B sessions |
| `coursekit:workflow-images` | Cycle C sessions |
| `coursekit:revise` | Any surgical refinement |
| `coursekit:session-log` | End of every session |
| `coursekit:manifest` | Building or updating the image manifest |
| `coursekit:image-search-slides` | Finding remote image URLs for slide placeholders during Cycle A refinement |
| `coursekit:process-plan-feedback` | Processing an author feedback file from `feedback/` |
| `coursekit:init-course` | Scaffolding a new course repository (run once) |
| `coursekit:version` | Checking which coursekit copy and version is loaded |

Course-specific skills may live in the course repo's `.claude/skills/`. If one is present and its name suggests relevance, load it.

---

## Session Continuity

Claude Code has no memory between sessions. At the start of every session:

1. Load this skill (the course repo's `CLAUDE.md` is already in context)
2. Read `docs/course-overview.md` if course-level context is needed
3. Read `topics/[slug]/session-log.md` to understand current state
4. Read the relevant plan document (`plan-slides.md` or `plan-guide.md`) for the active cycle

At the end of every session, use `coursekit:session-log` to append a log entry.

---

## Feedback Files

The author writes feedback in files under `topics/[slug]/feedback/` instead of typing it into the prompt. The files are written calmly and reflectively, so the feedback arrives complete and unambiguous. Their numbered history shows incremental changes and recurring requests, which feeds a self-improvement loop.

| File | Feedback on |
|------|-------------|
| `slide-plan-NN.md` | `plan-slides.md` |
| `slide-deck-NN.md` | `slides.qmd` |
| `guide-plan-NN.md` | `plan-guide.md` |
| `guide-doc-NN.md` | `index.qmd` |
| `notes.md` | Running notes from working on the topic — not a feedback round |

`NN` is a two-digit sequence starting at `00`. When the author points to a feedback file, read it in full and treat it as the author's feedback for the current session. `coursekit:process-plan-feedback` handles the planning case.

---

## Manual Edits

When the course author has made manual edits between sessions, they will say:

> "I made manual edits to [filename] since the last session."

When you hear this: read the current file state before proceeding, and log the manual edit using `coursekit:session-log`. No in-file annotation is used.

---

## Editing Discipline

- Never regenerate an entire file during refinement — target specific sections or slides only
- Output only the changed block unless a full-file output is explicitly requested
- Do not change content outside the requested scope — flag other improvements as suggestions
- Do not modify `meta.json`, `_quarto.yml`, `styles.css`, scripts, or any managed file unless explicitly instructed
- Do not commit or push — always done manually by the course author. The author's commit convention is `[topic-slug] cycle — description` (e.g. `shaders-materials cycle-a — slides first draft`)

---

## Hard Rules

- Do not generate any qmd content before the relevant plan document is approved
- Do not add content not present in the approved plan
- Never guess a topic slug — if it has not been stated, ask
- If the conversation during planning drifts toward content generation, redirect: *"Shall we lock the plan before moving to generation?"*
