# coursekit — Phase 1 Audit

Date: 2026-10-01 · Claude Code on this machine: 2.1.286
Sources read in full: TA `CLAUDE.md`, all 12 files in `skills/`, `docs/claude-code-workflow-manual.md`, `docs/documentation-overview.md`, `.claude/commands/process-plan-feedback.md`, `scripts/*`, `package.json`, `_quarto.yml`, `_variables.yml`, `styles.css`, `home_content.qmd`, `.github/workflows/deploy.yml`, `_overall-notes.md`, and samples from every topic folder. Pipeline: `README.md`, all scripts and configs, sample topics.
TA = `C:\MyStuff\Didattica\TA\lectures\TA-4-cinema-and-game`. Pipeline = `C:\MyStuff\Didattica\lecture-material-pipeline\lecture-material-pipeline`.

## 1. Headline findings

1. **TA's "skills" are not Claude Code skills.** They are flat Markdown files in `skills/*.md`. `CLAUDE.md` tells Claude to read them by path. Extraction therefore changes the loading mechanism (plugin skill discovery and namespacing), not just the location. Every path reference breaks (see §5).
2. **TA is a fork of the pipeline template.** It does use Quarto, Reveal.js, the Node scripts and the deploy workflow. Evidence: TA's `package.json` is byte-identical to the pipeline's (`"name": "lecture-material-pipeline"`, `0.1.0`), and so are `deploy.yml` and `.gitignore`. `generate-index.js` still falls back to the title "Lecture Material Pipeline". TA's scripts are evolved versions of the pipeline scripts. Per the precedence rule, TA is authoritative everywhere (§7).
3. **TA has two layers.** The *build layer* comes from the pipeline: scripts, Quarto config, CSS and CI. The *authoring layer* is TA's own: `CLAUDE.md`, the skills, `docs/` and the A–D cycles. The authoring layer is almost entirely generic and maps well onto a plugin. The build layer is also generic, but a plugin cannot place those files in a course repo (§8).
4. **The docs and the actual repo disagree in several places.** None of this should be guessed at during extraction (§6). The main cases:
   - The documented topic layout differs from the real one (`docs/`, `research/`, `feedback/` subfolders).
   - `_ENG` files are documented as "never rendered", but they are rendered and published (`_site/topics/*/index_ENG.html`, `slides_ENG.html`).
   - `describe-assets` is documented as working, but it is a stub and has no npm script.
   - Reveal.js config is documented as living in `_quarto.yml`, but it actually sits in each deck's frontmatter.
5. **Several skills are mixed.** The TA-specific content is concentrated in a few places:
   - Unreal Engine / Blender / Unity anchoring
   - the list of technical terms that are never translated
   - the English→Italian pair
   - UE 5.5 research prompts
   - slide visual identity
   - the image-search domain list

   A single course-profile file in the course repo can absorb all of it (§4).
6. **All three GitHub repos appear to be private.** The anonymous GitHub API returns 404 for each. That constrains how CI files can be shared (§8).

## 2. Claude Code plugin facts verified (docs read 2026-10-01)

