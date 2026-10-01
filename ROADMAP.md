# coursekit — Roadmap

Work planned after v1. Each item notes where it came from (`AUDIT.md` section or decision ID, or "Francesco" for requests made directly).

## v2 — next

### Build and infrastructure

- [ ] **Fetch the build layer from coursekit**: a reusable deploy workflow plus a versioned scripts package, so course repos keep only a thin caller and a pinned tag (D11, AUDIT §8)
- [ ] **`coursekit:upgrade` skill**: the structured upgrade process. It checks the course's `.coursekit-version`, reads the CHANGELOG entries between the two versions, diffs the managed files against the templates, agrees an upgrade plan with the user, then executes it (AUDIT §15)
- [ ] **Quarto extension for the HTML/Reveal.js theme and format**, to remove duplicated per-deck frontmatter (AUDIT §7.4)

### Authoring workflow

- [ ] **Review the whole image search and classification process** (Francesco)
- [ ] **Retrospective skill**: run every so often over the live `feedback/notes.md` files and the feedback history across topics. It should surface what to change in the plugin or a course, and what belongs in another environment (e.g. course organisation) (Francesco, D14)
- [ ] **Real `describe-assets`**, or a Claude-native C3 step (D4)
- [ ] **SessionStart hook** that injects the conventions deterministically (D9)
- [ ] **Structured course docs**: give `course-overview.md` and `course-topics.md` sections that skills can reference directly (D6)
- [ ] **Generic conventions for non-topic content**: multi-page `extra/` sections and a `topics-WIP/` staging area (D15)

### Localization

- [ ] **Multi-language output**: `<file>_<LANG>.qmd` alongside the English default, plus a localization system (D2, D8)

### Ecosystem

- [ ] **Refresh the model/effort table** in the workflow manual. It is dated and has to follow the Claude Code ecosystem (D16)
- [ ] **Research a tighter link with the claude.ai project**, e.g. shared docs through a connector both sides can reach (D17)

## Later / ideas

- From lecture-material-pipeline (AUDIT §7.4):
  - embed the guide inside slides (iframe)
  - topic categories
  - thumbnails
  - lecture-numbering automation
  - academic-year versioning
  - SCSS branding
  - multi-course monorepo
- From TA `_overall-notes.md`:
  - real placeholder image files with descriptions
  - full-screen image slide style
  - "what next" suggestions at the end of each cycle
  - revisit what session logs are for
  - numbered guide sections
