# coursekit

A Claude Code plugin for authoring university course material: long-form HTML **guides** and Reveal.js **slide decks**, built with Quarto and published to GitHub Pages. Topics are produced through planned, approval-gated authoring cycles:

- **0 — Research**
- **A — Slides**
- **B — Guide**
- **C — Images**

This repository is both the plugin and its own marketplace.

- Plugin: `plugins/coursekit/`
- Marketplace: `.claude-plugin/marketplace.json`
- Install ID: `coursekit@coursekit`

---

## How it fits together

A course repository has two layers:

| Layer | What | Where it comes from |
|-------|------|---------------------|
| **Authoring** | Conventions, cycle workflows, style defaults, feedback processing | The plugin's skills, loaded by Claude Code (`/coursekit:<skill>`) |
| **Build** | Node scripts, `package.json`, `styles.css`, the GitHub Actions deploy workflow | Copied once into the course repo from `plugins/coursekit/templates/course-repo/` as **managed files** |

Course-specific content lives only in the course repo:

| File | Contents |
|------|----------|
| `CLAUDE.md` | Course-specific rules; tells Claude to load `coursekit:conventions` |
| `docs/course-overview.md` | Philosophy and reasoning, structure, delivery, assignments |
| `docs/course-topics.md` | High-level summary of the topics |
| `docs/course-profile.md` | Structural elements the skills read: identity, audience, domain anchor, research defaults, style overrides, image-search domains |

A plugin cannot place files into a project, and GitHub Actions cannot see the plugin. That is why the build layer is copied. Managed files carry a `managed by coursekit` header and are never edited in the course repo: fix them in coursekit, then copy them again. Fetching the build layer from coursekit at build time is planned for v2 (see `ROADMAP.md`).

### Topic layout

```
topics/<slug>/
├── index.qmd  slides.qmd  meta.json          rendered guide + deck, metadata
├── plan-slides.md  plan-guide.md  session-log.md
├── docs/       objectives.md  research-<x>.md  sources-<x>.md  queries-<x>.md  assignment-<x>.md
├── feedback/   notes.md  slide-plan-NN.md  slide-deck-NN.md  guide-plan-NN.md  guide-doc-NN.md
└── assets/     manifest.md  *.png
```

Everything is authored and rendered in English.

### Skills

| Skill | Use |
|-------|-----|
| `conventions` | Standing rules; loaded at the start of every session |
| `workflow-research` | Cycle 0 — objectives, sources, NotebookLM, research synthesis |
| `workflow-slides` / `workflow-guide` / `workflow-images` | Cycles A / B / C |
| `quarto`, `writing-style`, `slides-style` | Syntax and style defaults (courses override in `course-profile.md`) |
| `revise`, `session-log`, `manifest`, `image-search-slides` | Refinement, continuity, images |
| `process-feedback` | Process any feedback file — plans, deck, guide, notes (`/coursekit:process-feedback <file>`) |
| `init-course` | Scaffold a new course repo (`/coursekit:init-course`) |
| `version` | Show the loaded coursekit copy and version (`/coursekit:version`) |

---

## Adopting coursekit in a new course

Prerequisites: Claude Code, git, Node.js 18+, Quarto, and a GitHub repository for the course. Course repos can be private; only the website is public. A private repo needs a GitHub plan that allows Pages for private repositories.

1. Clone the (empty) course repository and open a terminal at its root.
2. Declare the marketplace and the plugin for this project, pinned to a release:
   ```bash
   claude plugin marketplace add francescoStrada/coursekit#v0.1.0 --scope project
   claude plugin install coursekit@coursekit --scope project
   ```
   This writes `.claude/settings.json`. Collaborators get the plugin after they accept the folder-trust dialog.
3. Start `claude` in the repo and run `/coursekit:init-course`. It copies the templates, never overwrites, fills in the course details, and writes `.coursekit-version`.
4. Fill in `docs/course-overview.md`, `docs/course-topics.md`, and `docs/course-profile.md`.
5. Run `npm run generate && quarto preview` to check the site builds.
6. Commit and push. The deploy workflow publishes to the `gh-pages` branch. Then set **Settings → Pages** to deploy from `gh-pages`.
7. Create the first topic with `npm run create-topic -- "Topic Name"`, then start Cycle 0 with `Use coursekit:workflow-research — Step 0.1. Topic: <slug>.`

