---
name: version
description: Report which coursekit copy and version this session has loaded (installed release or local development checkout), compare it with the course repo's pinned version, and print the exact launch command for switching. Read-only.
disable-model-invocation: true
---

# coursekit Version

Report the coursekit state for this session and course repo. This skill is **read-only**: it changes no files and no settings.

A running session cannot switch which coursekit copy it loaded. That choice is made when Claude Code starts. This skill shows what is loaded and prints the command for the next launch.

Loaded plugin root: `${CLAUDE_PLUGIN_ROOT}`

---

## Steps

### 1. Loaded copy

- Read `version` from `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`.
- Determine the mode from the plugin root path:
  - It contains `.claude/plugins/cache/` → **Installed** (a cached release from the marketplace)
  - Anything else → **Development** (loaded with `--plugin-dir` or from a local-directory marketplace). For a development copy, also run `git -C "${CLAUDE_PLUGIN_ROOT}" describe --tags --always --dirty` and `git -C "${CLAUDE_PLUGIN_ROOT}" branch --show-current` to show the checkout state.

### 2. Course repo expectations

In the current working directory, read:
- `.coursekit-version` — the version the course repo was scaffolded with or last upgraded to
- `.claude/settings.json` — the `ref` pinned under `extraKnownMarketplaces.coursekit.source`, and whether `enabledPlugins` has `"coursekit@coursekit": true`

If either is missing, say so. It is not an error for a repo that is not yet a coursekit course.

### 3. Report

Present a short table:

| Item | Value |
|------|-------|
| Mode | Installed / Development |
| Loaded version | … |
| Plugin root | … |
| Git state (development only) | tag/commit, branch, dirty? |
| Course `.coursekit-version` | … |
| Course pinned ref | … |

Then flag any mismatch: loaded version vs. `.coursekit-version`, pinned ref vs. `.coursekit-version`, or development mode while the course expects a release.

### 4. Launch commands

Print the commands for the next launch, filling in the real paths:

- **Installed release** (from the course repo root): `claude`
  - To change the pinned release, edit `ref` in `.claude/settings.json`, then run `claude plugin marketplace update coursekit`
- **Development checkout**: `claude --plugin-dir <coursekit checkout>/plugins/coursekit`
- **An older release next to a newer one** (one git worktree per version):
  ```
  git -C <coursekit checkout> worktree add ../coursekit-v<X.Y.Z> v<X.Y.Z>
  claude --plugin-dir <parent>/coursekit-v<X.Y.Z>/plugins/coursekit
  ```

Note: Claude Code registers a marketplace once per user, so every course on this machine that uses the installed release shares the same coursekit version. Use development or worktree launches to run a different version for one course.

Upgrading a course from one release to another is a structured process (read the CHANGELOG entries between the two versions, diff the managed files, agree a plan, execute). In v1 it is documented in the coursekit README; an automated `coursekit:upgrade` skill is planned for v2.
