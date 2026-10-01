---
name: process-plan-feedback
description: Process an author feedback file from a topic's feedback/ folder during a planning session (slides plan or guide plan) and revise the plan without generating content.
argument-hint: "[path to feedback file, e.g. topics/<slug>/feedback/slide-plan-01.md]"
disable-model-invocation: true
---

Read the feedback file at $ARGUMENTS and treat its contents as my feedback for the current planning session.
Process every instruction in that file and revise the plan accordingly.

Why the feedback comes as a file: I write it calmly and reflectively in `feedback/` so it arrives complete and unambiguous, instead of being typed in pieces into the prompt. The numbered files also keep a history of incremental changes and recurring requests, which I review to improve the process. Treat each file as one complete, considered round of feedback.

Hard constraints:

- Stay in planning mode — do not generate any qmd content
- Do not write or modify any .qmd files
- If the feedback asks for a revised slide list, present it with a one-line description per slide
- If the feedback asks for a revised guide outline, present it in the same format as plan-guide.md
- At the end of your response, list any open questions that remain before the plan can be locked