Migrating an existing course that used the in-repo framework is covered in [docs/tech-art-migration.md](docs/tech-art-migration.md) (written for TA-4-cinema-and-game; adapt the names for other courses).

### Daily use

The course repo's `CLAUDE.md` makes Claude load `coursekit:conventions` first, so session openers only name the cycle, phase, and slug:

```
Use coursekit:workflow-slides — planning. Topic: 03-lighting. Assignment: 1. Session duration: 1.5h.
/coursekit:process-feedback topics/03-lighting/feedback/slide-plan-01.md
/coursekit:process-feedback topics/03-lighting/feedback/slide-deck-00.md
```

Write feedback in the numbered `feedback/` files rather than in the prompt. It arrives complete and considered, and the history shows recurring requests. `/coursekit:process-feedback` handles every feedback type:
- plan feedback → a plan revision
- deck and guide feedback → surgical refinement
- `notes.md` → a review

It also flags requests that keep recurring across rounds. The full set of openers is in `plugins/coursekit/skills/conventions/workflow-manual.md`.

---

## Versions and upgrades

**Numbering.**
- `0.x` versions are pre-releases, used while coursekit is being tested on real courses.
- A patch (`0.1.1`) is a fix with no change for course repos.
- A minor bump (`0.2.0`) means structural changes: layout or skill behaviour. Check the CHANGELOG migration steps.
- `1.0.0` marks the first consolidated, stable release. After that, a major bump means course repos need migration.

There are two ways to load coursekit. The choice is made **when Claude Code starts**; a running session cannot switch.

| Mode | How | When |
|------|-----|------|
| **Installed** | `.claude/settings.json` pins the marketplace to a tag (`"ref": "v1.0.0"`) and enables `coursekit@coursekit`. Start `claude` normally | Teaching and authoring with a released version |
| **Development** | `claude --plugin-dir <coursekit checkout>/plugins/coursekit`. It loads your working copy in place; edits apply after `/reload-plugins` | Improving coursekit while working on a course |

`/coursekit:version` shows which mode and version a session is using, compares it with the course's `.coursekit-version`, and prints the launch commands.

**Lifecycle**

1. During a semester, work on the course in development mode. Changes to coursekit are ordinary git work in this repo.
2. To release (e.g. at the end of the semester), bump `version` in `plugins/coursekit/.claude-plugin/plugin.json`, write the CHANGELOG entry (format below), commit, then tag and push:
   ```bash
   git tag vX.Y.Z && git push origin main --tags
   ```
3. When a course starts, either:
   - **Stay** on its pinned tag, or
   - **Upgrade**: read the CHANGELOG entries between the two versions, diff the course's managed files against the new templates, agree an upgrade plan, apply it, update `ref` in `.claude/settings.json` and `.coursekit-version`, then run `claude plugin marketplace update coursekit`.

   A `coursekit:upgrade` skill that automates this is planned for v2.

**One version per machine for installed courses.** Claude Code registers a marketplace once per user, so every installed course on a machine shares one coursekit version. To run an older release next to a newer one, use one git worktree per version and development mode:

```bash
git worktree add ../coursekit-v1 v1.0.0
claude --plugin-dir ../coursekit-v1/plugins/coursekit
```

**Release notes discipline.** Every CHANGELOG entry has three parts:
- *Plugin* (Added / Changed / Removed)
- *Course-repo impact* (managed files changed, layout or convention changes)
- *Migration steps*

Upgrades are planned from these entries, so keep them precise.

---

## Developing coursekit

```bash
claude plugin validate .                    # marketplace + plugin manifests
claude plugin validate plugins/coursekit
claude --plugin-dir plugins/coursekit       # load the working copy in a course repo session
```

Repository layout:

```
.claude-plugin/marketplace.json     marketplace (name "coursekit")
plugins/coursekit/
  .claude-plugin/plugin.json        plugin manifest (version lives here only)
  skills/<name>/SKILL.md            skills; conventions/ also holds workflow-manual.md and documentation-map.md
  templates/course-repo/            everything init-course copies, including the managed build files
docs/                               migration checklist, smoke test
AUDIT.md  audit-decisions.md        Phase 1 audit and decisions
ROADMAP.md  CHANGELOG.md
```

Skills reference each other with `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`, which Claude Code substitutes when it loads a skill. A course repo's `CLAUDE.md` refers to skills by name (`coursekit:<name>`), because `${CLAUDE_PLUGIN_ROOT}` is not substituted there.

## License

MIT for the plugin code and templates.
