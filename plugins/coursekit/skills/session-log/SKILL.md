---
name: session-log
description: Format and append convention for a topic's session-log.md in a coursekit course repo. Read at the end of every session to write the log entry.
---

# Session Log

Read this skill at the end of every session to append a log entry. The session log is the main continuity mechanism: Claude Code reads it at the start of the next session to understand where things stand.

---

## Purpose

Claude Code has no memory between sessions. The session log is the handoff document. A good log entry means the next session starts immediately with full context — no reconstruction, no re-reading completed files to understand their state.

Write log entries for the next session, not as a record for yourself.

---

## Format

Append to `topics/[slug]/session-log.md`. Never overwrite — always append. Use this format:

```markdown
## YYYY-MM-DD (Cycle [X] [Phase] — [Model])
[One paragraph or short list: what was done, what state things are in, what comes next.]
[Any open questions or decisions deferred to the next session.]
```

---

## What to Include

**Always include:**
- Which cycle and phase was active (e.g. Cycle A Planning, Cycle B Generation)
- Which model was used (e.g. Sonnet / Opus)
- What was produced or changed — specific file names and what happened to them
- Current state: is the output approved, in review, pending refinement?
- What the next session should do first

**Include when relevant:**
- Feedback files processed (e.g. `feedback/slide-deck-02.md`)
- Open questions that were not resolved
- Topics flagged during the end-of-generation review (new topics, underweighted concepts)
- Manual edits made by the author between sessions
- Suggestions flagged during refinement that were not yet acted on
- Any deviations from the plan and why

**Do not include:**
- Summaries of the content that was generated — the files themselves are the record
- Lengthy rationale for decisions already made
- Anything that would not help the next session orient quickly

---

## Examples

**After a planning session:**
```markdown
## 2026-03-13 (Cycle A Planning — Sonnet)
High-level mode. Discussed objectives and key concepts for Shaders & Materials.
Proposed 11 slides for 1.5h session. User requested one additional slide on
render cost awareness. plan-slides.md saved and approved.
Next: Cycle A Generation with Opus.
```

**After a generation session:**
```markdown
## 2026-03-18 (Cycle A Generation — Opus)
Generated slides.qmd — 13 slides, 5 image placeholders, 2 Mermaid diagrams.
End-of-generation review flagged: PBR history slide feels thin, may need expanding.
Awaiting author review in Quarto preview before refinement.
Next: Cycle A Refinement — review slides, target thin sections.
```

**After a refinement session:**
```markdown
## 2026-03-20 (Cycle A Refinement — Sonnet)
Applied feedback/slide-deck-01.md. Slide 4 PBR section expanded to two slides.
Slide 9 Mermaid diagram replaced with cleaner LR flowchart.
Author made manual edit to slide 2 intro text.
Slides approved — Cycle A complete.
Next: Cycle B Planning.
```

**After a manual edit by the author:**
```markdown
## 2026-03-22 (Manual edit — author)
Author revised section 3 of index.qmd — tightened resource references.
No Claude Code involvement this session.
Next: Continue Cycle B Refinement from section 4.
```

---

## Logging Manual Edits

When the author says "I made manual edits to [filename] since the last session", log it immediately before proceeding:

```markdown
## [today's date] (Manual edit — author)
Author made manual edits to [filename] before this session.
File re-read to establish current state. [Brief note on what changed if visible.]
```

Then continue with the active task.