Sources: [manifest reference](https://code.claude.com/docs/en/plugins-reference), [create marketplace](https://code.claude.com/docs/en/plugin-marketplaces), [marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference), [host marketplace](https://code.claude.com/docs/en/plugins/host-marketplace), [loading](https://code.claude.com/docs/en/plugins/loading), [org/per-repo](https://code.claude.com/docs/en/plugins/org), [skills](https://code.claude.com/docs/en/skills).

- **Structure.** The manifest goes at `<plugin>/.claude-plugin/plugin.json`. Components live at the plugin root, not inside `.claude-plugin/`: `skills/<name>/SKILL.md`, `commands/`, `agents/`, `hooks/hooks.json`, `bin/`, `settings.json`. Only `name` is required, and it must be kebab-case. `version` is not checked against semver, and setting it pins users to that version until it changes.
- **No CLAUDE.md in plugins.** A plugin-root `CLAUDE.md` is not loaded, and validate warns about it. Instructions have to live in skills. Plugin `settings.json` only honours `agent` and `subagentStatusLine`.
- **Namespacing.** A plugin skill `skills/revise/SKILL.md` becomes `/coursekit:revise`. The bare `/revise` also works if it is unambiguous. Plugin skills never shadow project or personal skills.
- **Skills cannot call other skills directly.** They can only instruct Claude to use one. Supporting files are linked relatively or through `${CLAUDE_SKILL_DIR}`.
- **Path variables.** `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}`, `${CLAUDE_SKILL_DIR}` and `${CLAUDE_PROJECT_DIR}` are substituted inside the Markdown bodies of skills, commands and agents. They are not in the Bash tool's environment, so any script path Claude must run has to be written in the skill body. They are not substituted in a course repo's `CLAUDE.md`.
- **Path containment.** Component paths must start with `./` and must stay inside the plugin root (no `..`). Installed plugins are copied to `~/.claude/plugins/cache/<mkt>/<plugin>/<version>/`, and files outside the plugin directory are not copied. If the plugin root holds a `package.json` plus a lockfile, `npm ci --ignore-scripts` runs in the cache copy.
- **marketplace.json.** It lives at `<root>/.claude-plugin/marketplace.json`. Required fields are `name`, `owner.name` and `plugins[]`, where each entry has `name` and `source`. A relative source must start with `./`, and `"."` means the marketplace root itself. One repository can therefore be both marketplace and plugin. Don't set `version` in both the entry and `plugin.json`, because `plugin.json` wins and validate warns. Reserved names do not affect `coursekit`.
- **Local development.** `claude --plugin-dir <dir>` loads a plugin in place as `<name>@inline` for one session and overrides an installed plugin with the same name. A marketplace added from a local directory also loads relative-path plugins in place, and edits apply after `/reload-plugins`. `claude plugin validate <dir>` checks both manifests.
- **Project-level declaration.** A course repo's `.claude/settings.json` can declare:

  ```json
  { "extraKnownMarketplaces": { "coursekit": { "source": { "source": "github", "repo": "francescoStrada/coursekit", "ref": "v1.0.0" } } },
    "enabledPlugins": { "coursekit@coursekit": true } }
  ```

  The marketplace is registered only after the user accepts the folder-trust dialog. Relative-path plugins then load without a separate install. `claude plugin marketplace add <repo> --scope project` writes this block for you.
- **Pinning.** The marketplace can be pinned with `owner/repo#ref` or `owner/repo@ref`, or with `ref` in settings. Plugin sources accept `ref` and `sha`. Private repos work with the user's existing git credentials. Background auto-update is off by default for third-party marketplaces.
- **One marketplace per name, per user.** `known_marketplaces.json` is per user, not per project. Two course repos pinning *different* refs of the same marketplace name on one machine is not a supported pattern. The documented alternative is release-channel marketplaces with different names. *(This is my inference from the docs and should be tested before relying on it.)*

## 3. Inventory and classification

### 3.1 TA `CLAUDE.md` sections

| Lines | Section | Class | Destination |
|---|---|---|---|
| 1–3 | Title block (course, A.Y., PoliTo) | course | slim `CLAUDE.md` |
| 5 | "Read at start of every session; don't duplicate referenced docs" | generic | `coursekit:conventions` plus one bootstrap line in `CLAUDE.md` |
| 9–21 | What This Repository Is | mixed | pipeline description → conventions. Course name and `docs/course-overview.md` pointer → `CLAUDE.md`. Workflow-manual pointer → plugin reference |
| 25–56 | Repository Structure | generic (but stale, see §6) | conventions |
| 60–66 | Language Policy | mixed | mechanism (working language / rendered language / `_ENG` sources / terms stay English / translate last) → conventions. "English/Italian" and term examples → course profile |
| 70–100 | Quarto Context | generic | `quarto` skill (duplicates it; contains the "slides rendered from `slides_ENG.qmd`" contradiction) |
| 104–116 | Authoring Sequence (Cycles 0, A–D, approval gate) | generic | conventions |
| 120–126 | Slide Philosophy | generic | conventions (summary of `slides-style`) |
| 130–137 | Writing Guidelines | mixed | "Unreal Engine", "Unity, Blender" → profile. Resource map, "small but effective", register → generic |
| 141–161 | Skills table + "new files in `skills/` may be added" | generic, path-based | name-based index in conventions. Course-local extra skills go in the course repo's `.claude/skills/` |
| 165–174 | Session Continuity | generic | conventions |
| 178–184 | Manual Edits | generic | conventions |
| 188–194 | Editing Discipline (incl. protected files, no commit/push) | generic | conventions |
| 198–203 | Hard Rules | generic | conventions |

### 3.2 Skills (`skills/*.md`) and the command

| File (lines) | Class | TA-specific content found | Proposal |
|---|---|---|---|
| `workflow-research` (646, **no frontmatter**) | mixed, heavy | Course title. The NotebookLM description and all 8 query templates filter for "Unreal Engine 5.5". "Master's students in Digital Media and Computer Science at Politecnico di Torino". Source-balance list (Landscape/PCG/Nanite, William Faucher, Unreal Sensei, 80 Level, ArtStation). "coming from Unity and Blender" (Q6). `Version context: UE 5.5`. "See the `environment-art` topic folder". Mostly *human* instructions (Cycle 0 is manual, partly run in the claude.ai project) | Generic process plus templates with `[placeholders]` filled from the profile's *Research defaults*. Add frontmatter |
| `quarto` (410) | generic | Description names the course. Blender/Unreal used in examples (illustrative). "Language and Technical Terms" list | Neutralise the description, keep the examples, move the term list to the profile |
| `workflow-slides` (175) | generic | Description. "il Sequencer"/"Nanite" examples. Sonnet/Opus phase table | Neutralise the description. Terms → profile |
| `workflow-guide` (183) | generic | "anchored to what students will actually do in Unreal Engine" | Anchor → profile's *Domain anchor* |
| `workflow-images` (177) | generic | "Screenshots from Unreal Engine". C3 `npm run describe-assets` (does not exist, see §6) | Neutralise. C3 wording per decision D4 |
| `workflow-translation` (118) | mixed | English→Italian hard-coded. Term list. "Master's level academic Italian" | Languages → profile, term list → profile |
| `translate` (132) | mixed | Italian grammar rules and examples (`il Sequencer`, `un Blueprint`). Four term lists (UE systems, CG terms, software, formats) | Term lists → profile. Italian rules per D8 |
| `revise` (81) | generic | – | As is |
| `session-log` (105) | generic | Examples only | As is |
| `manifest` (135) | generic | Examples only | As is |
| `image-search-slides` (125) | mixed | "Known Domain Behaviour" (80.lv, Epic docs, YouTube…). "Accept as permanent grey boxes" (PCG graph, Megascans). "UE5" search terms. Grey-box convention (§6) | Technique → plugin. Domain lists → profile |
| `slides-style` (137) | mixed | Red accent from "the original/reference deck". "Domande?". Italian question-title example. Cadence of 50–65 slides per 1.5 h | Principles and archetypes → plugin. Visual identity and cadence → profile (D7) |
| `writing-style` (113) | mixed | "Who You Are Writing For" (Blender/Unity bullet list). "Ground everything in doing… in Unreal Engine". "Prefer official Unreal documentation". Term list | Audience and anchor → profile. Principles, register and voice → plugin (D7) |
| `.claude/commands/process-plan-feedback.md` (8) | generic | – | Plugin skill `coursekit:process-plan-feedback` (`disable-model-invocation: true`) |

### 3.3 Other framework files

| File | Class | Proposal |
|---|---|---|
| `docs/claude-code-workflow-manual.md` | mostly generic (TA title, model IDs `claude-*-4-6`, stale folder tree, commit convention) | Plugin reference, as a supporting file of `conventions` |
| `docs/documentation-overview.md` | mixed (generic doc map plus claude.ai-project usage) | Generic map → plugin. Course pointers → `CLAUDE.md`. See D17 |
| `docs/course-overview.md`, `docs/Esame-Finale.md` | course | Stay |
| `_overall-notes.md` | author notes | Not extracted. Listed in the v2 list (§7.4) |
| `scripts/create-topic.js`, `generate-index.js` | generic (no TA strings) | Canonical copies in the plugin, delivered per §8 |
| `scripts/describe-assets.js` | generic stub ("not yet implemented") | Same as above, see D4 |
| `package.json`, `.gitignore`, `styles.css`, `deploy.yml` | generic | §8 |
| `_quarto.yml` | mixed (generic project/format keys; course title, navbar, `tech-setup` sidebar) | Skeleton template, which the course fills in |
| `_variables.yml`, `home_content.qmd` | course | Skeleton templates |
| `index.qmd`, `topics/index.qmd` | generated | – |
| `.claude/settings.local.json` | personal (WebFetch allow-list, git perms) | Not extracted |
| `topics/extra/tech-setup/` (multi-page, `_metadata.yml`, docked sidebar), `topics-WIP/` | undocumented conventions | D15 |

## 4. Split proposal for mixed items

All TA-specific values move into one course-repo file with fixed headings. Working name: **`docs/course-profile.md`** (D6). Generic skills refer to these headings instead of hard-coding values:

- `## Languages`: working = English, rendered = Italian, sources suffix `_ENG`.
- `## Audience`: the Blender/Unity prior-knowledge block from `writing-style`.
- `## Domain anchor`: "Unreal Engine": ground concepts in what students do or see in UE, and prefer official Unreal docs.
- `## Technical terms (never translate)`: the union of the lists in `CLAUDE.md`, `quarto`, `translate`, `writing-style` and `workflow-translation`.
- `## Research defaults`: engine/version filter (UE 5.5), institution/programme wording, source-balance list, preferred creators, exclusions.
- `## Slide identity`: deck frontmatter block (moon theme, footer, `slideNumber: c/t`, title background), accent colour, closing prompt ("Domande?"), cadence numbers.
- `## Image search`: known-working and known-failing domains, and permanent grey-box subjects.

Equivalence rule for v1: each generic skill plus TA's profile must yield the same effective instructions as today's file. The smoke test checks this (Phase 2).

## 5. Breakage map (extraction and namespacing)

| # | Where | Reference | Why it breaks | Fix |
|---|---|---|---|---|
| 1 | `CLAUDE.md` L72, 122, 132, 147–161, 174, 184 | `skills/<x>.md` | Files move into the plugin cache, and `CLAUDE.md` gets no `${CLAUDE_PLUGIN_ROOT}` substitution | Refer by name: `coursekit:<x>` |
| 2 | Skill→skill refs: `quarto`→slides-style, writing-style · `workflow-slides`→quarto, writing-style, slides-style, revise, session-log · `workflow-guide`→quarto, writing-style, revise, session-log · `workflow-images`→manifest, revise, session-log · `workflow-translation`→translate, revise, session-log · `translate`→workflow-translation, writing-style, revise · `revise`→session-log, workflow-slides, workflow-translation · `manifest`→workflow-images · `slides-style`→writing-style · `workflow-research`→workflow-slides | `skills/<x>.md` | Path no longer exists | `${CLAUDE_PLUGIN_ROOT}/skills/<x>/SKILL.md` (substituted at load, keeps "read file X" semantics) or "use `coursekit:<x>`" (D10) |
| 3 | Session-opener templates in all workflow skills, the manual, `documentation-overview` | "Read CLAUDE.md and docs/documentation-overview.md… Follow skills/workflow-slides.md" | Docs and skills move | Rewrite openers as `/coursekit:workflow-slides …`. Historical copies in `topics/*/feedback/*opener*.md` and `07-vfx/prompt.md` stay untouched |
| 4 | `workflow-slides` A1, manual | `docs/course-overview.md` | Stays in the course repo, so the plugin now *depends* on it | Declare it a required course file in the README and template |
| 5 | `create-topic.js` L259, `describe-assets.js` L5, skills | `docs/claude-code-workflow-manual.md` | Manual moves into the plugin | Update the comment text to the skill name |
| 6 | `workflow-images` C3, manual, `manifest` | `npm run describe-assets` | No such script in `package.json`, and the script is a stub | D4 |
| 7 | `workflow-research` | "See the `environment-art` topic folder" | TA-only path, and the folder is actually `02-environment-art` | Move to the profile or drop |
| 8 | Skill descriptions (all) | "…Technical Artist for Game and Cinema course pipeline" | Descriptions now drive discovery and auto-invocation | Neutralise |
| 9 | `workflow-research.md` | no frontmatter | A plugin skill needs `name`/`description` for discovery | Add frontmatter |
| 10 | `.claude/commands/process-plan-feedback.md` in TA | same name as the plugin skill | Both would load during the swap (`/process-plan-feedback` and `/coursekit:process-plan-feedback`) | Delete TA's copy at swap time (next semester) |
| 11 | `CLAUDE.md` L161 | "new skill files may be added to `skills/`" | The plugin cache is read-only and replaced on update | Course-local skills go in `.claude/skills/` |
| 12 | Generic names `revise`, `translate`, `manifest`, `quarto` | bare `/revise` | Ambiguous if another plugin uses the same name | Always write the namespaced form in docs |
| 13 | `image-search-slides` | relies on WebFetch domain allows | These live in TA's personal `settings.local.json` | README note only |
| 14 | Any skill that will run bundled scripts | `node scripts/...` | Plugin env vars are not in Bash; paths must be spelled in the skill body | Write `"${CLAUDE_PLUGIN_ROOT}/scripts/…"` in the skill text |

## 6. TA internal inconsistencies (ask, don't guess)

1. **Topic file layout.** `CLAUDE.md`, the manual and `workflow-research` place `objectives.md`, `topic-research.md`, `sources-draft.md` and `notebooklm-queries.md` at the topic root. Real topics use `docs/objectives.md`, `research/*.md`, `feedback/` (00-introduction uses `feedbacks/`), plus `docs/*Assignment*.md`, `research/topic-research-<x>.md` and `prompt.md`. → D1
2. **`_ENG` rendering.** The Language Policy says "never rendered", and the manual says "Quarto ignores `_ENG` files automatically". `CLAUDE.md` L79/86 say slides and guides are rendered from both. In reality the `render: topics/**/*.qmd` glob renders them, and `_site/topics/03-lighting/` contains `index_ENG.html` and `slides_ENG.html`. → D2
3. **Reveal.js config.** `quarto.md` says it lives in `_quarto.yml` and forbids per-file format config. `_quarto.yml` has no revealjs block, and every deck carries full frontmatter (moon theme, footer, etc.). The session log says "follows the Lighting deck convention". → D3
4. **`describe-assets`** is documented as sending images to the Anthropic vision API. It is a stub, and `package.json` has no `describe-assets` script. → D4
5. **Placeholder conventions.** The 📸 callout is canonical (`quarto.md`: "Do not use any other format"). `image-search-slides` talks about "grey box divs" and `<!-- ![](assets/…) -->` commented lines "which drive the Cycle C manifest". No grey-box divs remain in current decks, but commented image lines do (00, 02). → D5
6. **Plan templates.** The `plan-slides.md`/`plan-guide.md` stubs from `create-topic.js` (table slide list, status line, different headings) differ from the formats defined in `workflow-slides`/`workflow-guide`. Which is canonical?
7. **Model table.** The manual pins `claude-sonnet-4-6`/`claude-opus-4-6`. Actual logs show Opus used for planning too. → D16
8. **Commits.** "Do not commit or push" and the `[topic-slug] cycle — description` convention, versus `settings.local.json` allowing `git push`/`merge` and commit messages that don't follow the convention. → D19
9. **Feedback loop.** Iterating on plans through `feedback/<artifact>-<phase>-feedback-NN.md` plus `/process-plan-feedback` is how you actually work. It is undocumented in `CLAUDE.md`/skills, and naming varies (`plan-feedback-01`, `slide-plan-feedback-00`, `slide-revise-…`, `slide-revision-…`, `cycle-a-opener.md`). → D14

## 7. Relationship to lecture-material-pipeline

### 7.1 Does TA use the pipeline approach?
**Yes. TA is a direct derivative of the pipeline**, and TA is authoritative. It uses Quarto website + Reveal.js, Node scripts (`create-topic`, `generate-index`, plus TA's own `describe-assets` stub), and GitHub Actions to GitHub Pages via `peaceiris/actions-gh-pages`. Identical files: `package.json`, `.github/workflows/deploy.yml`, `.gitignore`. TA deviates from the pipeline README wherever §7.2 says so.

### 7.2 Item-by-item comparison
Labels: (a) superseded by TA (or carried over unchanged, TA copy authoritative) · (b) unique to the pipeline, possibly valuable → v2 · (c) unclear, ask.

| Area | Pipeline item | Status |
|---|---|---|
| Scaffolding | `create-topic.js` → `index.qmd`, `slides.qmd`, `meta.json` | (a) TA's `create-topic.js` adds `_ENG` sources, plan stubs, `session-log.md`, `assets/manifest.md`, `--desc`, and `guide`/`slides` in meta |
| Scaffolding | Header comment advertising `create-topic.js slug --title … --desc …` (never implemented) | (a) removed in TA |
| Scaffolding | `generate-index` creates a card for folders *without* `meta.json` | (a) TA skips them (needed for `topics/extra/`) |
| Slides | Per-deck `revealjs: theme: simple, slide-level: 2` | (a) TA deck frontmatter (moon, footer, `slideNumber`, title background) plus `slides-style`/`quarto` skills |
| Slides | Guide embedded in slides via `<iframe src="index.html">` | (b) v2 candidate (relevant to VR delivery) |
| Slides | Guide→slides link as `callout-important` | (a) TA `callout-note` in `create-topic` |
| Slides | Single-language `index`/`slides` | (a) TA EN/IT dual files |
| Metadata | `meta.json {id,title,desc,guide,slides,order}` | (a) same schema. TA orders by `NN-` slug/title prefix, and `order` is unused but still supported in code |
| Metadata | README field table (omits `guide`/`slides`) | (a) the actual schema supersedes it |
| Index | Topic cards only | (a) TA adds the compact link row |
| Index | `home_content.qmd` + generated cards | (a) same mechanism |
| Config | Minimal `_quarto.yml` (no render list) | (a) TA: explicit render list, Topics nav, docked sidebar for multi-page extras |
| Config | `_variables.yml` (`repo_url`, `course_title`) | (a) TA uses it heavily with `{{< var >}}` |
| Config | `styles.css` | (a) TA superset |
| Deployment | `deploy.yml` (Node 18, quarto-actions, `npm ci`, `npm run build`, gh-pages, `[skip ci]`) | (a) identical in TA, carried over unchanged |
| Deployment | README "Publishing" (push to main) | (a) same. TA adds "Claude never commits/pushes" |
| Naming | kebab-case, lowercase topic folders | (a) TA: `NN-kebab`, `_ENG` suffix, kebab image names, zero-padded tutorial sequences, `extra/`, `topics-WIP/` |
| Preview | `quarto preview` directly | (a) TA `npm run preview` (generate + preview) |
| Docs | Long infra README (architecture, getting started, preview/generate/build, Pages) | (c) TA's README is one line and its docs cover authoring only. Dropped on purpose? (I'd move the generic parts into the coursekit README as documentation, not a feature) |
| Goals | "Private source, public site" (intro topic) | (c) TA seems private with a public Pages site. Is this still a requirement? It drives §8 |
| Roadmap | "Extensibility": topic categories, thumbnails, lecture-numbering automation, academic-year versioning, SCSS branding, multi-course monorepo | (b) v2 candidates, never implemented in either repo |
| Principles | No Python/Jupyter, deterministic static build | (a) still true in TA (Mermaid only, no computational cells) |

### 7.3 Why the pipeline drifted (inferred; please confirm)
1. **Copy-at-creation, no upstream.** A template repo gives each course an unrelated history. TA's script fixes (compact list, skip-no-meta, `--desc`) never flowed back, and the pipeline README now describes output TA doesn't produce.
2. **Machinery and content share one tree.** Scripts, CSS, workflow and `_quarto.yml` sit beside course content. `_quarto.yml` mixes generic and course keys, so there is nothing you can safely overwrite on upgrade.
3. **Structure is hard-coded in code.** `create-topic.js` embeds file templates as JS strings, and `generate-index.js` hard-codes `topics/<slug>/`, `meta.json` semantics and `slides.html`. Each structural change (EN/IT, plans, `research/`, `feedback/`, `extra/`, WIP) meant editing code in every copy.
4. **Per-file duplicated config.** Every deck repeats its revealjs frontmatter, so one style change touches every deck in every course.
5. **No version identity.** `package.json` still says `lecture-material-pipeline 0.1.0` in TA, so you cannot tell which template revision a course came from.
6. **Docs are separate from behaviour.** The human README, the AI docs (`CLAUDE.md`/skills) and the real layout drifted independently (§6).
7. **The layer that changed most was never in the template.** The Claude authoring layer was added per course, so the template had nothing to say about it.

Questions: How many repos were created from the template? Was the drift mostly in scripts/config or in the Claude docs?

### 7.4 v2 candidates (none go into v1)
- Pipeline: iframe guide-in-slides. Topic categories. Thumbnails. Lecture-numbering automation. Academic-year versioning. SCSS branding. Multi-course monorepo.
- Extraction-driven:
  - Build layer as a reusable workflow plus a versioned scripts package (§8).
  - A Quarto extension for revealjs/html format and theme, to remove per-deck frontmatter duplication.
  - A SessionStart hook that injects conventions deterministically.
  - An `upgrade-course` skill that diffs managed files against templates, with a `.coursekit-version` stamp.
  - A real `describe-assets` (or a Claude-native C3).
- Your own notes (`_overall-notes.md`, recorded only):
  - English-only (drop EN/IT)
  - real placeholder image files with descriptions
  - full-screen image style
  - "what next" suggestions at cycle end
  - revisit what session logs are for
  - numbered guide sections

## 8. Delivering files a plugin cannot place

Checked constraints:
- GitHub reusable workflows must sit directly in `.github/workflows/` of the called repo (no subfolders). They are called with `uses: owner/repo/.github/workflows/f.yml@ref`, where the ref is a tag, SHA or branch.
- Nesting is limited to 10 levels.
- Permissions can only stay the same or be reduced down the chain.
- The `github` context in a called workflow is the caller's.
- A **private** callee needs Actions → Access set to "Accessible from repositories owned by francescoStrada", and then only private repos can call it.
- The caller's `GITHUB_TOKEN` cannot read another private repo. So a called workflow that checks out coursekit's scripts, or an npm git dependency on a private coursekit, needs a PAT secret. *(This is an inference from the token-scope rules. Verify it if we go this way.)*

| File | v1 recommendation | v2 option |
|---|---|---|
| `.github/workflows/deploy.yml` | Canonical copy in `templates/course-repo/`, identical to today, with a header comment saying it is managed by coursekit vX | Thin caller → reusable `quarto-pages.yml@vX` in coursekit (needs coursekit public, or both private plus the Access setting and a PAT for scripts) |
| `scripts/*.js`, `package.json` | Template copy (TA already has identical copies) | npm git dependency `github:francescoStrada/coursekit#vX` with `bin` entries. `generate-index` would need `process.cwd()` instead of `__dirname/..` |
| `styles.css`, `.gitignore` | Template copy | Quarto extension (css/theme) |
| `_quarto.yml`, `_variables.yml`, `home_content.qmd` | Skeleton templates with course fields to fill | Quarto profile/extension split |
| slim `CLAUDE.md`, `docs/course-profile.md`, `docs/course-overview.md` skeleton | Templates | – |
| `.claude/settings.json` (marketplace + `enabledPlugins`) | Template, plus README instructions | – |

Delivery vehicle: a thin `coursekit:init-course` skill (`disable-model-invocation: true`). It copies `${CLAUDE_PLUGIN_ROOT}/templates/course-repo/**` into the repo and never overwrites existing files (D12). For the TA swap no scaffold runs: TA's files are compared against the templates in the smoke test instead.

## 9. Proposed plugin layout and name

```
coursekit/                                   ← git repo = marketplace root
├── .claude-plugin/marketplace.json          ← name "coursekit", owner, plugins[0] → "./plugins/coursekit"
├── plugins/coursekit/                       ← plugin root (keeps dev files out of the plugin copy)
│   ├── .claude-plugin/plugin.json           ← name "coursekit", version "1.0.0" (only here), description, author, repository
│   ├── skills/
│   │   ├── conventions/                     ← generic CLAUDE.md content (§3.1)
│   │   │   ├── SKILL.md
│   │   │   ├── workflow-manual.md           ← from docs/claude-code-workflow-manual.md (generic)
│   │   │   └── documentation-map.md         ← from docs/documentation-overview.md (generic)
│   │   ├── workflow-research/ workflow-slides/ workflow-guide/ workflow-images/ workflow-translation/
│   │   ├── quarto/ writing-style/ slides-style/ revise/ translate/ session-log/ manifest/ image-search-slides/
│   │   ├── process-plan-feedback/
│   │   └── init-course/                     ← D12
│   ├── scripts/  create-topic.js  generate-index.js  describe-assets.js   (canonical copies)
│   └── templates/course-repo/  CLAUDE.md  docs/course-profile.md  docs/course-overview.md  _quarto.yml
│                                _variables.yml  home_content.qmd  styles.css  package.json  .gitignore
│                                .github/workflows/deploy.yml  .claude/settings.json
├── README.md  CHANGELOG.md  AUDIT.md  docs/smoke-test.md
└── (dev only) CLAUDE.md for working on coursekit itself
```

- Install ID: `coursekit@coursekit`. Skills appear as `/coursekit:workflow-slides` and so on.
- Local development: `claude --plugin-dir C:\MyStuff\Didattica\coursekit\plugins\coursekit`, or `claude plugin marketplace add C:\MyStuff\Didattica\coursekit` for live in-place loading. Check with `claude plugin validate C:\MyStuff\Didattica\coursekit` in CI.
- Release: bump `plugin.json` version, add a CHANGELOG entry, tag `v1.0.0`. Course repos pin with `"ref": "v1.0.0"`.

## 10. Slim CLAUDE.md template (course repo)

```markdown
# CLAUDE.md — <Course Title> · <A.Y.> · <Institution>

This repository is authored with the **coursekit** plugin. At the start of every session,
before any other action, load the `coursekit:conventions` skill and follow it. Load other
coursekit skills when their task is relevant; never guess their contents.

## Course context
- Course overview (philosophy, assignments, calendar, evaluation): `docs/course-overview.md`
- Course profile (languages, audience, domain anchor, glossary, slide identity, research defaults): `docs/course-profile.md`

## Course-specific rules
<only what deviates from or adds to coursekit — e.g. for TA: `topics/extra/` multi-page sections
with sidebar in `_quarto.yml`; `topics-WIP/` staging; `_variables.yml` holds course URLs>
```

TA's version fills in the title block and the three TA-only rules, and moves everything in §4 into `docs/course-profile.md`.

## 11. Decisions needed from Francesco

Each item gives my recommendation first.

1. **D1 Topic layout.** Canonise the *actual* layout (`docs/objectives.md`, `research/topic-research.md`, `research/sources-draft.md`, `research/notebooklm-queries.md`, `feedback/`), or keep the documented flat layout?
2. **D2 `_ENG` rendering.** Keep today's build behaviour (rendered and published) and correct the wording? Or should `_ENG` stay unpublished? The latter would be a behaviour change.
3. **D3 Deck config.** The generic skill says "deck frontmatter comes from the course profile's *Slide identity*", and the `_quarto.yml` wording is dropped. OK?
4. **D4 describe-assets.** Ship the stub unchanged, add the missing npm script so the command prints its "not implemented" message, and state in C3 that descriptions are manual until v2. OK?
5. **D5 Placeholders.** 📸 callout is canonical. Was the grey-box / commented-image convention in `image-search-slides` transient? If so, I'll reword it to refer to the callout.
6. **D6 Course profile.** One file, `docs/course-profile.md`, with fixed headings. Name and location OK?
7. **D7 Style ownership.** Principles, archetypes and authorial voice stay in the plugin (author-level). Visual identity (accent, closing prompt, deck frontmatter) and cadence numbers go to the profile. Agree?
8. **D8 Translation.** Languages and glossary come from the profile. The Italian grammar guidance stays in the plugin as the "Italian target" section, since both courses are Italian. OK?
9. **D9 Conventions loading.** `coursekit:conventions` skill plus the bootstrap line in `CLAUDE.md` (no code) for v1. A SessionStart hook is v2. Agree?
10. **D10 Cross-references.** Use `${CLAUDE_PLUGIN_ROOT}/skills/<x>/SKILL.md` read paths inside skills (keeps "read file X" semantics), and names (`coursekit:<x>`) in `CLAUDE.md` and openers. Agree?
11. **D11 Build layer and repo visibility.** v1 ships build files as templates identical to TA's. A reusable workflow and scripts package are v2. Will coursekit be public or private? That decides the v2 route (§8).
12. **D12 Scaffold skill.** Include a thin `coursekit:init-course` (copy-only, never overwrite) in v1, or only document manual copying in the README?
13. **D13 Repo layout.** Plugin in `plugins/coursekit/`, marketplace name `coursekit`, install ID `coursekit@coursekit`. Licence for the repo (e.g. MIT for code)?
14. **D14 Feedback loop.** Include `process-plan-feedback` as a plugin skill and document a `feedback/` folder without strict file naming?
15. **D15 TA-only conventions.** `topics-WIP/` and `topics/extra/` multi-page sections stay TA-only (in TA's `CLAUDE.md`) for v1?
16. **D16 Models.** Keep the phase→tier table (Sonnet/Opus) but drop the pinned `-4-6` IDs from the reference manual? Or keep it verbatim?
17. **D17 claude.ai project.** The workflow manual and documentation overview are also knowledge in your claude.ai project, and the plugin can't feed that project. Should it read the coursekit copies (for example by uploading them), or keep its own copies? Please flag any content differences you know of.
18. **D18 Versions on one machine.** Confirm the plan is sequential: all course repos use the same coursekit version at any time, and VR development uses `--plugin-dir`. Parallel pins of different refs of the same marketplace on one machine are not cleanly supported.
19. **D19 Git rules.** Keep "Claude never commits/pushes" and the commit convention verbatim in conventions?
20. **Pipeline (c) items.** Was the infra README dropped on purpose? Is "private source, public site" still a requirement for future courses? Also the drift questions in §7.3.
21. **§6.6 Plan templates.** Should the `create-topic.js` plan stubs or the skill-defined plan formats be canonical?

## 12. Decisions resolved (2026-10-01, from `audit-decisions.md`)

The decisions change the v1 scope. v1 is no longer a straight extraction of TA's current behaviour. It is now **TA conventions, revised**: English-only, a new topic layout, and no Cycle D. Consequences are noted per item.

| # | Decision | Resulting v1 rule |
|---|---|---|
| D1 | No flat layout, no deep subfolders | Per topic: one `docs/` folder with strictly prefixed names (`objectives…`, `research-<x>…`, …) plus a `feedback/` folder (see D14). Exact names to confirm (§13 Q2) |
| D2 | One build file per artifact, English default, no `_ENG` | `index.qmd` and `slides.qmd` only. `_<LANG>` files and a localization system → ROADMAP |
| D3 | TA's per-deck frontmatter is correct | Skills say deck config lives in deck frontmatter, following the style default (D7) |
| D4 | OK | Ship the stub, add the npm script, C3 descriptions are manual until v2 |
| D5 | OK | 📸 callout is the only placeholder convention. `image-search-slides` reworded |
| D6 | Profile = structural elements, plus two named course docs | Course repo `docs/`: `course-profile.md` (structural), `course-overview.md` (philosophy, structure, delivery, assignments; free-form), `course-topics.md` (high-level topic summary; free-form). Names to confirm (§13 Q3). Structuring them → ROADMAP |
| D7 | The plugin ships a shared default visual identity (slides and documents); courses override | The plugin's style skills carry the defaults taken from TA (image-first slides, archetypes, density, deck frontmatter, document formatting). The profile only holds course content (audience, domain anchor, research defaults) plus optional overrides |
| D8 | Drop Italian entirely; English only | `translate` and `workflow-translation` are not shipped. Cycles become 0, A, B, C. Localization → ROADMAP |
| D9 | OK | `coursekit:conventions` plus a bootstrap line in `CLAUDE.md` |
| D10 | OK | `${CLAUDE_PLUGIN_ROOT}` read paths inside skills, `coursekit:<x>` names elsewhere |
| D11 | v1 copies with managed-file headers; coursekit public (done); build fetched from coursekit in v2 | As stated |
| D12 | OK | `coursekit:init-course` (copy-only, never overwrites) |
| D13 | OK | `plugins/coursekit/`, install ID `coursekit@coursekit` |
| D14 | Feedback folder with typed, numbered files | `feedback/notes.md`, `feedback/slide-plan-NN.md`, `slide-deck-NN.md`, `guide-plan-NN.md`, `guide-doc-NN.md` ("guide", not "manual"; see §14). The skill states the purpose: calm, reflected feedback fed to the model as a file rather than typed into the prompt, and a history that reveals recurring requests for a self-improvement loop |
| D15 | TA-only for now | `topics-WIP/` and `topics/extra/` documented in TA's `CLAUDE.md`. A structured generic version → ROADMAP |
| D16 | Keep the model table with a validity date | "Valid as of 2026-10-01; revisit as the ecosystem changes (e.g. effort levels)" |
| D17 | The claude.ai project is for discussion only; no direct integration | Skills may suggest "check the claude.ai project". Any connection → ROADMAP (research) |
| D18 | Asked whether a public repo solves it | No, see §13 Q4. Resolution: stable courses install from the marketplace; plugin development uses `--plugin-dir` |
| D19 | OK | "Claude never commits or pushes" and the commit convention kept |
| D20 | Course repos private; only the website is public | Consistent with D11 |
| D21 | `create-topic` stubs only state each file's purpose | Scaffolded files contain a one-line purpose note. Structure comes from the workflow skills |

## 13. Follow-up questions (before Phase 2)

1. **Scope shift.** With D1/D2/D8, swapping TA onto v1 next semester becomes a *content migration*: move files into `docs/`, rename `*_ENG.qmd` → `*.qmd`, and drop the Italian files. The site will then publish English only. Is TA taught in English next semester? Phase 2 would deliver a migration checklist, and the smoke test would run it on a throwaway TA copy.
2. **Topic layout names** (proposal):
   - `topics/<slug>/`: `index.qmd`, `slides.qmd`, `meta.json`, `assets/` (with `manifest.md`), `feedback/`, `docs/`
   - `docs/`: `objectives.md`, `research-<x>.md`, `sources-<x>.md`, `queries-<x>.md` (NotebookLM), `plan-slides.md`, `plan-guide.md`, `assignment-<x>.md`, `session-log.md`

   Should plans and the session log live in `docs/` or stay at the topic root? Also, is "manual" (from D14) the new name for the "guide" everywhere, or only in feedback filenames?
3. **Course docs names:** `docs/course-profile.md`, `docs/course-overview.md`, `docs/course-topics.md`. OK?
4. **D18:** see the reply in session. Making coursekit public removes the token problem only, not the one-marketplace-per-name limit.

## 14. Follow-ups resolved (2026-10-01, `audit-decisions.md` §2)

1. TA is taught in English. Moving TA onto v1 is a content migration. Phase 2 delivers a migration checklist, and the smoke test runs it on a throwaway TA copy.
2. Final topic layout ("guide" is the word everywhere; "manual" is not used):

   ```text
   topics/<slug>/
   ├── index.qmd             guide (English, rendered)
   ├── slides.qmd            slide deck (English, rendered)
   ├── meta.json
   ├── plan-slides.md        Cycle A plan
   ├── plan-guide.md         Cycle B plan
   ├── session-log.md        stays at the root next to the plans (it is read every session)
   ├── docs/
   │   ├── objectives.md
   │   ├── research-<x>.md   topic research (suffix optional; used when there is more than one)
   │   ├── sources-<x>.md    source lists
   │   ├── queries-<x>.md    NotebookLM queries and responses
   │   └── assignment-<x>.md
   ├── feedback/
   │   ├── notes.md          running notes that come up while working on the topic
   │   ├── slide-plan-00.md  feedback on plan-slides.md
   │   ├── slide-deck-00.md  feedback on slides.qmd
   │   ├── guide-plan-00.md  feedback on plan-guide.md
   │   └── guide-doc-00.md   feedback on index.qmd
   └── assets/
       └── manifest.md
   ```

   `create-topic` stubs every file above with a one-line purpose note only (D21). Feedback files are numbered `-00`, `-01`, ….
3. Course-level docs: `docs/course-profile.md`, `docs/course-overview.md`, `docs/course-topics.md`.
4. The versioning model is below (§15).

## 15. Versioning model (agreed)

**Two ways to load the plugin.** The choice is made when you launch Claude Code. A running session cannot switch.

| Mode | How | When |
|---|---|---|
| Installed (stable) | The course repo's `.claude/settings.json` declares the coursekit marketplace pinned to a tag (e.g. `"ref": "v1.0.0"`) and enables `coursekit@coursekit`. Claude Code loads its cached copy | Teaching or authoring with a released version |
| Development (live) | `claude --plugin-dir <coursekit checkout>/plugins/coursekit`. It loads the working copy in place, edits apply after `/reload-plugins`, and it overrides the installed copy for that session only | Improving the plugin while working on a course (e.g. VR → v2) |

**Lifecycle.**

1. During a semester, work on the course with `--plugin-dir` pointing at your coursekit checkout. Plugin changes are ordinary git work in coursekit.
2. At consolidation time (e.g. the end of the semester), bump the `plugin.json` version, write the CHANGELOG entry with migration notes, tag, and push.
3. When a course starts, choose one:
   - **Stay**: keep its pin on the old tag.
   - **Upgrade**: follow the upgrade process — check the current state, read the release notes between the two versions, diff the managed files, agree an upgrade plan, then execute it.

**Constraint.** Claude Code registers a marketplace once per user, so all *installed* courses on one machine share one coursekit version at a time. To run an older version next to a newer one, use a git worktree per version and point `--plugin-dir` at it:

```text
git worktree add ../coursekit-v1 v1.0.0
```

**Version identity in course repos.** `init-course` writes `.coursekit-version`, and every managed file carries a `managed by coursekit vX` header (D11). The upgrade process relies on both.

**Release notes discipline.** Each CHANGELOG entry has three parts: *Added / Changed / Removed* for the plugin, *Course-repo impact* (managed files that changed, layout or convention changes), and *Migration steps*. The upgrade process works from these, so they must be precise.

**Tooling split.**

- **v1:** documentation (README "Versions and upgrades" section), the `.coursekit-version` stamp, managed-file headers, and a small `coursekit:version` skill. It reports the loaded copy (installed or `--plugin-dir`, path, version), compares it with the course's `.coursekit-version`, and prints the exact launch command for the other mode.
- **v2:** a `coursekit:upgrade` skill that runs the structured upgrade process. It is only meaningful once there are two released versions.

**Phase 1 is closed** with §12–§15. Phase 2 (extraction) starts from this state.
