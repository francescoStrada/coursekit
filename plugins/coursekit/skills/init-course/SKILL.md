---
name: init-course
description: Scaffold a new coursekit course repository in the current directory by copying the coursekit course-repo templates (never overwriting existing files) and filling in the course details. Run once per course repo.
disable-model-invocation: true
---

# Init Course

Scaffold the current working directory as a coursekit course repository. This is a copy-only operation: it never overwrites an existing file, never deletes anything, and never commits.

Templates directory: `${CLAUDE_PLUGIN_ROOT}/templates/course-repo/`
Plugin manifest (for the version): `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`

---

## Steps

### 1. Confirm the target

State the current working directory and ask the user to confirm it is the root of the new course repository. Do not continue without confirmation.

### 2. Collect the course details

Ask for these values in one message. Accept "skip" for any of them, and leave skipped placeholders in place for the user to fill in later:

| Placeholder | Meaning | Example |
|-------------|---------|---------|
| `{{COURSE_TITLE}}` | Course title as shown on the website | Virtual Reality |
| `{{ACADEMIC_YEAR}}` | Academic year | 2026/2027 |
| `{{INSTITUTION}}` | Institution | Politecnico di Torino |
| `{{AUTHOR}}` | Author name for slides and the profile | Francesco Strada |
| `{{REPO_URL}}` | GitHub repository URL | https://github.com/<owner>/<repo> |
| `{{SITE_URL}}` | GitHub Pages URL | https://<owner>.github.io/<repo>/ |

`{{COURSEKIT_VERSION}}` is not asked: read `version` from the plugin manifest.

### 3. Plan the copy

List every file under the templates directory, including dotfiles and dot-directories (`.github/`, `.claude/`, `.gitignore`). For each file, check whether the same relative path already exists in the course repo. Show the user two lists, **will copy** and **exists — will skip**, and wait for confirmation.

### 4. Copy

Copy each file from the "will copy" list to the same relative path, creating directories as needed. Never overwrite. For example, with Bash:

```bash
cp -rn "${CLAUDE_PLUGIN_ROOT}/templates/course-repo/." .
```

After copying, verify that every file in the "exists — will skip" list is unchanged.

### 5. Fill in the placeholders

In the copied files only, replace each `{{PLACEHOLDER}}` with the value collected in step 2 (and `{{COURSEKIT_VERSION}}` with the plugin version). Do not touch placeholders the user skipped. Do not modify files that were skipped in step 4.

### 6. Write the version stamp

If `.coursekit-version` does not exist, create it with the plugin version as its only line (e.g. `1.0.0`). If it exists, leave it and report its value.

### 7. Report and next steps

Report what was copied, what was skipped, and which placeholders are still unfilled. Then list the next steps for the author:

1. Fill in `docs/course-overview.md`, `docs/course-topics.md`, and the sections of `docs/course-profile.md`
2. Run `npm run generate`, then `quarto preview`, to check the empty site builds
3. On GitHub: push to `main`. The deploy workflow builds the site and pushes it to the `gh-pages` branch (it declares `contents: write` itself; if the run fails with a permission error, check **Settings → Actions → General → Workflow permissions**). After the first successful run, set **Settings → Pages** to deploy from the `gh-pages` branch. A private repo needs a GitHub plan that allows Pages for private repositories
4. Commit the scaffold (Claude Code does not commit)
5. Create the first topic: `npm run create-topic -- "Topic Name"`, then start Cycle 0 with `coursekit:workflow-research`

Do not commit or push.
