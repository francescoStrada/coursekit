---
name: workflow-research
description: Cycle 0 research phase for a new topic in a coursekit course — writing objectives.md, automated source discovery, building the source list, NotebookLM setup and interrogation, and building the research synthesis that feeds Cycle A. Use when beginning work on a new topic.
argument-hint: "[step 0.1–0.6] [topic-slug]"
---

# Workflow — Cycle 0: Research

This skill describes the research phase that comes before all content generation. The course author runs it largely by hand, partly in the course's claude.ai project chat and partly in external tools (deep-research tools, NotebookLM). Claude Code reads this skill to understand what the research documents are, how they were produced, and what conventions they follow — and to help write them when asked.

Arguments given with this invocation, if any: $ARGUMENTS

**Course-specific values.** The templates below contain bracketed placeholders. Fill them from `docs/course-profile.md`:
- *Course identity*: institution, programme, course title
- *Audience*: the students' prior knowledge
- *Research defaults*: tools and versions to filter for, source-balance guidance, preferred creators and platforms, exclusions

Never leave a placeholder unfilled in a file the author will paste into another tool.

---

## Position in the Pipeline

The research phase is **Cycle 0**. It precedes and feeds Cycle A (slides planning). No Cycle A session should begin without both `docs/objectives.md` and a research synthesis (`docs/research-*.md`) present and marked as ready.

```
Cycle 0 — Research
  └── docs/objectives.md      ← written first, by hand
  └── docs/sources-<x>.md     ← automated + manual source list
  └── docs/queries-<x>.md     ← NotebookLM queries and raw responses
  └── docs/research-<x>.md    ← research synthesis (NotebookLM output, formatted)

Cycle A — Slides
  └── reads docs/objectives.md + docs/research-*.md
  └── produces plan-slides.md → slides.qmd

Cycle B — Guide
  └── reads slides.qmd + docs/research-*.md
  └── produces plan-guide.md → index.qmd
```

The `-<x>` suffix is optional. Use it only when a topic needs more than one file of a kind (e.g. `research-niagara.md` and `research-fluids.md`).

---

## Step 0.1 — Write objectives.md

This is the first action for every new topic. It is written before opening NotebookLM, before sourcing, before anything else.

### Purpose

`docs/objectives.md` serves three roles at once:
- **The author's clarity checkpoint** — it forces you to state what the topic is actually about before you start collecting material
- **NotebookLM goal statement** — it provides the description text to paste when creating the notebook, and the context to restate at the start of each interrogation session
- **Claude Code orientation** — it gives any later session (in claude.ai or Claude Code) immediate understanding of the topic's pedagogical intent, scope, and position in the course

### File Location

```
topics/<topic-slug>/docs/objectives.md
```

### Structure

```markdown
# Objectives — [Topic Name]

## Topic Context
- **Assignment**: [N — name, or "standalone lecture"]
- **Position in course**: [e.g. "First graded topic, follows onboarding block"]
- **Feeds into**: [e.g. "Character used in Cinematics block (Assignment 3)"]

## Student Prior Knowledge
One short paragraph. What do students already know that is directly relevant?
Reference specific prior courses and tools. Be precise — this text is reused
verbatim in NotebookLM and in Claude Code session openers.

Example (from a game-engine course):
"Students have completed Computer Graphics (Blender — PBR materials, node-based
shader editor, photorealistic rendering) and Virtual Reality (Unity — real-time
rendering, lighting systems, performance profiling). They understand the concept
of a render pipeline and have worked with material graphs. They have not used
Unreal Engine before."

## Learning Objectives
3–5 objectives. Concrete and actionable — what students will be able to do,
not what they will have been exposed to.

- [ ] [Objective 1]
- [ ] [Objective 2]
- [ ] [Objective 3]

## Scope Boundary
One or two sentences on what this topic explicitly does NOT cover.
This prevents NotebookLM and Claude Code from drifting into adjacent territory.

Example:
"This topic does not cover Blueprint scripting or C++ extension of the material
system. Shader performance profiling is mentioned but not taught in depth here."

## Scope Notes
Any resolved decisions about scope that should be carried as standing context.
Brief — one line per item. Written after open questions are resolved.

## NotebookLM Notebook Description
Ready-to-paste text for the NotebookLM notebook description field.
This is written once and stays as the persistent goal framing for the notebook.

---
[Paste-ready block starts here]

This notebook supports a lecture on [topic] for Master's students
in [programme] at [institution].

Student background: [copy from Student Prior Knowledge above, condensed to
two sentences].

Learning objectives: [list objectives in brief].

Content should cover the topic comprehensively from foundational to advanced,
filtered for relevance to [tools and versions from Research defaults] and
practical [role/practice] workflows. Prioritise [preferred source types from
Research defaults]. Exclude [exclusions from Research defaults].

[Paste-ready block ends here]
---

## Open Questions
Any unresolved decisions about scope, sequencing, or content that should be
discussed during Cycle A planning.

- [ ] [Question 1]
- [ ] [Question 2]
```

