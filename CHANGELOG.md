# Changelog

Every release entry has three parts:
- **Plugin** — Added / Changed / Removed
- **Course-repo impact** — managed files changed, layout or convention changes
- **Migration steps**

Upgrades are planned from these entries (see README → *Versions and upgrades*).

## [0.1.0] — 2026-10-01

First pre-release (0.x = not yet stable; tested on a new course before 1.0.0), extracted from the Technical Art course repo (TA-4-cinema-and-game) and revised per `AUDIT.md` §12–§15.

### Plugin

**Added**
- Marketplace `coursekit` with the single plugin `coursekit`
- Skills carried over from TA, generalised (course-specific values now come from `docs/course-profile.md`):
  - `workflow-research`, `workflow-slides`, `workflow-guide`, `workflow-images`
  - `quarto`, `writing-style`, `slides-style`
  - `revise`, `session-log`, `manifest`, `image-search-slides`
- `conventions` skill: the generic content of TA's `CLAUDE.md`, plus `workflow-manual.md` and `documentation-map.md` (from TA's `docs/`)
- `process-feedback` skill. It replaces TA's plan-only `/process-plan-feedback` command and processes every feedback type:
  - `slide-plan` / `guide-plan` → plan revision
  - `slide-deck` / `guide-doc` → surgical refinement
  - `notes.md` → a review

  It also flags requests that recur across rounds.
- `init-course` skill: copy-only scaffold of a course repo with placeholder filling and a `.coursekit-version` stamp. It runs only on explicit request.
- Initialisation check in `conventions`: if `.coursekit-version` is missing, Claude asks whether to run `/coursekit:init-course` and never runs it on its own
- `version` skill: reports the loaded copy and version, compares it with the course's pin, and prints launch commands
- `templates/course-repo/`:
  - managed build files (`scripts/`, `package.json`, `package-lock.json`, `styles.css`, `.gitignore`, `.github/workflows/deploy.yml`)
  - course skeletons (`CLAUDE.md`, `docs/course-*.md`, `_quarto.yml`, `_variables.yml`, `home_content.qmd`, `.claude/settings.json`)
- Feedback file convention: `feedback/notes.md`, `slide-plan-NN.md`, `slide-deck-NN.md`, `guide-plan-NN.md`, `guide-doc-NN.md`
- Shared default visual identity in `slides-style` (deck template, archetypes, density, cadence). Courses override it in the profile.

**Changed** (relative to TA's in-repo framework)
- English only: one source file per artifact (`slides.qmd`, `index.qmd`); no `_ENG` files
- Topic layout: research, objectives, sources, queries, and assignments move to `docs/` with strict prefixes; feedback files go in `feedback/`; plans and the session log stay at the topic root
- Skill references are by plugin path or `coursekit:<name>` instead of `skills/<file>.md`
- Deck format configuration lives in each deck's frontmatter, following the deck template (documented; it was already TA practice)
- `create-topic.js` stubs every file of the new layout with a one-line purpose note only
- The model table is dated (valid as of 2026-10-01) and mentions effort levels
- `describe-assets` is documented as a stub, and `npm run describe-assets` now exists

**Removed**
- Cycle D (translation), with the `translate` and `workflow-translation` skills
- Italian-specific rules and the "never translate" term lists

### Course-repo impact
- New required files: `docs/course-profile.md`, `docs/course-topics.md`, `.coursekit-version`, `.claude/settings.json`
- `CLAUDE.md` becomes a slim course-specific file
- Every managed file carries a `managed by coursekit` header

### Migration steps
- From TA's in-repo framework: follow `docs/tech-art-migration.md`
- New course: `/coursekit:init-course` (README → *Adopting coursekit in a new course*)
