---
name: manifest
description: Rules for building and updating a topic's image manifest (assets/manifest.md) in a coursekit course repo. Read when creating or modifying the manifest.
---

# Manifest

Read this skill when building or updating `assets/manifest.md` for a topic. The manifest is the handoff document between content generation and image sourcing. It tracks every image that is needed, sourced, and placed across both `slides.qmd` and `index.qmd`.

---

## Purpose

The manifest is the single source of truth for image state in a topic. At any point in Cycle C it answers three questions:

- What images are still needed?
- What has been sourced but not yet placed?
- What is fully done?

It also provides the alt text used when placing images.

---

## Format

`assets/manifest.md` is a markdown table with four columns. `create-topic` leaves only a purpose stub, so on first use replace the stub with a title line and this table header:

```markdown
# Image Manifest — [Topic Title]

| Filename | Description | Used in | Status |
|----------|-------------|---------|--------|
```

| Column | Contents |
|--------|----------|
| **Filename** | Proposed kebab-case filename including extension |
| **Description** | What the image shows — written by the author after sourcing, or by Claude Code if the content is unambiguous |
| **Used in** | Where the image appears — e.g. `slides slide 4`, `index section 2`, or both |
| **Status** | Current state — one of three values (see below) |

**Descriptions in v1**: the `describe-assets` script is a stub that only prints a "not yet implemented" message. Until it is implemented, descriptions are written by hand.

---

## Status Values

| Status | Meaning |
|--------|---------|
| 🔍 needed | Image identified from placeholder, not yet sourced |
| 📥 sourced | Image file exists in `assets/`, description not yet written or placement not yet done |
| ✅ placed | Image placed in the relevant `.qmd` file(s), placeholder replaced |

---

## Building the Manifest (C1)

Scan both `slides.qmd` and `index.qmd` for all image placeholder callouts:

```markdown
::: {.callout-note appearance="minimal"}
📸 **Image placeholder**: suggested "[description option 1]" or "[description option 2]"
:::
```

For each placeholder, create one manifest row:

- **Filename**: propose a descriptive kebab-case name that reflects the content — e.g. `nanite-lod-visualisation.png`, `pbr-node-graph-inputs.png`. Use `.png` by default.
- **Description**: leave blank at C1, or fill it in if the content is unambiguous
- **Used in**: note the exact location — slide number and title, or guide section heading
- **Status**: always `🔍 needed` for new entries

If a placeholder suggests two options, pick the one most useful to students — or create two rows if both are genuinely needed in different places.

---

## Naming Conventions

**Standard images**: descriptive kebab-case, specific enough to be unambiguous:
- ✓ `lumen-gi-comparison-direct-vs-indirect.png`
- ✓ `metahuman-creator-dna-sliders.png`
- ✗ `screenshot.png`
- ✗ `image1.png`

**Tutorial step sequences**: numbered prefix, descriptive suffix:
```
01-open-project-settings.png
02-select-rendering-mode.png
03-enable-nanite.png
```
Numbering must be sequential and zero-padded so files sort consistently.

---

## Updating the Manifest

**Adding new entries**: always append new rows. Never remove or overwrite existing rows.

**Updating status**: change the status column only — never modify the filename, description, or location of an existing entry unless you are correcting a clear error.

**After sourcing** (done by the author, not Claude Code): the author changes the status from 🔍 needed to 📥 sourced after dropping image files into `assets/`.

**Descriptions**: review every description before placement. If one is wrong or too vague, correct it before proceeding to C4.

**After placement** (C4): change the status from 📥 sourced to ✅ placed for each image placed in the session.

---

## Status Change Rules

| Transition | Who | When |
|-----------|-----|------|
| (new) → 🔍 needed | Claude Code | C1 — building manifest |
| 🔍 needed → 📥 sourced | Author | After dropping file in `assets/` |
| 📥 sourced → ✅ placed | Claude Code | C4 — after placing in `.qmd` file |

**Never skip a status.** An image cannot go from 🔍 needed to ✅ placed without first being physically present in `assets/`.

**Never reverse a status.** If a placed image needs to be changed, note it as a manual edit in `session-log.md` and update the description — do not reset the status to 🔍 needed.

---

## Example Manifest

```markdown
| Filename | Description | Used in | Status |
|----------|-------------|---------|--------|
| nanite-lod-threshold.png | Nanite LOD threshold visualisation in the Statistics overlay | slides slide 5, index section 3 | ✅ placed |
| pbr-node-graph-inputs.png | PBR material node graph showing Metallic, Roughness, and Normal inputs | slides slide 7 | 📥 sourced |
| lumen-gi-comparison.png | | index section 4 | 🔍 needed |
| 01-open-project-settings.png | Project Settings window with Rendering category selected | index section 2 tutorial | ✅ placed |
| 02-enable-nanite.png | Nanite checkbox enabled in Project Settings Rendering panel | index section 2 tutorial | ✅ placed |
```

---

## Relationship to Cycle C

The manifest is built in C1, gets its descriptions in C3, and is updated to ✅ placed in C4. Between C1 and C3 the author owns the manifest — Claude Code does not modify it during the sourcing phase. See `${CLAUDE_PLUGIN_ROOT}/skills/workflow-images/SKILL.md` for the full Cycle C process.