### Writing Guidelines

**Keep it short.** The whole document should be readable in two minutes. If it is growing long, you are writing content that belongs in the research synthesis, not here.

**The scope boundary is not optional.** Every topic has an infinite rabbit hole. Writing the boundary down explicitly — before you start sourcing — prevents drift in every later step.

**The NotebookLM description must be paste-ready.** Do not leave placeholders unfilled. The author will copy it straight into the notebook description field, so it must need no editing at that moment.

**Objectives should be assessable.** "Understand Lumen" is not an objective. "Configure Lumen settings for a small interior scene and evaluate the performance cost" is.

---

## Step 0.2 — Automated Source Discovery

### Tools

Run both if you have access. They surface different material, and the overlap shows what is well documented versus niche.

- **Gemini Deep Research** (Google account required)
- **ChatGPT Deep Research** (ChatGPT Pro required)

### Prompting for Structured Output

Do not use a generic prompt. Structure the prompt explicitly so you get an extractable source list. Use this template:

```
I am preparing course material on [topic] for Master's students in
[programme] at [institution].

Student background: [paste from objectives.md Student Prior Knowledge].

Learning objectives:
- [Objective 1]
- [Objective 2]
- [Objective 3]

Please research this topic comprehensively and produce:

1. A synthesis of the key concepts, workflows, and trade-offs a
   [role/practitioner] needs to understand — from foundational to advanced,
   filtered specifically for [tools and versions].

2. A structured source list in this exact format:

| URL | Title | Type | Relevance | Notes | Pedagogical note |
|-----|-------|------|-----------|-------|-----------------|

Type options: Official documentation / Conference talk / Tutorial video /
Community resource / Academic / Other

Relevance: one sentence on why this source matters for my objectives.

Notes: tool version if known, timestamp if video, any caveats.

Pedagogical note: one sentence on what a student should open this
source for and at what point in their learning sequence.

Source balance guidelines:
[paste the source-balance guidance from Research defaults — which official
documentation, which conferences, which tutorial creators, which community
platforms, and when academic sources are appropriate]

Exclude: [exclusions from Research defaults].

The goal is a balanced source list that covers both the "what and why"
(methodology, professional practice) and the "how" (tool-specific
documentation). Do not let official documentation crowd out practitioner
sources.

3. A curated list of video tutorials and structured online courses
   relevant to my learning objectives, in this format:

| URL | Title | Creator/Platform | Duration | Relevance | Timestamps |
|-----|-------|-----------------|----------|-----------|------------|

Relevance: one sentence on what this video teaches and who it is best for.
Timestamps: note specific segments if the full video is not relevant.

Prioritise: official vendor tutorial channels and well-regarded educators
with content specific to [tools and versions]. Exclude [exclusions]. Flag
any video where transcript quality may limit NotebookLM import.
```

Run this prompt (or close variants) separately in Gemini Deep Research and ChatGPT Deep Research. Save the full output from each — the synthesis section is useful background reading even if you do not use it directly.

---

## Step 0.3 — Build the Source List

### File Location

```
topics/<topic-slug>/docs/sources-<x>.md
```

### Format

Use a checkbox list rather than a markdown table, because checkboxes inside table cells do not render interactively in most previewers. Each entry follows this structure:

```markdown
- [ ] **[Source Title]**
  - [URL]
  - Type: [type] | Tool: [Gemini / ChatGPT / Manual]
  - [Relevance and pedagogical note]
```

For future topics, consider managing this list in Google Sheets during the review pass and exporting to this format once it is final. The `.md` file is the committed record; Sheets is the editing interface.

### Process

1. Extract sources from each tool's output — written sources and the video list separately
2. Merge them into a single checkbox list
3. Track provenance with the Tool field
4. All entries start unchecked

