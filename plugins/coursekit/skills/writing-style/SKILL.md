---
name: writing-style
description: Tone, register, voice, and content guidelines for all drafting and editing of coursekit course material, slides and guides alike. Read before any generation or refinement session.
---

# Writing Style

Read this skill before any drafting or editing session. It applies to both `slides.qmd` and `index.qmd`. The principles here are not stylistic preferences — they reflect the teaching philosophy behind coursekit courses and the specific students reading the material.

This skill is the coursekit default. If `docs/course-profile.md` has a *Writing style overrides* section, its rules take precedence over the matching rules here.

---

## Who You Are Writing For

Read the *Audience* section of `docs/course-profile.md`. It describes the students' level and the tools and concepts they already master.

Students are Master's level. They arrive with solid hands-on experience in adjacent tools and concepts. They are not beginners. Write for someone who knows the concepts and is learning a new tool or domain, not for someone meeting the concepts for the first time.

---

## Core Principles

### Ground everything in doing

Every concept should connect to something students will actually do or see in the course's domain (see *Domain anchor* in `docs/course-profile.md`). Abstract explanations without a concrete anchor — "this system manages state transitions" — are less useful than grounded ones — "when you open the Control Rig editor, the first thing you'll notice is...".

If you can't connect a concept to a concrete action in the domain, ask whether it belongs in the material at all.

### Connect to prior knowledge

When introducing something new, ask: does this have an equivalent in a tool the students already know (see *Audience*)? If yes, name it explicitly. Students learn faster when they can map new tools onto known concepts.

Examples of the pattern, from a game-engine course:
- "This works similarly to Unity's material graph, but with one important difference..."
- "If you've used Blender's shader editor, the node structure will feel familiar — the key distinction is..."
- "Unlike Blender's armature system, Control Rig operates on..."

Never assume students have forgotten what they learned before this course. Transferability is a core competence these courses develop, and the writing should model it.

### Small but effective

The principle of working at depth rather than scale applies to writing too. Do not try to cover everything. A focused explanation of one concept, done well, is more useful than a superficial survey of five.

When in doubt, cut scope and add depth. A guide that thoroughly explains three things is better than one that mentions eight.

### No padding

Master's level register means: say what needs to be said, then stop. No filler phrases, no restating what was just said, no sentences that exist only to signal a transition. Every sentence should carry information or aid understanding.

Phrases to avoid:
- "In this section, we will explore..."
- "As we have seen..."
- "It is worth noting that..."
- "This is an important concept because..."

---

## Register

**Precise**: use the correct technical term. If the term is tool-specific, use it — don't paraphrase around it. "The Material Instance" is better than "a version of the material with adjustable parameters".

**Professional**: the tone is that of a knowledgeable colleague, not a textbook author. Direct, clear, occasionally dry — not formal to the point of distance, not casual to the point of imprecision.

**Accessible**: precision and accessibility are not opposites. A precise explanation can still be clear. If a concept is genuinely complex, explain it clearly — don't hide behind jargon or assume students will figure it out.

---

## The Guide Specifically

The long-form guide is a **resource map**. Its job is not to teach everything. It orients students toward the right resources and flags what matters.

When referencing external resources (tutorials, documentation, articles):
- Always include a brief note on *why* this resource matters
- Always say *what specifically* to look for — not just "watch this tutorial" but "watch this tutorial focusing on how they set up the emitter module stack from minute 4 onwards"
- Prefer official documentation and tutorials from the tool vendors, and well-regarded community sources, over generic results (see *Domain anchor* for the course's preferred sources)

The guide should feel like a knowledgeable colleague saying: "here's what to read, here's what to ignore, here's the one thing that will save you two hours of frustration."

---

## What to Avoid

- **Textbook voice**: the guide is not a comprehensive reference. It points, it explains, it warns — it does not try to document everything.
- **Over-qualification**: hedges like "this may vary depending on your setup", used too often, erode trust. State things clearly. When genuine variation exists, name it specifically.
- **False encouragement**: phrases like "this is actually quite simple once you get the hang of it" are condescending. Let the content show its own approachability.
- **Scope creep**: if a concept opens a rabbit hole that is genuinely important, note it and point to a resource — don't follow the rabbit hole in the material itself. Students can go deep independently; the material should keep them oriented.

---

## Technical Terms

Technical terms — tool names, system names, domain-specific concepts — are used exactly as the tools name them, and treated as proper nouns.

When a term has a tool-specific meaning that differs from its general usage, clarify it on first use. After that, use it without qualification.

---

## Voice and Authorial Stance

The material is written by someone close to the students in experience, who treats them as capable peers rather than as recipients of knowledge. This shapes the voice in specific ways.

**Honest over reassuring**: if something is genuinely hard, say so. If a tool has real limitations or a workflow is more painful than it looks, acknowledge it. Students trust material that tells them the truth more than material that smooths everything over. "This part is finicky and will take a few attempts" is more useful — and more credible — than implying it's straightforward.

**Trust over hand-holding**: the material points the way and expects students to walk it. It does not narrate every step or pre-emptively answer every possible question. Trust that students will figure things out — that trust is itself part of the message.

**Guide, not authority**: the stance is that of someone a few years further down the same path, sharing what they've learned — not an institution transmitting canonical knowledge. Opinions are allowed. "This approach works better in practice than the documentation suggests" is a valid thing to say.

**Light touch on tone**: an occasional dry observation, a moment of informality, a frank admission that something is annoying — these are welcome. They should feel natural, not performed. The material should not read as if it is trying to be fun. It should read as if it was written by someone who happens to have a sense of humour and isn't hiding it.

**What this is not**: the live classroom energy — the jokes, the banter, the rhythm of a lecture — does not translate to written material. Do not try to simulate it. The written voice carries the *spirit* of the approach (honest, direct, collegial) without trying to recreate the room.
