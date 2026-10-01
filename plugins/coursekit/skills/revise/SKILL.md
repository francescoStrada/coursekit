---
name: revise
description: Standing instructions for surgical refinement of slides and guide files in a coursekit course repo. Read when making any targeted edit to an existing .qmd file.
---

# Revise

Read this skill for any refinement session — targeted edits to `slides.qmd` or `index.qmd`. The core principle is simple: **change only what was asked, output only what changed.**

---

## Core Rules

**Surgical only.** Never regenerate a full file during refinement. If a change touches more than roughly 20% of a file, stop and flag it — that is a regeneration, not a refinement, and should be handled as a new generation session with an updated plan.

**Output only the changed block.** Do not output the full file. Do not output surrounding unchanged context beyond what is needed to locate the edit. Delimit the changed block clearly so the author can find and apply it.

**Do not change content outside the requested scope.** If you notice other improvements while making the requested change — a weak title nearby, a placeholder that could be a Mermaid diagram — flag them as suggestions at the end. Do not apply them silently.

**Do not alter Quarto syntax or formatting outside the changed block.** A refinement session is not a reformatting pass.

---

## Feedback Files

When the author points to a feedback file (`feedback/slide-deck-NN.md` or `feedback/guide-doc-NN.md`), process it following `${CLAUDE_PLUGIN_ROOT}/skills/process-feedback/SKILL.md`. Apply the rules above to every item.

---

## Output Format

When delivering a refined block, use this format:

```
SLIDE: [slide number or title]
— or —
SECTION: [section title or line range]

[revised content block]

---
Note: [optional — flag other observations here, do not apply them]
```

Identify slides by slide number and title. Identify guide sections by section heading.

If one session changes several blocks, deliver them one after another in the same format, each clearly delimited.

---

## Locating the Target

Before making any change, confirm you are editing the right block:
- For slides: identify by `##` title or slide number in sequence
- For guide sections: identify by `##` or `###` heading
- If the target is ambiguous from the instruction, ask before editing

---

## What Counts as a Refinement

Refinements are changes to existing content. They include:

- Rewriting a slide's bullet points
- Changing a slide title
- Replacing an image placeholder with a placed image
- Adding or removing a fragment
- Expanding or trimming a guide section
- Fixing a Mermaid diagram
- Adjusting speaker notes

## What Is Not a Refinement

These need a different approach — flag them and discuss rather than proceed:

- Adding a slide not in the plan (discuss with the user, see `${CLAUDE_PLUGIN_ROOT}/skills/workflow-slides/SKILL.md`)
- Adding a new section to the guide that is not in the plan (same; see `${CLAUDE_PLUGIN_ROOT}/skills/workflow-guide/SKILL.md`)
- Changing the overall structure or slide order
- Any change affecting more than ~20% of the file

---

## After Refinement

After delivering the changed blocks, append a session log entry using `${CLAUDE_PLUGIN_ROOT}/skills/session-log/SKILL.md`. Note what changed, which feedback file was processed (if any), and any suggestions you flagged.