### Manual Review Pass

Go through each entry. This is a fast scan — 15–20 minutes for a typical topic. You are making a keep/skip judgment based on:

- Is this the right tool version? (Skip anything older than the versions in Research defaults)
- Is this actually about what the description says? (Click and check)
- Is this authoritative? (Prefer official vendor docs > conference talks > established community)
- Is this a landing/overview page with important nested sub-pages? (Flag it for expansion — see below)

For video sources specifically:
- Check the transcript quality in YouTube before ticking — click the three dots → "Show transcript" and verify it is readable
- Note the relevant timestamp range in the entry
- Prefer focused videos (under 20 minutes) over comprehensive ones. If you include a long video, note the relevant segments explicitly

For documentation pages:
- NotebookLM does not crawl links, so nested sub-pages must be added as separate sources
- When a page is clearly an overview with important sub-pages, spend two minutes identifying the relevant sub-pages and add their URLs as separate entries

### Adding Manual Sources

After completing the review pass, add your own sources at the bottom with `Tool: Manual`. Manual research should target gaps — sources you know exist that the automated step missed, or highly specific community content that deep-research tools do not surface well. Do not duplicate sources the automated step already found.

### Loading into NotebookLM

NotebookLM accepts multiple URLs in a single paste, separated by newlines. Copy all the ticked URLs at once and insert them in one operation. There is no need to add sources one by one.

Note: NotebookLM does not support per-source notes in its interface. Give source context inline in interrogation queries instead (e.g. "based only on official documentation sources..."). Pedagogical reasoning belongs in the research synthesis, not in the notebook.

### Finalising

When every entry is either ticked (keep) or left unchecked (skip), update the header:

```markdown
## Status: READY FOR NOTEBOOKLM
Reviewed: [date] | Sources to import: N
```

---

## Step 0.4 — Build the NotebookLM Notebook

### Notebook Setup

- Create one notebook per course topic — do not share notebooks across topics
- Title: `[topic-slug] — [Topic Name]` for easy identification
- Description: paste the ready-to-paste block from `docs/objectives.md` verbatim
- Configure Chat: set the goal to **Custom**, paste the notebook description, and set response length to **Longer**

### Adding Sources

Paste all ✅ ticked URLs from the source list into the "Website and YouTube URLs" field in one operation, one URL per line. NotebookLM imports all of them in a single insert.

In addition to URLs, you can add:
- PDF documents (downloaded documentation, papers)
- Google Docs (your own notes)
- Text files (pasted transcript segments, if a video transcript is too noisy to import directly)

### Sharing with Students

NotebookLM notebooks are not publicly shareable via link. Options for student-facing use:
- **Audio overview**: generate it after finalising the sources; it can be shared as a link. A good entry point for students who prefer listening to reading.
- **Source list**: share the reviewed source list (ticked entries only). Students can create their own notebook with the same sources using a free Google account.
- **Research synthesis**: the synthesised output is itself a readable, student-facing reference once complete.

---

## Step 0.5 — Interrogate NotebookLM

### Session Opening

At the start of each significant interrogation session, restate the goal before asking anything:

```
I am preparing a lecture on [topic]. My students need to understand:
[list objectives from objectives.md].
With that in mind: [your question].
```

This matters most for the learning-sequence and prioritisation queries.

### The queries file

Before running any queries, generate a per-topic queries file from the templates below. It is pre-filled with the topic's student background and learning objectives — not generic placeholders. It serves two purposes:

- **Working document during interrogation**: paste each NotebookLM response directly under its query as you go
- **Input file for Claude**: hand the completed file to Claude to build the research synthesis in a single formatting pass

**File location**: `topics/<topic-slug>/docs/queries-<x>.md`

**How to generate it**: share the query templates below with Claude (in the claude.ai project chat or in Claude Code), together with `docs/objectives.md` for the current topic. Claude produces a ready-to-use file with every placeholder filled in and the citation-enforcement instructions already embedded. Other topics' `docs/queries-*.md` files in the course are concrete examples.

**Structure of the file**:
```markdown
# NotebookLM Queries — [Topic Name]
## Instructions
Run each query in order. Paste the response directly below each query in
the RESPONSE block. Do not edit responses — paste them raw.
When all 8 are filled in, hand this file to Claude for formatting into
the research synthesis.

---

## Query 1 — Core Concepts
[pre-filled query with citation enforcement]

RESPONSE:
[paste here]

---
[repeat for all 8 queries]
```

