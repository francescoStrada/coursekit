---
name: workflow-guide
description: Full Cycle B instructions for planning, generating, and refining a topic's long-form HTML guide in a coursekit course repo. Use at the start of any guide-related session — planning, generation, or refinement.
argument-hint: "[planning|generation|refinement] [topic-slug]"
---

# Workflow — Cycle B: Guide

Cycle B covers the full lifecycle of a topic's long-form guide: planning, generation, and surgical refinement. It begins only once the slides (`slides.qmd`) are substantially complete, because the slides are the structural input to guide planning. Read this skill at the start of any Cycle B session. Before generating or refining content, also read:

- `${CLAUDE_PLUGIN_ROOT}/skills/quarto/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/writing-style/SKILL.md`

Arguments given with this invocation, if any: $ARGUMENTS

---

## Overview

Cycle B has three phases:

| Phase | Model | Input | Output |
|-------|-------|-------|--------|
| B1 — Planning | Sonnet | Approved `slides.qmd`, `docs/research-*.md`, topic context | `plan-guide.md` (approved) |
| B2 — Generation | Opus | Approved `plan-guide.md` + `slides.qmd` | `index.qmd` |
| B3 — Refinement | Sonnet | Review feedback | Targeted edits to `index.qmd` |

*Model column valid as of 2026-10-01. Revisit it as the ecosystem changes, for example effort levels.*

**Hard rule**: Do not generate any `.qmd` content until `plan-guide.md` is explicitly approved. If the conversation drifts toward content during planning, redirect: *"Shall we lock the plan before moving to generation?"*

**Topic slug**: the user always gives the slug explicitly in the session opener (e.g. `Topic: shaders-materials`). Use it to construct all paths. If no slug has been stated, ask before proceeding.

**Cycle dependency**: Cycle B cannot begin until Cycle A is complete. If `slides.qmd` does not exist or is not approved, stop and tell the user.

---

## B1 — Planning

### Opening a planning session

Load `coursekit:conventions` if it is not already in context. Then read, in order, using the slug from the session opener:

1. `topics/[slug]/session-log.md` — to understand the current state
2. `topics/[slug]/slides.qmd` — the approved slides are the structural starting point for the guide
3. `topics/[slug]/docs/research-*.md` — every research file for the topic

### What the guide is — and is not

The guide is not a prose version of the slides. The slides frame the topic for a live lecture. The guide is a **resource map** that students use on their own during work sessions.

A good guide:
- Expands on slide topics with deeper explanation where students will need it
- Points to external resources — tutorials, documentation, articles — with brief notes on *why* each matters and *what* to look for
- Adds content that belongs in self-study but not in a lecture (step-by-step details, extended context, edge cases)
- Stays anchored to what students will actually do in the course's domain (see *Domain anchor* in `docs/course-profile.md`)

A good guide does not:
- Reproduce slide content verbatim in prose form
- Try to be a comprehensive textbook
- Add scope beyond what the assignment brief establishes

### Planning discussion

The planning session focuses on four questions:

1. **Depth**: which slide topics need the most expansion? Where will students get stuck and need more guidance?
2. **Resources**: which external tutorials, documentation pages, or articles should be referenced? Why does each one matter? What should students specifically look for?
3. **Additional content**: what belongs in the guide that has no equivalent in the slides? (Worked examples, pipeline notes, common mistakes, extended context)
4. **Structure**: how should the guide's sections map to — or diverge from — the slide structure?

Drive the discussion toward concrete answers. Vague section titles like "Overview" or "Further reading" are not useful — every section should have a clear purpose.

### Feedback rounds

The author may give planning feedback as a file, `topics/[slug]/feedback/guide-plan-NN.md`, instead of in the prompt. Process it following `${CLAUDE_PLUGIN_ROOT}/skills/process-feedback/SKILL.md` (the author may also run `/coursekit:process-feedback <file>`): stay in planning, revise the plan, and list any open questions.

### Output: plan-guide.md

Once the structure is agreed, write `topics/[slug]/plan-guide.md`, replacing the purpose stub that `create-topic` left there. Use this format:

```markdown
# Guide Plan — [Topic Title]

## Context
- Builds on: slides.qmd (approved)
- Assignment: [N]
- Connections: [prior topics or assignments]

## Guide Purpose
[One paragraph: what role this guide plays in the student's workflow — when they'd open it, what they'd use it for]

## Section List
1. **[Section Title]** — [purpose and content: what this section does that the slides don't]
2. ...

## Resources to Reference
- [Resource name / URL]: [why it matters, what students should look for]
- ...

## Additional Content (beyond slides)
- [Any content that belongs in the guide but has no slide equivalent]

## Open Questions
- [Anything unresolved before generation]
```

