---
name: slides-style
description: Default slide conventions for coursekit decks — deck frontmatter template, density, structure, archetypes, pacing, and visual identity. Read before any slides generation or refinement session, alongside the writing-style skill.
---

# Slides Style

Read this skill before any slides generation or refinement session. It covers slide-specific decisions: structure, density, archetypes, layout, pacing, and the deck's visual identity. Read it alongside `${CLAUDE_PLUGIN_ROOT}/skills/writing-style/SKILL.md`, which covers voice, register, and content principles.

This skill is the coursekit **default visual identity**. A course can keep it as it is or change it. If `docs/course-profile.md` has a *Slide identity* section, its values (deck template, accent colour, closing prompt, cadence) override the matching defaults here. Everything else applies unchanged.

---

## The Role of Slides

Slides support a spoken lecture — they do not replace it. A student reading the slides without hearing the lecture should get the structure and the key concepts, but not the full explanation. The full explanation lives in the instructor's voice and in the long-form guide.

**Slides that are too complete are a failure mode.** If everything is on screen, students read instead of listening. The slide is a visual anchor for attention, not a transcript.

A well-constructed slide:
- Holds one clear idea
- Gives students something to look at while listening
- Leaves room for the spoken explanation to add meaning

---

## Deck Template (default)

Every deck in a course uses the same frontmatter. Only `title`, `subtitle`, and the title-slide background change per deck. Fill the bracketed values from the *Course identity* section of `docs/course-profile.md`.

```yaml
---
title: "[Deck title]"
subtitle: "[Course title] — A.Y. [academic year]"
author: "[Author]"
format:
    revealjs:
        theme: "moon"
        controls: true
        progress: true
        slideNumber: "c/t"
        footer: "[Author] — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)"
        title-slide-attributes:
            data-background-image: "[title-slide image URL or assets/ path]"
            data-background-size: cover
            data-background-opacity: "0.7"
mermaid:
    theme: default
---
```

When an existing deck in the course already follows a different template, match the existing decks and flag the difference to the author.

---

## Structural Grammar

Every standard content slide follows the same anatomy:

1. **Section label** — top-left, uppercase, in the accent colour (default: red). It works as a section marker and visual anchor — the chapter heading that persists across related slides.
2. **Thin horizontal rule** — beneath the label, same accent colour. Separates the header from the content area.
3. **Content** — in the generous whitespace below. Centred or balanced. Never competing with the header.

This structure is not decorative — it is the grammatical frame of the deck. Every slide that introduces, explains, or instructs should follow it. Slides that intentionally break it (pure image slides, transition slides) do so for a reason.

In Reveal.js, the section label and rule can be implemented as styled slide header elements or embedded directly in the slide markdown. Consistency across slides matters more than the exact implementation.

---

## Density Spectrum

A deck works across a controlled range of density modes. Each mode has a specific function. Do not use a denser mode than the content requires.

### Type A — Pivot / Reset
**Characteristics**: one question or short phrase, possibly one large image, maximum whitespace, no bullets.
**Function**: cognitive reset, section transition, tonal shift, posing a question before answering it.
**Rule**: use at transition moments or to open a concept before explaining it. A meme, a provocative image, or a single rhetorical question all belong here. This is where the deck's personality is most visible — dry, self-aware, human.

### Type B — Standard Teaching
**Characteristics**: 3–5 short bullets, generous vertical spacing, no nested bullets, no prose blocks.
**Function**: explaining a concept, listing properties, summarising outcomes.
**Rule**: the default mode for most lecture content. Never exceed 5 bullets. Each bullet should be readable in under 5 seconds.

### Type C — System Explanation
**Characteristics**: short prose intro (1–2 lines), followed by modular labelled blocks arranged visually.
**Function**: explaining a tool, engine, or framework and its components.
**Rule**: when the content is a system with named parts, use visual grouping rather than a bullet list. Labelled blocks in the accent colour are the canonical form of this pattern.

