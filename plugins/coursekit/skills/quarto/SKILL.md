---
name: quarto
description: Quarto-native syntax conventions for coursekit course material — Reveal.js slides and HTML guides, text-based graphics with Mermaid, layout constructs, callout blocks, tabsets, and the image placeholder format. Read before every generation session.
---

# Quarto Conventions

Read this skill before every generation session. It covers the exact syntax required for both output formats used in a coursekit course: Reveal.js slides (`slides.qmd`) and HTML guides (`index.qmd`). Also read these alongside it:

- `${CLAUDE_PLUGIN_ROOT}/skills/slides-style/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/writing-style/SKILL.md`

The examples in this skill come from a game-engine course (Blender → Unreal). They illustrate syntax only. Use the course's own domain in real content.

---

## Text-Based Graphics — Core Principle

**Prefer generated diagrams and layout constructs over image placeholders whenever possible.**

This pipeline uses Quarto precisely because it is a text-based rendering system. The goal is to produce visual output — diagrams, system breakdowns, pipeline flows, comparisons — through code and markup rather than hand-made images.

Before reaching for an image placeholder, ask: **can this be expressed as a Mermaid diagram, a column layout, or a styled div?** If yes, do that instead.

The hierarchy for any visual element:

1. **Mermaid diagram** — for flows, pipelines, relationships, sequences, system architectures
2. **Quarto layout construct** — for side-by-side comparisons, grid arrangements, modular block systems
3. **Code block** — for syntax, node graph descriptions, command sequences
4. **Image placeholder** — only when none of the above can represent the content (UI screenshots, rendered results, photographic reference)

An image placeholder should stand for something that has to be *captured* from a tool or the real world, not something that can be *described* in markup.

---

## Reveal.js Slides

### Frontmatter

Each deck carries its own Reveal.js format configuration in its YAML frontmatter. Use the deck template in `${CLAUDE_PLUGIN_ROOT}/skills/slides-style/SKILL.md`, or the *Slide identity* override in `docs/course-profile.md` when one exists. Keep the frontmatter identical across the course's decks, apart from the title, subtitle, and title-slide background.

Minimal form:

```yaml
---
title: "Topic Title"
format: revealjs
---
```

### Slide Separators

```markdown
---
```
New slide (horizontal navigation).

```markdown
##  Slide Title
```
Slide with a title. Use `##` for titled slides, and a bare `---` for untitled slides (image-only, pivot, transition).

### Fragments — Progressive Reveal

Use fragments to reveal content progressively within a slide. Default fragment:

```markdown
::: {.fragment}
This appears on advance.
:::
```

Typed fragments:

```markdown
::: {.fragment .fade-in}
Fades in.
:::

::: {.fragment .highlight-red}
Highlights red on advance.
:::
```

Use fragments on purpose, not by default. See `coursekit:slides-style` for when to use them.

### Column Layouts

For genuine side-by-side comparisons:

```markdown
:::: {.columns}

::: {.column width="50%"}
Left content — e.g. Blender approach
:::

::: {.column width="50%"}
Right content — e.g. Unreal equivalent
:::

::::
```

Adjust the widths for unequal splits (e.g. `40%`/`60%`).

### Speaker Notes

```markdown
::: {.notes}
Instructor notes here. Not visible to audience.
Say: "the key thing to notice here is..."
:::
```

### Background Images (Hero / Full-bleed slides)

```markdown
## {background-image="assets/filename.png" background-size="cover"}
```

No title, no bullets — the image is the slide.

---

## Mermaid Diagrams

Mermaid is the primary tool for any content involving flows, pipelines, relationships, or system architecture. Use it aggressively — it replaces a large category of image placeholders.

### Basic syntax

````markdown
```{mermaid}
flowchart LR
  A[Start] --> B[Process] --> C[End]
```
````

### Flow directions

- `LR` — left to right (pipelines, workflows)
- `TD` / `TB` — top to bottom (hierarchies, decision trees)
- `RL` — right to left
- `BT` — bottom to top

### Flowchart — pipeline or workflow

````markdown
```{mermaid}
flowchart LR
  Blender -->|FBX / glTF| Unreal
  Unreal -->|Sequencer| Output
```
````

### Flowchart — decision / branching

````markdown
```{mermaid}
flowchart TD
  A[Asset ready?] --> B{Check polycount}
  B -->|Under budget| C[Import]
  B -->|Over budget| D[Optimise in Blender]
  D --> B
```
````

### Sequence diagram — tool interactions or pipeline steps

````markdown
```{mermaid}
sequenceDiagram
  Artist->>Blender: Model + UV
  Blender->>Unreal: Export FBX
  Unreal->>Artist: Material slot mismatch
  Artist->>Blender: Fix material names
  Blender->>Unreal: Re-export
```
````

