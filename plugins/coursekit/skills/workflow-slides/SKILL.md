---
name: workflow-slides
description: Full Cycle A instructions for planning, generating, and refining a topic's Reveal.js slide deck in a coursekit course repo. Use at the start of any slides-related session — planning, generation, or refinement.
argument-hint: "[planning|generation|refinement] [topic-slug]"
---

# Workflow — Cycle A: Slides

Cycle A covers the full lifecycle of a topic's slide deck: planning, generation, and surgical refinement. Read this skill at the start of any Cycle A session. Before generating or refining content, also read:

- `${CLAUDE_PLUGIN_ROOT}/skills/quarto/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/writing-style/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/slides-style/SKILL.md`

Arguments given with this invocation, if any: $ARGUMENTS

---

## Overview

Cycle A has three phases:

| Phase | Model | Input | Output |
|-------|-------|-------|--------|
| A1 — Planning | Sonnet | Course context, `docs/objectives.md`, `docs/research-*.md` | `plan-slides.md` (approved) |
| A2 — Generation | Opus | Approved `plan-slides.md` | `slides.qmd` |
| A3 — Refinement | Sonnet | Review feedback | Targeted edits to `slides.qmd` |

*Model column valid as of 2026-10-01. Revisit it as the ecosystem changes, for example effort levels.*

**Hard rule**: Do not generate any `.qmd` content until `plan-slides.md` is explicitly approved. If the conversation drifts toward content during planning, redirect: *"Shall we lock the plan before moving to generation?"*

**Topic slug**: the user always gives the slug explicitly in the session opener (e.g. `Topic: shaders-materials`). Use it to construct all paths, e.g. `topics/shaders-materials/session-log.md`. If no slug has been stated, ask before reading any topic files or writing any output.

---

## A1 — Planning

### Opening a planning session

Load `coursekit:conventions` and read `docs/course-overview.md`, if they are not already in context. Then read, using the slug from the session opener:

1. `topics/[slug]/session-log.md`
2. `topics/[slug]/docs/objectives.md`
3. `topics/[slug]/docs/research-*.md` — every research file for the topic

Determine which planning mode applies based on what the user brings:

- **High-level mode**: the user provides learning objectives, key concepts, and target duration. Propose the full slide structure autonomously — number of slides, titles, sequencing — and invite reaction.
- **Collaborative mode**: the user brings specific slide ideas, possibly unordered. Discuss structure and sequencing together, then propose a final arrangement.

Open by identifying which mode applies from the user's input, or ask directly if it is unclear. Do not assume.

### Planning discussion

The planning session is a discussion, not a specification exercise. Drive toward clarity on:

- What students should be able to do or understand after this lecture
- Which concepts are essential vs. supplementary
- How this topic connects to prior assignments or other topics in the course (see `docs/course-topics.md`)
- Where the "small but effective" principle applies to scope
- What the appropriate duration and slide count is (Claude Code determines this — it is not negotiated slide by slide)
- Rough image needs

When proposing a slide structure, present it as a numbered list with titles and one-line descriptions. Invite the user to react, challenge, or reorder before locking.

### Feedback rounds

The author may give planning feedback as a file, `topics/[slug]/feedback/slide-plan-NN.md`, instead of in the prompt. Process it following `${CLAUDE_PLUGIN_ROOT}/skills/process-feedback/SKILL.md` (the author may also run `/coursekit:process-feedback <file>`): stay in planning, revise the plan, and list any open questions.

### Output: plan-slides.md

Once the structure is agreed, write `topics/[slug]/plan-slides.md`, replacing the purpose stub that `create-topic` left there. Use this format:

```markdown
# Slides Plan — [Topic Title]

## Context
- Assignment: [N]
- Target duration: [e.g. 1.5 hours]
- Connections: [prior topics or assignments this builds on]

## Learning Objectives
1. [Concrete, actionable — what students can do after]
2. ...

## Slide List
1. **[Slide Title]** — [one-line description of content and purpose]
2. ...

## Key Concepts
- [Concept]: [brief note on how it should be framed]
- ...

## Image Needs (rough)
- [Slide N]: [what kind of visual would help]
- ...

## Open Questions
- [Anything unresolved before generation]
```