### Type D — Formal Requirements (Maximum Density)
**Characteristics**: 4–8 lines, full requirement statements, key terms emphasised in the accent colour, structured but still no walls of paragraphs.
**Function**: project requirements, exam rules, submission constraints — anything students need to read carefully and refer back to.
**Rule**: this is the upper density limit. Only use it for logistics and formal constraints. Even here, line spacing should stay generous and key terms should be visually emphasised, not buried.

---

## Slide Archetypes

These are the canonical slide types. Every slide you generate should be identifiable as one of them:

1. **Hero / Title** — full-bleed image, course/session title, metadata overlay
2. **Definition** — quote or precise statement, selective keyword emphasis in the accent colour
3. **Visual Inspiration** — large dominant image, minimal text, link below if applicable
4. **Pivot Question** — single question or short provocative phrase, optionally with a resonant image (including memes used with purpose)
5. **Standard Teaching** — section header + 3–5 short bullets
6. **Tool / Ecosystem Layout** — logos or labels arranged spatially to show a toolset or pipeline
7. **System Explanation** — short prose + modular labelled blocks
8. **Section Divider** — single topic label, marks a major transition
9. **Formal Requirements** — dense but structured, key terms emphasised
10. **Timeline / Calendar** — visual schedule, milestones marked
11. **Closing** — question prompt (default: "Questions?") or summary

When generating slides, decide which archetype each slide should be before writing it. Do not default to Type B (standard teaching) for everything — vary the rhythm.

---

## Pacing and Rhythm

Default cadence: **one slide per 60–90 seconds**. For a 1.5-hour session, expect **50–65 slides**. For a 3-hour session with a hands-on component, the lecture portion will be shorter — calibrate accordingly.

This is a high cadence. It works because many slides carry very little content individually — a single image, a single question, a single label block. The density per slide is low; the progression is fast.

**Alternate cognitive load types.** Never run more than 2–3 consecutive Type B slides. Break them up with a visual, a question, or a system diagram. Follow the pattern visual stimulation → conceptual explanation → structural logistics.

---

## Visual Conventions

**Images dominate.** When an image is present, it is the primary element. Text does not compete with it. No overlay clutter. If a visual explanation is possible, prefer it over bullets. When an image is strong, give it its own full-screen slide after the text slide that introduces it.

**The accent colour is load-bearing.** Use it for section labels, horizontal rules, key-term emphasis within text, and modular block labels. Never use it decoratively. Every use of the accent colour should signal hierarchy or semantic importance.

**Titles are informative, not generic.** "Material Instances" is better than "Key Concepts". A question title ("So how is all of this actually done?") is better than "Introduction". Students scanning the slide titles should get a map of the lecture.

**No nested bullets.** Ever. If content needs sub-points, it either needs its own slide or belongs in the guide.

**Columns**: use them only for genuine side-by-side comparisons where the spatial relationship matters. Not for filling space.

---

## Image Placeholders

Every slide that introduces something students will see in their tools should have a visual — a screenshot of the relevant UI, a rendered result, a node graph. Where images are not yet available, insert a placeholder callout:

```markdown
::: {.callout-note appearance="minimal"}
📸 **Image placeholder**: suggested "[description option 1]" or "[description option 2]"
:::
```

Do not leave visual slots empty without a placeholder. These feed Cycle C.

---

## Speaker Notes

Use speaker notes (`::: {.notes} ... :::`) for context the instructor would say aloud but that should not appear on screen — analogies, timing cues, verbal examples, transition prompts. Write them as direct reminders, not as a script to read out.

---

## Common Mistakes

- **Defaulting to Type B for everything**: vary the archetypes. Rhythm matters.
- **Slides that are too complete**: if the slide explains itself fully, nothing is left for the instructor to say.
- **Nested bullets**: not permitted under any circumstances.
- **Generic titles**: "Overview", "Introduction", "Summary" carry no information.
- **Accent colour as decoration**: every use must mean something.
- **Images as sidebars**: if an image is worth including, let it dominate.
- **Forgetting Type A slides**: pivot and reset moments are part of the design, not gaps to fill.
