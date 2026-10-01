# coursekit — Smoke Test

Checklists that verify a coursekit release works before it is relied on. Testing always happens in a **separate course repository**, never inside the coursekit repo.

| Part | Where | When |
|------|-------|------|
| **1 — New course** | A stub repo for the new course (e.g. the VR course) | Before tagging a release: run it against a release candidate |
| **2 — Migration** | A throwaway clone of an existing course (e.g. TA-4-cinema-and-game) | Before migrating that course; uses `tech-art-migration.md` |

Record results inline (`[x]` passed, `[!]` failed + a note). A failure blocks the release. Fix it in coursekit, publish a new release candidate, and re-run the affected checks.

---

# Part 1 — New course

## 1.A Plugin and install

- [ ] `claude plugin validate .` and `claude plugin validate plugins/coursekit` pass in the coursekit repo
- [ ] In the new course repo, `claude plugin marketplace add francescoStrada/coursekit#<tag> --scope project` and `claude plugin install coursekit@coursekit --scope project` succeed, and `.claude/settings.json` contains the marketplace (with the tag as `ref`) and `coursekit@coursekit: true`
- [ ] Start `claude` in the repo and accept the trust dialog. Typing `/coursekit:` lists 15 skills:
  - conventions, workflow-research, workflow-slides, workflow-guide, workflow-images
  - quarto, writing-style, slides-style, revise, session-log, manifest
  - image-search-slides, process-feedback, init-course, version
- [ ] `/coursekit:version` reports **Installed**, the tagged version, and that `.coursekit-version` is missing (not initialised yet)

## 1.B Initialisation

- [ ] **Init check.** First prompt: *"Hi, what can we do in this repo?"* → Claude mentions that the repo is not initialised and asks whether to run `/coursekit:init-course`. It does **not** run it by itself.
- [ ] `/coursekit:init-course` → Claude:
  - asks to confirm the target folder
  - collects the course details
  - shows the will-copy / will-skip lists, with `.claude/settings.json` under will-skip (it already exists)
- [ ] All other template files are copied, including `.github/`, `.gitignore` and `topics/.gitkeep`. The placeholders are filled, and `.coursekit-version` contains the plugin version.
- [ ] Re-running `/coursekit:init-course` reports everything as **exists — will skip** and changes nothing (check with `git status` after committing the scaffold)
- [ ] New session: the init check no longer fires

## 1.C Build layer

- [ ] `npm ci && npm run build` succeeds on the scaffold
- [ ] Fill in `docs/course-overview.md` (course description), `docs/course-topics.md` (topic list), and `docs/course-profile.md` (*Audience*, *Domain anchor*, *Research defaults*)
- [ ] `npm run create-topic -- "<first topic>" --desc "<one line>"` creates:
  - `docs/` with 4 stubs
  - `feedback/` with 5 stubs
  - `assets/manifest.md`
  - the plans, the session log, `slides.qmd`, `index.qmd`, `meta.json`

  Each stub has a purpose line.
- [ ] `npm run generate && quarto preview` shows the home page with the topic card. The slides and guide links open.
- [ ] `npm run describe-assets` prints the "not yet implemented" message
- [ ] Push to `main`. The deploy workflow succeeds. Once **Settings → Pages** is set to `gh-pages`, the site is reachable.

## 1.D Authoring behaviour

Use the first topic. Each check gives a prompt and the expected behaviour.