**On the Slide List**: it is a structural reference, not a rigid contract. During generation a single planned slide may expand into several slides if the content warrants it; this is expected and needs no discussion. What the list does lock is *topic scope*. If an entirely new topic not in the plan seems important enough to add, do not insert it silently. Flag it in the end-of-generation review instead (see A2).

Do not begin generation until the user gives an explicit approval signal — e.g. "the plan looks good, save it", "approved, let's generate", or equivalent. Ambiguous responses are not approval.

---

## A2 — Generation

### Opening a generation session

The topic slug must be known before starting. If it has not been established, ask.

```
Use coursekit:workflow-slides — generation. Topic: [slug].
plan-slides.md is approved. Generate slides.qmd now.
```

Read `topics/[slug]/plan-slides.md` and `topics/[slug]/session-log.md`. Before writing any content, also read the three skills listed at the top of this file.

### Generation rules

- Generate `slides.qmd` in a single session. First drafts are complete — do not generate partially and ask for feedback mid-file.
- Use the approved slide list as a strong structural reference. Expanding a planned slide into several slides is a free authoring decision. Reordering or removing planned slides must be flagged, not done silently.
- Write the deck's YAML frontmatter from the deck template in `coursekit:slides-style`, or from the *Slide identity* override in `docs/course-profile.md` when one exists.
- Use Reveal.js separators (`---` for a new slide, `##` for a slide title) and Quarto fragment syntax throughout.
- Insert image placeholder callouts wherever a visual would strengthen the slide:

```markdown
::: {.callout-note appearance="minimal"}
📸 **Image placeholder**: suggested "[description option 1]" or "[description option 2]"
:::
```

- Add speaker notes (`::: {.notes} ... :::`) where they add value: context the instructor would say aloud but that should not appear on screen.

### End-of-generation review

After completing the full draft, pause and review the generated file as a whole before closing the session. Check for:

- **Missing topics**: is there anything not in the plan that, now that you see the full picture, seems important enough to discuss? Flag each one explicitly — do not add it to the file.
- **Underweighted concepts**: any planned topic that ended up feeling thin and might deserve more slides in a refinement pass?
- **Placeholder completeness**: are image placeholders present wherever a visual would genuinely help?

Report findings to the user as a short list. This is a discussion prompt, not a request to make further changes unilaterally.

### Output

Save as `topics/[slug]/slides.qmd`. After generation, append a session log entry using `${CLAUDE_PLUGIN_ROOT}/skills/session-log/SKILL.md`.

---

## A3 — Refinement

### Opening a refinement session

The topic slug must be known. If it has not been established, ask.

```
Use coursekit:workflow-slides — refinement. Topic: [slug].
Target: [slide number or title]. Change: [description].
— or —
Apply the feedback in topics/[slug]/feedback/slide-deck-NN.md.
```

Read `topics/[slug]/session-log.md` and `topics/[slug]/slides.qmd`, then follow `${CLAUDE_PLUGIN_ROOT}/skills/revise/SKILL.md`. When the author points to a `slide-deck-NN.md` feedback file, process it following `${CLAUDE_PLUGIN_ROOT}/skills/process-feedback/SKILL.md`. It treats every item as a refinement request and checks earlier rounds for recurring requests.

### Refinement rules

- Never regenerate the full file during refinement. Target the specific slide or section identified.
- Output only the changed block, clearly delimited.
- Do not change content outside the requested scope. If you notice other improvements, flag them as suggestions — do not apply them silently.
- After each refinement session, append to `session-log.md`.

### Cycle A is complete when

The user is satisfied with `slides.qmd` and gives an explicit signal to close the cycle. Log this in `session-log.md` before moving to Cycle B.

---

## Common Pitfalls

- **Starting generation before plan approval**: hard rule, do not do this.
- **Silently adding new topics during generation**: flag them in the end-of-generation review, never insert them unilaterally.
- **Treating the slide list as exhaustive**: a plan entry is a topic anchor, not a one-slide constraint.
- **Regenerating the whole file for small changes**: refinement is always surgical.
- **Forgetting image placeholders**: every place a visual would genuinely help should have one. These drive Cycle C.
- **Unknown slug**: never construct topic paths by guessing. Always ask if the slug has not been stated.
