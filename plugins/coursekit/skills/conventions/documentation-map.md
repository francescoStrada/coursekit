# coursekit Documentation Map

A map of every document in a coursekit course repository and in the plugin, and when to read each. Use it to read the right files in the right context without re-explaining the structure each session.

The course may also have a claude.ai project used for discussion and for preparing documents or prompts that are then brought into Claude Code. Claude Code has no access to it. If knowledge seems to be missing, ask the author to check there.

---

## Course Repository Documents

### `CLAUDE.md`
**What it is**: course-specific operational rules. It is loaded automatically in every Claude Code session and tells Claude Code to load `coursekit:conventions` first.
**What it contains**: the course title block, pointers to the course docs, and course-specific rules that add to or deviate from coursekit.

### `docs/course-overview.md`
**What it is**: the course's philosophy and reasoning, structure, delivery, assignments, and evaluation. It is free-form.
**When to read**: when course-level context is needed — assignment briefs, evaluation questions, course philosophy. Read it once per topic cycle if the topic is directly tied to an assignment.

### `docs/course-topics.md`
**What it is**: a high-level summary of the course topics and their contents. It is free-form.
**When to read**: when planning a topic's connections to other topics, or when sequencing material.

### `docs/course-profile.md`
**What it is**: the structural course elements the coursekit skills rely on.
**What it contains**:
- *Course identity*
- *Audience*
- *Domain anchor*
- *Research defaults*
- optional overrides of the coursekit style defaults (*Slide identity*, *Writing style overrides*)
- the course's *Image search* domain lists

**When to read**: whenever a skill refers to one of its sections.

---

## Per-Topic Files

Located at `topics/<topic-slug>/`.

| File | What it is | When to read |
|------|------------|--------------|
| `docs/objectives.md` | Seed document: topic context, student prior knowledge, 3–5 learning objectives, scope boundary, NotebookLM description, open questions. Written by the author before any other work. Does not include session duration | Cycle A planning; whenever topic intent or scope boundary matters |
| `docs/sources-<x>.md` | Working source list from automated and manual research | Rarely — it is the author's research working document |
| `docs/queries-<x>.md` | NotebookLM queries with raw responses | When building the research synthesis |
| `docs/research-<x>.md` | Research synthesis: learning sequence, cited core concepts, workflows, mistakes, trade-offs, entry points, videos, scope notes. Use only if its status line reads `READY FOR CYCLE A` | Cycle A and Cycle B planning |
| `docs/assignment-<x>.md` | Assignment briefs tied to the topic | When the topic feeds an assignment |
| `plan-slides.md` | Approved slides plan | Cycle A generation |
| `plan-guide.md` | Approved guide plan | Cycle B generation |
| `session-log.md` | Append-only continuity log, one entry per session | Start of every session; summarise before proceeding |
| `slides.qmd` | Reveal.js deck (rendered) | Cycle A refinement; Cycle B planning |
| `index.qmd` | Guide (rendered) | Cycle B refinement; Cycle C |
| `feedback/*.md` | The author's written feedback rounds and running notes | When the author points to one |
| `assets/manifest.md` | Image tracking table | Cycle C |

---

## Plugin Documents

| Document | What it is |
|----------|------------|
| `coursekit:conventions` | Standing rules — loaded at the start of every session |
| [workflow-manual.md](workflow-manual.md) | Full authoring lifecycle, model selection, scripts, session openers |
| This map | Where everything lives |
| Workflow and style skills | See the skills table in `coursekit:conventions` |

---

## Pipeline Summary

```
Cycle 0 — Research (manual, by the course author)
  docs/objectives.md → docs/sources-*.md → NotebookLM (docs/queries-*.md) → docs/research-*.md

Cycle A — Slides (Claude Code)
  [reads: docs/objectives.md, docs/research-*.md]
  plan-slides.md (approved) → slides.qmd

Cycle B — Guide (Claude Code)
  [reads: slides.qmd, docs/research-*.md]
  plan-guide.md (approved) → index.qmd

Cycle C — Images (Claude Code + manual)
  assets/manifest.md → source images → descriptions → place images
```

**Hard rules that apply across all cycles:**
- No generation before the relevant plan is explicitly approved
- No content added beyond what is in the approved plan
- No full-file regeneration during refinement — surgical edits only
- Topic slugs are always given explicitly — never guessed
