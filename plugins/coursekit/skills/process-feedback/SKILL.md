---
name: process-feedback
description: Process an author feedback file from a topic's feedback/ folder — slide plan, slide deck, guide plan, guide doc, or running notes. Routes the file to the right action (plan revision or surgical refinement), and checks earlier rounds for recurring requests. Use whenever the author points to a feedback file.
argument-hint: "[path to feedback file, e.g. topics/<slug>/feedback/slide-deck-01.md]"
---

# Process Feedback

Arguments: $ARGUMENTS

The author writes feedback in files under `topics/[slug]/feedback/`, instead of typing it into the prompt. They write each file calmly and reflectively, so it arrives complete and unambiguous. Treat each file as **one complete, considered round of feedback**. The numbered history also records incremental changes and recurring requests, which the author reviews to improve the process.

---

## 1. Identify the file

If no file path was given, list the files in the topic's `feedback/` folder (ask for the slug if it is unknown) and ask which one to process.

Read the file in full. Determine its type from the filename:

| Filename | Feedback on | Action |
|----------|-------------|--------|
| `slide-plan-NN.md` | `plan-slides.md` | **Plan revision** (§3) |
| `guide-plan-NN.md` | `plan-guide.md` | **Plan revision** (§3) |
| `slide-deck-NN.md` | `slides.qmd` | **Refinement** (§4) |
| `guide-doc-NN.md` | `index.qmd` | **Refinement** (§4) |
| `notes.md` | The topic in general | **Notes review** (§5) |

If the filename matches none of these, ask the author what the file is feedback on before acting.

If the file is still the empty stub left by `create-topic` (only a `Purpose:` line), say so and stop.

## 2. Check earlier rounds

Read the earlier rounds of the same type (lower `NN`) and the topic's `session-log.md`. Before acting, report briefly:

- **Recurring requests**: items in this round that repeat requests from earlier rounds. These may point to a rule that belongs in a skill or in `docs/course-profile.md`. Flag them; do not change any skill or profile.
- **Already addressed**: items the session log shows were handled before. Ask whether they still apply.

Keep this report short. If there are no earlier rounds, skip it.

## 3. Plan revision (slide-plan, guide-plan)

Read the current plan (`plan-slides.md` or `plan-guide.md`) and the skill for its cycle (`${CLAUDE_PLUGIN_ROOT}/skills/workflow-slides/SKILL.md` or `${CLAUDE_PLUGIN_ROOT}/skills/workflow-guide/SKILL.md`). Then process every instruction in the file and revise the plan accordingly.

Hard constraints:

- Stay in planning mode — do not generate any qmd content
- Do not write or modify any .qmd files
- If the feedback asks for a revised slide list, present it with a one-line description per slide
- If the feedback asks for a revised guide outline, present it in the same format as plan-guide.md
- At the end of your response, list any open questions that remain before the plan can be locked

Write the revised plan to disk only when the author approves it, as the workflow skill specifies.

## 4. Refinement (slide-deck, guide-doc)

Read the target file (`slides.qmd` or `index.qmd`) and follow `${CLAUDE_PLUGIN_ROOT}/skills/revise/SKILL.md`. Treat every item in the feedback file as a refinement request:

- Make targeted edits only. Do not regenerate the file.
- Ask for clarification only if an item is genuinely ambiguous.
- If an item is not a refinement (a new slide or section not in the plan, a structural change, or more than ~20% of the file), flag it and discuss instead of applying it.
- Deliver the changed blocks in the revise output format and flag other observations without applying them.

## 5. Notes review (notes.md)

`notes.md` holds running notes, not a feedback round. Do not act on it directly. Summarise its items in three groups:
- items that look like feedback on a specific artifact (suggest which feedback file type they belong to)
- items for the course rather than the topic
- items for coursekit itself

Then ask the author what to do with each group.

## 6. Log

Append a session-log entry using `${CLAUDE_PLUGIN_ROOT}/skills/session-log/SKILL.md`. Name the feedback file processed, what was applied, what was flagged, and any recurring requests found in §2.