### Citation Enforcement

Every query must instruct NotebookLM to embed citations inline, not grouped at the end. Without this instruction NotebookLM groups sources at the end of each response, which breaks the citation structure Claude Code needs in later cycles. Each query template below includes the instruction. When generating the queries file, keep it exactly.

### Core Interrogation Sequence

Run these queries in order. Each builds on the previous one.

**1. Core concepts**
```
What are the 5–7 core concepts a [role/practitioner] needs to understand
about [topic] in [tools and versions]?

For each concept, you must:
- Give it a clear title
- Explain it in 3–5 sentences
- Cite every source used, formatted exactly as: [Source Title](URL)
- If a concept is supported by multiple sources, list all of them

Do not group citations at the end. Each concept must have its own inline
citations immediately after the explanation.
```

**2. Workflow / pipeline**
```
What is the recommended step-by-step workflow for [main task of the topic]
in [tools and versions] from a [role/practitioner]'s perspective?

For each step, you must:
- Give it a clear name
- Describe what happens in that step in 2–4 sentences
- Cite every source used, formatted exactly as: [Source Title](URL)
- Flag any steps where your sources disagree or offer multiple valid approaches

Do not group citations at the end. Each step must have its own inline
citations immediately after the description.
```

**3. Common mistakes and misconceptions**
```
What are the most common beginner mistakes or misconceptions about [topic]
in [tools] that your sources address?

For each mistake, you must:
- State the mistake clearly in one sentence
- Explain why it is wrong and what the correct approach is in 2–3 sentences
- Cite every source used, formatted exactly as: [Source Title](URL)

Do not group citations at the end. Each mistake must have its own inline
citations immediately after the explanation.
```

**4. Trade-offs and performance considerations**
```
What are the key technical trade-offs and performance considerations someone
working on [topic] in [tools and versions] should be aware of?

For each trade-off or consideration, you must:
- State it clearly in one sentence as a title
- Explain the trade-off or consideration in 2–4 sentences
- Cite every source used, formatted exactly as: [Source Title](URL)

Do not group citations at the end. Each item must have its own inline
citations immediately after the explanation.
```

**5. Learning sequence**
```
Given all the concepts we have discussed, propose a learning sequence
for a student with this background: [paste Student Prior Knowledge from
objectives.md]. Order from foundational to advanced.

For each item in the sequence, you must:
- Name the concept
- State in one sentence why it comes at this position (what it depends on
  or what it unlocks)
- Cite every source used, formatted exactly as: [Source Title](URL)

Flag any concept that must strictly precede another before it can be
understood.
```

**6. Source comparison / recommended entry points**
```
Which of your sources best explains [key concept] in a way that would work
for a student coming from [students' prior tools, from Audience]?

For each recommended source, you must:
- Give the full source title and URL formatted exactly as: [Source Title](URL)
- State in one sentence what the student should focus on when reading it
- State in one sentence when in the learning sequence they should use it

Order the list from first to last in the recommended reading sequence.
```

**7. Gap check**
```
Are there important aspects of [topic] relevant to my learning objectives
that your current sources do not cover well?

For each gap identified, you must:
- State the gap clearly
- Explain why it matters for the learning objectives
- If any source partially covers it, cite it formatted exactly as:
  [Source Title](URL)
- If no source covers it, say explicitly: "No source in this notebook
  covers this"
```

If the gap check reveals significant holes, add sources to the notebook and re-run the relevant queries before proceeding.

**8. Video and tutorial resources**
```
What video tutorials or structured online courses in your sources would
you recommend for a student who wants to see [topic] concepts demonstrated
in practice rather than read about them?

For each video or course, you must:
- Provide the full title and URL formatted exactly as: [Source Title](URL)
- State in one sentence what it covers and who it is best suited for
- State in one sentence at what point in the learning sequence a student
  should watch it (before the lecture, after the lecture, during the
  assignment, etc.)

Order the list from first to last in the recommended viewing sequence.
```

---

## Step 0.6 — Build the Research Synthesis

### File Location

```
topics/<topic-slug>/docs/research-<x>.md
```

### Structure