Do not begin generation until the user gives an explicit approval signal — e.g. "the plan looks good, save it", "approved, let's generate", or equivalent. Ambiguous responses are not approval.

---

## B2 — Generation

### Opening a generation session

The topic slug must be known. If it has not been established, ask.

```
Use coursekit:workflow-guide — generation. Topic: [slug].
plan-guide.md is approved. Generate index.qmd now.
```

Read `topics/[slug]/slides.qmd`, `topics/[slug]/plan-guide.md`, and `topics/[slug]/session-log.md`. Before writing any content, also read the two skills listed at the top of this file.

### Generation rules

- Generate `index.qmd` in a single session. First drafts are complete — do not generate partially and ask for feedback mid-file.
- Use the approved section list as the structural backbone. As with slides, a planned section may expand if the content warrants it. An entirely new topic must be flagged in the end-of-generation review, not inserted silently.
- Use Quarto HTML conventions throughout: callout blocks (`.callout-note`, `.callout-tip`, `.callout-warning`), tabsets where content has natural alternatives, code blocks with language tags for any commands or scripts.
- Insert image placeholder callouts wherever a visual would strengthen the explanation:

```markdown
::: {.callout-note appearance="minimal"}
📸 **Image placeholder**: suggested "[description option 1]" or "[description option 2]"
:::
```

- When referencing external resources, include a brief note on why the resource matters and what students should specifically look for — not just a bare link.
- The guide should feel like a knowledgeable colleague pointing students toward the right resources and flagging what matters — not a textbook trying to cover everything.

### End-of-generation review

After completing the full draft, pause and review it before closing the session. Check for:

- **Missing content**: anything not in the plan that, now that you see the full guide, seems important to flag for discussion?
- **Resource gaps**: are the referenced resources sufficient, or are there obvious missing references for key concepts?
- **Placeholder completeness**: are image placeholders present wherever a visual would help understanding?
- **Slide–guide balance**: does the guide add genuine value beyond the slides, or does it repeat them?

Report findings as a short list. This is a discussion prompt, not a licence to make further changes unilaterally.

### Output

Save as `topics/[slug]/index.qmd`. After generation, append a session log entry using `${CLAUDE_PLUGIN_ROOT}/skills/session-log/SKILL.md`.

---

## B3 — Refinement

### Opening a refinement session

The topic slug must be known. If it has not been established, ask.

```
Use coursekit:workflow-guide — refinement. Topic: [slug].
Target: [section title or line range]. Change: [description].
— or —
Apply the feedback in topics/[slug]/feedback/guide-doc-NN.md.
```

Read `topics/[slug]/session-log.md` and `topics/[slug]/index.qmd`, then follow `${CLAUDE_PLUGIN_ROOT}/skills/revise/SKILL.md`. When the author points to a `guide-doc-NN.md` feedback file, process it following `${CLAUDE_PLUGIN_ROOT}/skills/process-feedback/SKILL.md`. It treats every item as a refinement request and checks earlier rounds for recurring requests.

### Refinement rules

- Never regenerate the full file during refinement. Target the specific section identified.
- Output only the changed block, clearly delimited.
- Do not change content outside the requested scope. Flag other improvements as suggestions — do not apply them silently.
- After each refinement session, append to `session-log.md`.

### Cycle B is complete when

The user is satisfied with `index.qmd` and gives an explicit signal to close the cycle. Log this in `session-log.md` before moving to Cycle C.

---

## Common Pitfalls

- **Starting before Cycle A is complete**: the guide depends on approved slides. Do not begin if the slides are still in flux.
- **Writing a prose version of the slides**: the guide adds depth and resources — it does not restate the lecture.
- **Bare resource links**: every referenced resource needs a brief note on why it matters and what to look for.
- **Silently adding new topics**: flag them in the end-of-generation review, never insert them unilaterally.
- **Regenerating the whole file for small changes**: refinement is always surgical.
- **Forgetting image placeholders**: these feed directly into Cycle C. Every place where a visual aids understanding should have one.
- **Unknown slug**: never construct topic paths by guessing. Always ask if the slug has not been stated.
