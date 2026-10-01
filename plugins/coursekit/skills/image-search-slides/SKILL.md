---
name: image-search-slides
description: Technique for finding remote image URLs to use directly in Reveal.js slides during Cycle A refinement, before Cycle C local assets are sourced. Covers source priority, domain behaviour, fetch-and-verify workflow, and embed patterns.
---

# Image Search for Slides

Use this skill during Cycle A refinement when slides still have 📸 image placeholder callouts, or `background-image="assets/..."` attributes pointing to files that do not exist yet. The goal is to find real remote image URLs that render immediately in the preview. A working visual is better than an empty slot, and stable remote URLs can stay permanently on background slides.

This is **not a replacement for Cycle C**. Inline images inside text slides will still need local files and manifest entries. Remote URLs found here are a primer and a preview tool.

---

## Source Priority

Search in this order — stop when you have enough good images:

### 1. The project's existing topic files
Check other topics' `slides.qmd` files for `background-image` URLs already in use. These are confirmed to work and keep the course visually consistent.

```bash
grep -r "background-image" topics/
```

### 2. Sources already linked in the current topic's slides
The topic's slides already cite articles and tutorials. Fetch those pages first — images from a source the slide already references are editorially consistent.

Extract the list of linked URLs from the current `slides.qmd` before running any web searches.

### 3. General web search
Use `WebSearch` with specific terms (topic + "screenshot", the tool name and version, "tutorial") to find candidate pages. Then fetch those pages.

---

## Known Domain Behaviour

Some sites expose their image URLs in plain HTML, and `WebFetch` can extract them. Others render with JavaScript, so `WebFetch` only sees initialisation code and finds no images. Typical examples of the second kind are YouTube pages and most modern documentation portals.

The course keeps its own list of known-working domains, known-failing domains, and subjects to accept as permanent placeholders in the *Image search* section of `docs/course-profile.md`. Read it before searching. When you discover a new domain that works or fails, suggest adding it to that list.

---

## Fetch and Verify Workflow

### Step 1 — Extract image URLs from a page
```
WebFetch(url, prompt="Extract all direct image URLs from this page (jpg, png, webp, gif). List every image URL found.")
```
This returns a list of candidate URLs. Pick the ones whose description matches what you need.

### Step 2 — Download and inspect each candidate
```
WebFetch(image_url, prompt="Describe what this image shows.")
```
The tool saves a local copy. The sub-model cannot describe images from binary, so ignore its response text. Instead:

```
Read(saved_local_path)
```
Claude Code is multimodal and can see the image directly. Confirm it matches the slide's content need before applying it.

### Step 3 — Apply only confirmed images
Never apply a URL without visually verifying the image via `Read`. A plausible URL can point to the wrong image, an author headshot, or a thumbnail with text overlays.

---

## Embed Patterns

### Full-screen background slide (preferred for impactful visuals)
Replace `assets/filename.png` in a `background-image` attribute with the remote URL:

```markdown
## {background-image="https://cdn.80.lv/api/upload/content/21/68935bd30da11.jpg" background-size="cover" background-opacity="0.9" background-color="#1a1a1a"}

::: {style="position: absolute; bottom: 1.5em; right: 1.5em; font-size: 0.45em; color: rgba(255,255,255,0.65); text-align: right; line-height: 1.8;"}
key word · key word · key word
:::

::: {.notes}
Instructor note for this image slide.
:::
```

A missing `background-image` file is a **silent no-op** in Reveal.js: the slide renders with the fallback background colour, and there is no render error.

### Inline image inside a text slide
Replace the 📸 placeholder callout with a standard Quarto image reference using the remote URL:

```markdown
![Alt text describing the image](https://remote-url/image.jpg){.r-stretch}
```

A missing `![](url)` image **will break the Quarto render** if the URL returns a 404. Only use this pattern with URLs you have verified return a valid image.

### Choosing a pattern
- Use the **full-screen background slide** pattern for high-impact visuals, before/after comparisons, and atmospheric shots.
- Use the **inline** pattern for UI screenshots and diagrams that the surrounding text refers to directly.
- When an inline image is visually strong, consider moving it to a full-screen follow-up slide instead (text slide → image slide). This is the preferred pattern in the coursekit default style.

---

## After This Pass

After running this skill, update the session log with:
- Which placeholders now have remote URLs (live)
- Which remain placeholders, and why
- Whether the remaining placeholders are Cycle C targets or permanent accepts

Placeholders that remain stay as 📸 callouts. They drive the Cycle C manifest.
