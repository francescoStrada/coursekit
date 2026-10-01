---
name: workflow-images
description: Full Cycle C instructions for building the image manifest, sourcing images, writing descriptions, and placing images in a coursekit course repo. Use at the start of any image-related session.
argument-hint: "[C1|C3|C4] [topic-slug]"
---

# Workflow — Cycle C: Images

Cycle C resolves all the image placeholders left during Cycles A and B. It runs partly in parallel with Cycle B — the manifest can be built as soon as the first generated file exists — but placement only happens once images are physically present in `assets/`. Read this skill at the start of any Cycle C session. Also read `${CLAUDE_PLUGIN_ROOT}/skills/manifest/SKILL.md` for the manifest conventions.

Arguments given with this invocation, if any: $ARGUMENTS

---

## Overview

Cycle C has four steps:

| Step | Who | Input | Output |
|------|-----|-------|--------|
| C1 — Build manifest | Claude Code | `slides.qmd`, `index.qmd` | `assets/manifest.md` |
| C2 — Source images | Author | Manifest (`🔍 needed` entries) | Image files in `assets/` |
| C3 — Write descriptions | Author (script is a v1 stub) | Images in `assets/` | Descriptions in `manifest.md` |
| C4 — Place images | Claude Code | `assets/manifest.md` (`📥 sourced` entries) | Images placed in `.qmd` files, manifest updated |

**Topic slug**: the user always gives the slug explicitly in the session opener (e.g. `Topic: shaders-materials`). Use it to construct all paths. If no slug has been stated, ask before proceeding.

**Cycle dependency**: Cycle C requires at least one of `slides.qmd` or `index.qmd` to exist. Full placement requires both to be substantially complete.

---

## C1 — Build or Update the Manifest

### Opening a C1 session

```
Use coursekit:workflow-images — C1. Topic: [slug].
Build or update assets/manifest.md.
```

Read `topics/[slug]/session-log.md`, `topics/[slug]/slides.qmd`, and `topics/[slug]/index.qmd`. Also read `${CLAUDE_PLUGIN_ROOT}/skills/manifest/SKILL.md` before writing or updating the manifest.

### What to do

Scan both `.qmd` files for all image placeholder callouts:

```markdown
::: {.callout-note appearance="minimal"}
📸 **Image placeholder**: suggested "[description option 1]" or "[description option 2]"
:::
```

For each placeholder found, create a manifest entry. Use this format (defined in full in the manifest skill):

```markdown
| Filename | Description | Used in | Status |
|----------|-------------|---------|--------|
| pbr-node-graph.png | PBR node graph showing metallic, roughness, normal inputs | slides slide 3, index section 2 | 🔍 needed |
```

**Status values**: 🔍 needed · 📥 sourced · ✅ placed

**Rules**:
- New entries are always marked `🔍 needed`
- Never change the status of existing `📥 sourced` or `✅ placed` entries — only add new rows
- Propose a descriptive kebab-case filename that reflects the content
- For step-by-step tutorial sequences, use numbered filenames: `01-open-aws-console.png`, `02-select-region.png`, etc.
- If a placeholder suggests two options, pick the one that will be more useful to students — or list both as separate entries if both are genuinely needed

### Output

Write or update `topics/[slug]/assets/manifest.md`. Append a session log entry using `${CLAUDE_PLUGIN_ROOT}/skills/session-log/SKILL.md`.

---

## C2 — Source Images

This step is done by the author, not Claude Code.

Using the manifest as a checklist, source each `🔍 needed` image:
- Screenshots from the course's tools, documentation, or other software
- Captures of rendered results
- Diagram captures from official documentation
- For tutorial sequences: numbered screenshots taken in order

Drop sourced images into `topics/[slug]/assets/`. Update the manifest status to `📥 sourced` for each image added.

This step has no session opener — it is manual work. When it is complete, the author tells Claude Code:

```
I've added images to topics/[slug]/assets/.
Some entries in manifest.md are now 📥 sourced.
Ready for C3.
```

---

## C3 — Write Descriptions

**v1 status**: the `describe-assets` script (`npm run describe-assets -- topics/<slug>`) is a stub. It only prints a "not yet implemented" message. Until it is implemented, the author writes descriptions by hand in the `Description` column of `manifest.md`. The intended behaviour is to send each image in `assets/` to a vision model and write the description into the manifest.

### After descriptions are written

Review the descriptions for accuracy. If a description is wrong or too vague, correct it in `manifest.md` before proceeding to C4.

### Special case: tutorial sequences

For numbered tutorial images (e.g. `01-open-aws-console.png`, `02-select-region.png`), once the descriptions exist, the author can ask Claude Code to build a step-by-step tutorial section:

```
Read topics/[slug]/assets/manifest.md.
Build a step-by-step tutorial section in index.qmd
using images in filename order. Reference each image
with its manifest description and write a brief
explanatory paragraph per step.
Use coursekit:revise output conventions.
```

---

## C4 — Place Images

### Opening a C4 session

```
Use coursekit:workflow-images — C4. Topic: [slug].
Place all 📥 sourced images in slides.qmd and index.qmd.
```

Read `topics/[slug]/session-log.md` and `topics/[slug]/assets/manifest.md`. Follow `${CLAUDE_PLUGIN_ROOT}/skills/revise/SKILL.md` output conventions.

### What to do

For each `📥 sourced` entry in the manifest:

1. Locate the corresponding placeholder callout in `slides.qmd` and/or `index.qmd`
2. Replace the placeholder with a proper Quarto figure include:

```markdown
![Description from manifest](assets/filename.png)
```

3. Update the manifest entry status to `✅ placed`

**Rules**:
- Use the manifest description as alt text verbatim — do not paraphrase
- Only place images that are `📥 sourced` — do not attempt to place `🔍 needed` entries
- Follow the revise skill's output conventions — output only changed blocks, clearly delimited
- Update the `manifest.md` status column for every image placed in the same session

### Output

Targeted edits to `slides.qmd` and/or `index.qmd`. Updated `assets/manifest.md`. Append a session log entry using `${CLAUDE_PLUGIN_ROOT}/skills/session-log/SKILL.md`.

### Cycle C is complete when

All manifest entries are `✅ placed`. Log this in `session-log.md`. At that point the topic is complete and ready for Quarto rendering.

---

## Common Pitfalls

- **Changing the status of already-sourced or placed entries**: never modify existing status entries when building or updating the manifest — only add new rows.
- **Placing images before descriptions exist**: C3 must happen before C4. Alt text matters — don't skip it.
- **Forgetting to update the manifest status after placement**: the manifest is the source of truth. Always keep it current.
- **Regenerating whole files for placement**: placement is surgical. Use the revise conventions and output only changed blocks.
- **Unknown slug**: never construct topic paths by guessing. Always ask if the slug has not been stated.
