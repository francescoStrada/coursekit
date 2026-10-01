# coursekit v1 — Smoke Test

Run this against a **throwaway copy** of the TA course repo before tagging v1.0.0. It checks that:
- the plugin loads
- the build layer still produces the site
- the migrated TA repo builds
- the authoring behaviour matches the conventions TA used before extraction, now English-only with the new layout

Record results inline (`[x]` passed, `[!]` failed + note). A failure in §B–§E blocks the release.

---

## A. Setup

- [ ] Take a pre-migration snapshot of the TA site, for comparison:
  ```bash
  cd <TA repo> && npm ci && npm run build && cp -r _site <scratch>/ta-site-before
  ```
- [ ] Create the throwaway copy (git clone excludes `_site/`, `node_modules/` and untracked files):
  ```bash
  git clone <TA repo path> <scratch>/ta-smoke && cd <scratch>/ta-smoke
  ```
- [ ] Apply `tech-art-migration.md` §0–§5 in the copy. Use the Appendix A profile. Skip §6 (the plugin is loaded from a checkout here).
- [ ] Launch Claude Code with the development copy:
  ```bash
  claude --plugin-dir <coursekit>/plugins/coursekit
  ```

## B. Plugin

- [ ] `claude plugin validate <coursekit>` → `Validation passed` (warnings acceptable only if listed in the CHANGELOG)
- [ ] `claude plugin validate <coursekit>/plugins/coursekit` → passed
- [ ] In the session, `/` lists the 15 coursekit skills:
  - conventions, workflow-research, workflow-slides, workflow-guide, workflow-images
  - quarto, writing-style, slides-style, revise, session-log, manifest
  - image-search-slides, process-plan-feedback, init-course, version
- [ ] `/coursekit:version` reports **Development**, the plugin root path, git state, and the course's `.coursekit-version`
- [ ] No `/process-plan-feedback` command remains from the old `.claude/commands/` (it was removed in migration §1)

## C. Build layer

- [ ] `npm ci && npm run build` succeeds
- [ ] `_site/topics/<each topic>/` has `index.html` and `slides.html`, and **no** `*_ENG.html`
- [ ] `_site/topics/extra/tech-setup/` still renders, with its sidebar
- [ ] The content is unchanged: for every topic, the new `slides.qmd` and `index.qmd` are byte-identical to the old `*_ENG.qmd` (apart from the documented 07-vfx stub comments):
  ```bash
  git -C <TA repo> show HEAD:topics/<t>/slides_ENG.qmd | diff - topics/<t>/slides.qmd
  ```
- [ ] Visual spot-check: compare `ta-site-before/topics/03-lighting/slides_ENG.html` with the new `_site/topics/03-lighting/slides.html` in a browser (images, Mermaid, fragments, footer, slide numbers)
- [ ] Managed files: `diff` each against `templates/course-repo/` — no differences
- [ ] `npm run create-topic -- "Smoke Test" --desc "tmp"` creates the full layout (`docs/`, `feedback/` with the five files, `assets/manifest.md`, plans, session log), each stub containing a purpose line. `npm run generate` adds its card. Then delete `topics/smoke-test` and run `npm run generate` again.
- [ ] `npm run describe-assets` prints the "not yet implemented" message

## D. Scaffolding (separate empty folder)

- [ ] In an empty folder, launch with `--plugin-dir` and run `/coursekit:init-course`:
  - It asks for confirmation of the target folder
  - It collects the course details
  - It shows the will-copy / will-skip lists
- [ ] All template files are copied, including `.github/`, `.claude/`, `.gitignore`, and `topics/.gitkeep`. The placeholders are filled. `.coursekit-version` contains the plugin version.
- [ ] Re-run `/coursekit:init-course`: everything is reported as **exists — will skip**, and no file changes (check with `git status` after an initial commit)
- [ ] `npm ci && npm run build` succeeds on the empty scaffold

## E. Authoring behaviour (in the migrated copy)

Each check states the prompt and the expected behaviour.

1. **Bootstrap.** Fresh session, prompt: *"What are the hard rules for this repo?"* → Claude loads `coursekit:conventions` (visible as a skill load) and lists the four hard rules.
2. **Unknown slug.** *"Use coursekit:workflow-slides — planning."* → asks for the topic slug before reading any topic file.
3. **Approval gate.** In a planning session for a scratch topic, *"just write the first three slides now"* → no `.qmd` is written. Claude replies with *"Shall we lock the plan before moving to generation?"* or equivalent.
4. **Planning feedback file.** Write `feedback/slide-plan-00.md` with two requests. Run `/coursekit:process-plan-feedback topics/<t>/feedback/slide-plan-00.md` → a revised plan is shown, no `.qmd` changes are made, and the open questions are listed at the end.
5. **Surgical refinement.** On an existing topic, write `feedback/slide-deck-00.md` asking for one slide title change. Then *"Use coursekit:workflow-slides — refinement. Topic: <t>. Apply the feedback in …"* →
   - only the changed block is output, in `SLIDE:` format
   - nothing else in `slides.qmd` changes
   - a session-log entry is appended in the documented format and names the feedback file
6. **Cross-references resolve.** During check 5, the transcript shows `revise` and `session-log` being read from `<plugin root>/skills/.../SKILL.md` with no "file not found".
7. **Course profile is used.** *"Who am I writing for in this course?"* (after loading `coursekit:writing-style`) → the answer cites Blender/Unity from `docs/course-profile.md` → *Audience*.
8. **Deck template.** Generate a 3-slide deck for the scratch topic (approve a tiny plan first) → its frontmatter matches the TA deck template (moon, `c/t`, footer, Mermaid default).
9. **Placeholder convention.** The generated deck uses only 📸 callouts for missing images.
10. **Cycle C — C1.** On a topic with placeholders: *"Use coursekit:workflow-images — C1. Topic: <t>."* → the new rows are `🔍 needed`, and the existing rows are untouched.
11. **Image search.** *"Use coursekit:image-search-slides for slide N of <t>."* → it reads the *Image search* section of the profile before searching.
12. **No git writes.** Across all checks, Claude never runs `git commit` or `git push`.
13. **English only.** No check produces Italian content or asks about translation.

## F. Installed mode (Phase 3, after tagging)

- [ ] Push the tag. In the migrated copy, set `.claude/settings.json` `ref` to the tag and start `claude` **without** `--plugin-dir`. Accept the trust dialog.
- [ ] `/coursekit:version` reports **Installed** with the tagged version
- [ ] Repeat checks E1 and E5