### Cell options

````markdown
```{mermaid}
%%| label: fig-pipeline
%%| fig-cap: "Asset pipeline from Blender to Unreal."

flowchart LR
  Blender --> Unreal --> Output
```
````

Use `%%|` for Mermaid cell options (not `#|`).

### Theming

For consistent rendering, set the Mermaid theme at document level (in the deck frontmatter) or project level rather than inside individual cells:

```yaml
mermaid:
  theme: default
```

Available themes: `default`, `forest`, `dark`, `neutral`, `base`.

### When Mermaid is the right choice

- Pipeline diagrams (tool A → tool B → output)
- Process overviews (input → processing stages → result)
- System component breakdowns (what a tool or engine manages)
- Decision trees (which strategy to use when)
- Workflow sequences (what happens, in which order)

### When Mermaid is not the right choice

- UI screenshots — use an image placeholder
- Rendered results — use an image placeholder
- Node graphs or editors where the actual graph matters — use an image placeholder
- Anything where the visual itself is the content, not a description of relationships

---

## HTML Guide Constructs

### Callout Blocks

Use callout blocks for emphasis, warnings, tips, and procedural notes. Five types:

```markdown
::: {.callout-note}
Supplementary information or context.
:::

::: {.callout-tip}
Practical advice or workflow shortcut.
:::

::: {.callout-warning}
Common mistake or gotcha to avoid.
:::

::: {.callout-important}
Critical requirement — skipping this breaks things.
:::

::: {.callout-caution}
Proceed carefully — recoverable but painful if wrong.
:::
```

Custom title:

```markdown
::: {.callout-tip}
## Naming Convention
Always name Material Instances with the `MI_` prefix.
:::
```

Minimal appearance (used for image placeholders):

```markdown
::: {.callout-note appearance="minimal"}
📸 **Image placeholder**: suggested "[description]"
:::
```

### Tabsets

Use for content with natural alternatives — e.g. two approaches to the same problem, beginner vs. advanced path, Windows vs. Mac steps:

```markdown
::: {.panel-tabset}

## Approach A
Content for approach A.

## Approach B
Content for approach B.

:::
```

### Column Layouts in Guide

For side-by-side comparisons in the HTML guide:

```markdown
:::: {.columns}

::: {.column width="50%"}
**Blender**
Description of the Blender approach.
:::

::: {.column width="50%"}
**Unreal**
Description of the Unreal equivalent.
:::

::::
```

### Grid Layout for Multiple Items

For arranging multiple images or content blocks:

```markdown
::: {layout-ncol=2}
![Caption 1](assets/image1.png)

![Caption 2](assets/image2.png)
:::
```

With unequal weights:

```markdown
::: {layout="[[60,40]]"}
![Wide image](assets/wide.png)

![Narrow image](assets/narrow.png)
:::
```

### Cross-References

Reference figures by label:

```markdown
![Node graph overview](assets/node-graph.png){#fig-nodegraph}

As shown in @fig-nodegraph, the...
```

Reference sections:

```markdown
## Setting Up the Project {#sec-setup}

See @sec-setup for the initial configuration steps.
```

---

## Figures — Both Formats

Standard figure include:

```markdown
![Alt text from manifest description](assets/filename.png)
```

With cross-reference label:

```markdown
![Alt text](assets/filename.png){#fig-identifier}
```

Subfigure group:

```markdown
::: {#fig-comparison layout-ncol=2}
![Roughness 0.0](assets/rough-low.png){#fig-rough-low}

![Roughness 1.0](assets/rough-high.png){#fig-rough-high}

Roughness comparison: mirror-like vs fully diffuse.
:::
```

---

## Image Placeholder Convention

Use this exact callout format wherever an image is needed but not yet available:

```markdown
::: {.callout-note appearance="minimal"}
📸 **Image placeholder**: suggested "[description option 1]" or "[description option 2]"
:::
```

This is the format Cycle C scans for. Do not use any other format for placeholders.

---

## Shared Content

For content that appears in both `slides.qmd` and `index.qmd`, use a shared include file:

```markdown
{{< include _shared.qmd >}}
```

Extract shared content after first drafts are complete — not during generation.

---

## Technical Terms

Use tool, system, and feature names exactly as they appear in the tools students use. Do not paraphrase them, and do not change their capitalisation.

---

## What Not to Do

- Do not let deck frontmatter drift between decks — follow the deck template
- Do not use nested bullets — they are not permitted in slides and should be avoided in the guide
- Do not use image placeholders for content that Mermaid or a layout construct could represent
- Do not modify `_quarto.yml`, `styles.css`, or project scripts unless explicitly instructed
