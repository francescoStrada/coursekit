# Migrating TA-4-cinema-and-game onto coursekit v1

A checklist for moving the Technical Art course repo from its in-repo framework (`CLAUDE.md` + `skills/` + `docs/`) onto the coursekit plugin. Run it first on a **throwaway copy** (see `smoke-test.md`), then for real at the start of the semester.

Facts this checklist relies on (verified 2026-10-01):

- Every `*.qmd` "Italian" file is byte-identical to its `*_ENG.qmd` source, except two. Cycle D never ran, so going English-only loses no content:
  - `06-reality-capture/slides`: the `_ENG` subtitle is longer
  - `07-vfx/slides`: both files are stubs
- The build-layer files in the repo are identical to the coursekit templates apart from the managed-file header. The exceptions are `create-topic.js` (new layout), `package.json` (new `describe-assets` script, new name) and `package-lock.json` (new name).

---

## 0. Prepare

- [ ] Work on a branch: `git switch -c coursekit-v1`
- [ ] Decide what to do with the untracked `AGENTS.md` at the repo root (it was not created by coursekit). It is likely superseded by the plugin.
- [ ] Launch Claude Code with coursekit loaded: a development checkout (`claude --plugin-dir <coursekit>/plugins/coursekit`) or the installed release (step 6)

## 1. Remove the in-repo framework

- [ ] `skills/` (all 12 files) — replaced by the coursekit skills
- [ ] `docs/claude-code-workflow-manual.md` — replaced by `coursekit:conventions` → workflow-manual
- [ ] `docs/documentation-overview.md` — replaced by `coursekit:conventions` → documentation-map
- [ ] `.claude/commands/process-plan-feedback.md` — replaced by `/coursekit:process-plan-feedback`
- [ ] Empty leftovers at the root: `assets/`, `CLAUDE_files/`
- [ ] Keep: `docs/course-overview.md`, `docs/Esame-Finale.md`, `_overall-notes.md` (author notes), `.claude/settings.local.json` (personal)

## 2. Course documents

- [ ] Replace `CLAUDE.md` with the coursekit template (`templates/course-repo/CLAUDE.md`), filled in as follows:
  - Title block: `Technical Art for Game and Cinema · A.Y. <new A.Y.> · Politecnico di Torino`
  - Course-specific rules:
    - `topics/extra/` holds multi-page sections outside the topic cards (e.g. `tech-setup/`, with a docked sidebar declared in `_quarto.yml` and a `_metadata.yml`)
    - `topics-WIP/` stages unfinished topics outside the rendered site; move a topic into `topics/` when it is ready
    - `_variables.yml` holds every course URL (calendar, groups, Notion, Discord, NotebookLM notebooks, AMI IDs); reference them with `{{< var name >}}`
- [ ] `docs/course-overview.md`: keep the existing file (it already matches the definition)
- [ ] `docs/course-topics.md`: new. Write a short summary of the topics in teaching order. The *Topics and Assignments* section of `course-overview.md` and each topic's `meta.json` `desc` are good starting points
- [ ] `docs/course-profile.md`: new. Start from Appendix A below, which collects the TA-specific content removed from the skills
- [ ] Optional: rename `docs/Esame-Finale.md` → `docs/exam-final.md` (course-level docs have no naming rule)

## 3. Topics (repeat for every folder in `topics/0*` and `topics-WIP/*`)

Files to rename or move (`git mv` keeps history):