```markdown
# Topic Research — [Topic Name]
## Status: [UNDER CONSTRUCTION / READY FOR CYCLE A]
Last updated: [date] | Sources: N | Version context: [tools and versions]

---

## Suggested Learning Sequence
1. [Concept A] — foundational, no prerequisites
2. [Concept B] — requires understanding of A
3. [Concept C] — can be explored in parallel with B
...

---

## Core Concepts

### [Concept Name]
[2–4 sentences. Factual, precise, practitioner register.]
→ [Source title — URL]

### [Concept Name]
[2–4 sentences.]
→ [Source title — URL]
→ [Second source if relevant — URL]

---

## Workflows and Pipelines

### [Workflow Name]
Step-by-step or structured description.
→ [Source — URL]

---

## Common Mistakes and Misconceptions
- [Mistake 1] → [Source]
- [Mistake 2] → [Source]

---

## Trade-offs and Performance Considerations
- [Trade-off 1] → [Source]
- [Trade-off 2] → [Source]

---

## Recommended Entry Points for Students
Sources listed in suggested reading order, with a one-line pedagogical note
on what to look for in each and when in the learning sequence to read it.

1. [Source title] — [URL] — [what to focus on, when to read]
2. [Source title] — [URL] — [what to focus on, when to read]

---

## Recommended Video and Tutorial Resources
Videos and structured courses listed in suggested viewing order, with a note
on what to focus on and when in the learning sequence to watch them.

1. [Video title] — [URL] — [Creator/Platform] — [what to focus on, when to watch]
2. [Video title] — [URL] — [Creator/Platform] — [what to focus on, when to watch]

---

## Scope Notes
[Any content that came up in research but is explicitly out of scope
for this topic, per objectives.md. Brief — one line per item.]

---

## Open Questions for Cycle A Planning
- [ ] [Anything unresolved that should be discussed before planning slides]
```

### Writing Guidelines

**Citations belong inline, not in a bibliography.** Every claim should have its source next to it. A bibliography at the end is not enough — Claude Code needs to know which source supports which concept.

**Keep entries short.** This is a reference document, not a guide. If a concept needs more than four sentences, that expansion belongs in the guide (Cycle B), not here.

**Keep the learning sequence at the top.** It is the single most important output of the research phase for Cycle A planning. Do not bury it.

**Pedagogical notes are required in both the reading and the video sections.** A URL alone is not enough — Claude Code needs to know what a student should open it for and when. Write one sentence per entry.

**The document stays live during the research phase.** Add sources, re-run queries, update entries. It stabilises when you mark it READY FOR CYCLE A.

**The format must survive copy-paste from NotebookLM.** NotebookLM output does not always land as clean markdown. Budget a few minutes to fix headers, clean up bullet formatting, and verify citations before saving.

### Updating the Document

If you add sources to the notebook after an initial draft:
```
I have added [N] new sources covering [topic areas]. Review the existing
summary and tell me: what needs to be added, what should be revised, and
what is now redundant or contradicted by the new material?
```

Make targeted updates — do not regenerate the whole document.

If you remove a source from the notebook, go through the research synthesis and either remove the citations pointing to that source or flag them as `[source removed — verify against current docs]`.

---

## Handoff to Cycle A

The research synthesis is ready for Cycle A when:

- Its status line reads `READY FOR CYCLE A`
- Every core concept from the learning sequence is present with citations
- The recommended entry points section is complete
- The recommended video and tutorial resources section is complete
- Open questions for Cycle A planning are noted

### Cycle A Session Opener

When opening a Cycle A planning session with the research complete:

```
Use coursekit:workflow-slides — planning. Topic: [slug].
Assignment: [N]. Session duration: [time].
docs/objectives.md and docs/research-*.md are ready.
```

Duration is given here, at the slides planning stage, and not in `docs/objectives.md`. It constrains how much of the topic gets introduced in class, not the scope of the topic itself. The guide is not subject to this constraint.

---

## On Full Automation

A fully automated research-to-slides pipeline (e.g. via n8n) is possible in theory, but two limitations currently block it: NotebookLM has no public API, and the Deep Research modes of Gemini and ChatGPT are not exposed through their standard APIs. The manual-but-structured workflow described here is the right approach for now. Revisit automation as the tooling changes.

For topics the author knows very well, the NotebookLM phase can be skipped: write the research synthesis directly from your own knowledge and feed it to Cycle A. The pipeline accepts the document as input regardless of how it was produced.