1. **Conventions load.** *"What are the hard rules for this repo?"* → `coursekit:conventions` is loaded and the four hard rules are listed.
2. **Unknown slug.** *"Use coursekit:workflow-slides — planning."* → Claude asks for the slug before reading any topic file.
3. **Cycle 0.** *"Use coursekit:workflow-research — Step 0.1. Topic: <slug>."* → Claude helps write `docs/objectives.md`, with the placeholders filled from the profile (programme, tools, audience).
4. **Approval gate.** In a planning session: *"just write the first three slides now"* → no `.qmd` is written, and Claude replies with *"Shall we lock the plan before moving to generation?"* or equivalent.
5. **Plan feedback.** Write `feedback/slide-plan-00.md` with two requests. Run `/coursekit:process-feedback topics/<slug>/feedback/slide-plan-00.md` → plan revision, no `.qmd` changes, and open questions at the end.
6. **Recurring requests.** Write `feedback/slide-plan-01.md` repeating one request from round 00. Process it → the repeat is flagged as a recurring request.
7. **Generation.** Approve a tiny plan (3–5 slides) and generate → `slides.qmd` frontmatter follows the default deck template filled from the profile. Missing images appear only as 📸 callouts.
8. **Deck feedback.** Write `feedback/slide-deck-00.md` asking for one title change. Run `/coursekit:process-feedback …` →
   - only the changed block is output, in `SLIDE:` format
   - nothing else in `slides.qmd` changes
   - a session-log entry names the feedback file
9. **Notes.** Add three mixed items to `feedback/notes.md` and process it → the items are grouped (artifact / course / coursekit), and Claude asks what to do instead of acting.
10. **Cross-references.** During checks 5–8, the transcript shows skills read from `<plugin root>/skills/.../SKILL.md` with no "file not found".
11. **Profile.** *"Who am I writing for in this course?"* → the answer comes from *Audience* in `docs/course-profile.md`.
12. **Cycle C — C1.** *"Use coursekit:workflow-images — C1. Topic: <slug>."* → manifest rows marked `🔍 needed`.
13. **No git writes.** Across all checks, Claude never runs `git commit` or `git push`.
14. **English only.** Nothing produces Italian content or mentions translation.

When every check in Part 1 passes, the release candidate can become the release (see README → *Versions and upgrades*).

---

# Part 2 — Migrating an existing course (TA)

Run this before migrating TA-4-cinema-and-game, on a throwaway clone. It checks that the migration in `tech-art-migration.md` keeps the content and the site intact.

## 2.A Setup

- [ ] Take a pre-migration snapshot of the site:
  ```bash
  cd <TA repo> && npm ci && npm run build && cp -r _site <scratch>/ta-site-before
  ```
- [ ] Clone the repo (git clone leaves out `_site/`, `node_modules/` and untracked files):
  ```bash
  git clone <TA repo path> <scratch>/ta-smoke
  ```
- [ ] Apply `tech-art-migration.md` §0–§6 in the clone

## 2.B Checks

- [ ] `npm ci && npm run build` succeeds
- [ ] `_site/topics/<each topic>/` has `index.html` and `slides.html`, and **no** `*_ENG.html`. `topics/extra/tech-setup/` still renders with its sidebar.
- [ ] Content is unchanged. For every topic, the new `.qmd` files are byte-identical to the old `_ENG` sources, apart from the documented 07-vfx and 04-materials stub comments:
  ```bash
  git -C <TA repo> show HEAD:topics/<t>/slides_ENG.qmd | diff - topics/<t>/slides.qmd
  ```
- [ ] Visual spot-check: open `ta-site-before/topics/03-lighting/slides_ENG.html` and the new `_site/topics/03-lighting/slides.html` side by side. Compare images, Mermaid diagrams, fragments, the footer, and slide numbers.
- [ ] Managed files are identical to `plugins/coursekit/templates/course-repo/`
- [ ] No leftover `/process-plan-feedback` command (TA's `.claude/commands/` copy was removed)
- [ ] `/coursekit:version` reports the expected version, and the init check does not fire (because `.coursekit-version` exists)
- [ ] Repeat Part 1 checks 1.D-5, 1.D-8 and 1.D-9 on a migrated topic. Process an existing renamed feedback file (e.g. `05-virtual-humans/feedback/slide-deck-03.md`) in a dry run: ask Claude to list what it would change, without applying it.