| From | To |
|------|----|
| `slides_ENG.qmd` | `slides.qmd` (overwrite — see the exceptions below) |
| `index_ENG.qmd` | `index.qmd` (overwrite) |
| `research/topic-research.md` | `docs/research.md` |
| `research/topic-research-<x>.md` | `docs/research-<x>.md` |
| `research/sources-draft.md` | `docs/sources.md` |
| `research/notebooklm-queries.md`, `research/notebook-lm-queries.md` | `docs/queries.md` |
| `research/notebooklm-queries_old.md` (05) | `docs/queries-old.md`, or delete |
| `research/UE5 Orientation Guide_ … .md` (01) | `docs/research-ue5-orientation.md` |
| `docs/Assignment-<N>.md`, `docs/Assignment-4-draft.md` | `docs/assignment-<N>.md`, `docs/assignment-4-draft.md` |
| `docs/activity-brief.md` (01) | `docs/assignment-activity-brief.md` |
| `docs/open-questions.md` (05) | fold into `docs/objectives.md` → *Open Questions*, or keep as is |
| `docs/_notes.md` | `feedback/notes.md` |
| `feedbacks/` (00) | `feedback/` |
| `feedback/slide-plan-feedback-NN.md`, `plan-feedback-NN.md` (00) | `feedback/slide-plan-NN.md` |
| `feedback/slide-revise-feedback-NN.md`, `slide-revision-feedback-NN.md`, `slide-feedback-NN.md` (00) | `feedback/slide-deck-NN.md` |
| `feedback/guide-plan-feedback-NN.md` | `feedback/guide-plan-NN.md` |
| `feedback/guide-revise-feedback-NN.md`, `guide-revision-feedback-NN.md` | `feedback/guide-doc-NN.md` |
| `feedback/cycle-a-opener.md`, `cycle-b-opener.md` (05), `prompt.md` (07), `docs/promt` (06) | historical session openers: move to `feedback/` with an `opener-` prefix, or delete |

Then:

- [ ] Remove the empty `research/` folder
- [ ] Add a `feedback/notes.md` stub where one is missing (purpose line: *Running notes that come up while working on this topic.*)
- [ ] **Exceptions**:
  - `06-reality-capture/slides.qmd`: the two subtitles differ — `_ENG` has `Assignment 4 — Reality Capture · Technical Art for Game and Cinema — A.Y. 2025/2026`, the plain file has only the course part. Overwriting keeps the `_ENG` version; change it afterwards if the short one is wanted
  - `07-vfx/slides.qmd`: both files are stubs. After overwriting, replace the two "Do not render this file directly…" comments with `<!-- Purpose: the topic's Reveal.js slide deck. Generated in Cycle A. -->`
  - `topics-WIP/04-materials/*.qmd`: same stub comments; same fix
