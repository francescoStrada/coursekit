# CLAUDE.md — coursekit development

This repository is the **coursekit** Claude Code plugin and its marketplace. It is not a course repository: do not apply course authoring conventions here.

- Plugin: `plugins/coursekit/`. Marketplace manifest: `.claude-plugin/marketplace.json`.
- Background and agreed decisions: `AUDIT.md` (§12–§15 are binding), `audit-decisions.md`. Future work: `ROADMAP.md`.
- Validate after every manifest or skill change: `claude plugin validate .` and `claude plugin validate plugins/coursekit`.
- `version` lives only in `plugins/coursekit/.claude-plugin/plugin.json`. Never set it in `marketplace.json`.
- Every user-facing change gets a CHANGELOG entry in the three-part format (Plugin / Course-repo impact / Migration steps).
- Skills reference each other via `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`. Course-facing text refers to skills by name (`coursekit:<name>`).
- Files under `templates/course-repo/` that carry the `managed by coursekit` header are the canonical build layer. Keep the header when editing them.
- The source repos (TA-4-cinema-and-game, lecture-material-pipeline) are read-only references.
- Commit only when asked. Work happens on `main` (single branch).