- [ ] Update deck subtitles to the new academic year if desired (`A.Y. 2025/2026` appears in every deck's frontmatter)
- [ ] `plan-slides.md`, `plan-guide.md`, `session-log.md`, `meta.json`, `assets/` stay where they are
- [ ] Append a session-log entry to each topic: `## <date> (Migration — author) Moved to coursekit v1 layout; English-only.`

## 4. Managed build files

Replace each file with the coursekit template copy:

| File | Expected difference vs. the current TA file |
|------|----------------------------------------------|
| `scripts/generate-index.js` | header line only |
| `scripts/describe-assets.js` | header line, plus comment text pointing to the coursekit skill |
| `scripts/create-topic.js` | **new layout** (docs/, feedback/, purpose stubs, no `_ENG`) |
| `styles.css` | header line only |
| `.gitignore` | header line only |
| `.github/workflows/deploy.yml` | header line only |
| `package.json` | header key, name `coursekit-course`, new `describe-assets` script |
| `package-lock.json` | name `coursekit-course` |

- [ ] Before replacing, diff each current file against its template body. Any difference beyond those listed is a local change: either upstream it into coursekit or drop it consciously.
- [ ] Keep TA's `_quarto.yml`, `_variables.yml`, `home_content.qmd` (course-specific). Check that `_quarto.yml` contains nothing that refers to `_ENG` files (it does not today).

## 5. Version identity

- [ ] Create `.coursekit-version` containing the release version (e.g. `1.0.0`)

## 6. Plugin declaration

- [ ] Create `.claude/settings.json` from the template, with `ref` set to the release tag (e.g. `v1.0.0`). Keep `.claude/settings.local.json` as it is.
- [ ] Start Claude Code in the repo and accept the folder-trust dialog. Run `/coursekit:version` and check that it reports *Installed* with the expected version.

## 7. Verify

- [ ] `npm ci && npm run build` succeeds
- [ ] `_site/topics/*/` contains `index.html` and `slides.html` and **no** `*_ENG.html`
- [ ] Spot-check three topics in `quarto preview`: images, Mermaid diagrams, and the slide links from the home page
- [ ] Run the behaviour checks in `smoke-test.md` §E
- [ ] Commit (`coursekit v1 migration`) and push. The site redeploys in English.

---

## Appendix A — Draft `docs/course-profile.md` for TA

Collected from the TA-specific content removed from the skills (AUDIT §3.2/§4). Review it, especially the flagged items.

```markdown
# Course Profile — Technical Art for Game and Cinema

> Purpose: the structural course elements the coursekit skills rely on. Skills refer to these sections by heading — keep the headings exactly as written.

## Course identity

- **Course title**: Technical Art for Game and Cinema
  <!-- FLAG: the website title is currently the Italian "Technical Art per il cinema e i videogiochi" (_quarto.yml, _variables.yml, home_content.qmd). Decide whether to switch it to English. -->
- **Academic year**: <new A.Y.>
- **Institution**: Politecnico di Torino
- **Programme**: Master's degree — students in Digital Media and Computer Science
- **Author**: Francesco Strada
- **Repository**: https://github.com/francescoStrada/TA-4-cinema-and-game
- **Website**: https://francescostrada.github.io/TA-4-cinema-and-game/

## Audience

Students are Master's level. They arrive with solid hands-on experience in:
- **Blender**: 3D modelling, texturing, lighting, photorealistic rendering, keyframing, rigs, physics simulations, cloth, blend shapes, animation sequences
- **Unity**: real-time interactive applications, scripting, physics, NPCs, real-time rendering and lighting

They understand rendering pipelines, material graphs, and animation rigs — just not yet in Unreal Engine. Typical prior courses: Computer Graphics (Blender) and Virtual Reality (Unity).

## Domain anchor

Unreal Engine 5. Ground every concept in what students will actually do or see in Unreal Engine. Map new concepts onto Blender and Unity equivalents. For the guide, prefer official Unreal documentation, Epic's own tutorials, and well-regarded community sources over generic YouTube results.

## Research defaults

- **Tools and versions**: Unreal Engine 5.5 <!-- FLAG: 06-reality-capture already targets UE 5.7; update as needed -->
- **Role/practitioner**: technical artist
- **Source balance**:
  - Official Epic documentation: include for tool-specific and technical reference (e.g. Landscape, PCG, Nanite, Foliage, World Partition)
  - GDC talks and conference presentations: include for workflow, pipeline, and professional practice
  - Tutorial video series: include well-regarded creators (e.g. William Faucher, Unreal Sensei, Smart Poly, Gorka Games) for practical step-by-step workflows
  - Community resources: articles, breakdowns, and portfolio write-ups from established artists on ArtStation, 80 Level, or similar platforms — these often cover real production workflows better than the official docs
  - Academic sources: only if directly relevant
- **Preferred source types for NotebookLM**: official Epic documentation and GDC sources
- **Exclusions**: forum posts, Reddit threads, low-quality YouTube channels, and any content specific to UE4 or earlier

## Slide identity (optional)

TA uses the coursekit default deck template unchanged: moon theme, `slideNumber: "c/t"`, footer `Francesco Strada — CC BY 4.0`, title-slide background with opacity 0.7, Mermaid theme `default`. Subtitle pattern: `Technical Art for Game and Cinema — A.Y. <A.Y.>`. Default title-slide background image: `https://media1.tenor.com/m/CAFdHQQ3NS0AAAAC/pingu-paint.gif`.

## Writing style overrides (optional)

None.

## Image search

**Works — simple HTML, image URLs extractable:**
- `80.lv` — CDN pattern: `cdn.80.lv/api/upload/content/[hash]/[file].jpg`
- `worldofleveldesign.com` — relative paths, prepend domain
- `creativebloq.com` — CDN pattern: `cdn.mos.cms.futurecdn.net/[hash].jpg`
- `aaronneal.online` and similar personal/WordPress blogs
- `elopezr.com` and similar technical blogs
- Epic CDN direct URLs: `cdn2.unrealengine.com/[slug].jpg` (when the URL is already known)

**Does not work — JS-rendered, WebFetch sees only initialisation code:**
- `dev.epicgames.com` — all Epic documentation pages
- `docs.unrealengine.com` — all legacy Epic docs
- `youtube.com` — all YouTube pages
- `unrealengine.com` — marketing pages

**Accept as permanent placeholders** — editor UI screenshots that only exist in Epic's JS-rendered docs or in YouTube video frames:
- PCG node graph (editor UI)
- Megascans / Fab browser (editor UI)
- Specific viewport debug views (Nanite cluster colourisation, etc.)
- PureRef reference boards

Search terms: add "UE5" and the tool name to queries.
```
