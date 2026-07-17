# Questwyst — Story Pages Guide

This folder holds every genre's branching story. Read this before adding
a new genre or a new scene.

## Folder structure

One flat folder per genre. No subfolders inside it — every scene for
that genre is a sibling file, sitting right next to the others.

```
client/
├── index.html          <- home page, genre picker
├── style.css             <- ALL styling lives here, shared by every page
├── public/
│   └── qt-logo.png
└── stories/
    ├── README.md          <- this file
    ├── _template/
    │   └── scene-template.html   <- copy this to start a new scene
    ├── romance/  (63 files, 6 levels deep — the full worked example)
    │   ├── 1-start.html            <- root scene
    │   ├── 2a-ask-why.html         <- chose A
    │   ├── 2b-row-along.html       <- chose B
    │   ├── 3aa-offer-to-join.html  <- chose A, then A (branches further)
    │   ├── 3ab-say-goodbye.html    <- chose A, then B (branches further)
    │   ├── 3ba-ask-on-shore.html   <- chose B, then A (branches further)
    │   ├── 3bb-mystery-stays.html  <- chose B, then B (branches further)
    │   ├── 4aaa-dance-the-night.html   ...8 files at depth 4
    │   ├── 5aaaa-ask-him-to-visit.html ...16 files at depth 5
    │   └── 6aaaaa-he-visits-her-city.html ...32 ENDINGS at depth 6
    ├── western/    (same pattern once built)
    ├── scifi/      (same pattern once built)
    ├── horror/     (same pattern once built)
    └── comedy/     (same pattern once built)
```

Romance doesn't have to be your depth target — it just happened to grow
that deep. A genre can be as shallow as one ending-only root scene, or
go as deep as you're willing to write content for. The naming pattern
below works at any depth without changing.

## Naming pattern — this is the whole system

```
<depth><choice-path>-<short-description>.html
```

- **depth** — how many choices deep this scene is (`1`, `2`, `3`, ...)
- **choice-path** — the exact sequence of `a`/`b` choices taken to get
  here (skipped entirely for the root scene, since depth 1 has no
  choices behind it yet)
- **short-description** — 2 to 4 words, lowercase, hyphenated, that
  actually say what happens in the scene

Every filename is unique and self-explanatory just by reading it — you
never need to open a file to know what it is, and nothing is ever named
the same thing twice, even across a big story tree.

**Worked example, reading the filenames like a map:**
- `1-start.html` — the beginning
- `2a-ask-why.html` — one choice in, this is the "ask why" branch
- `3aa-offer-to-join.html` — two choices in: first branch A, then
  branch A again, and this scene is about "offering to join"
- `6aaaaa-he-visits-her-city.html` — five choices deep, all the way
  A-A-A-A-A, and this is where that specific thread ends

## The three link patterns

Every file only ever uses one of these three:

| What you're linking to | What to write |
|---|---|
| The shared stylesheet | `/style.css` |
| Any other scene in this genre (choice buttons, Return button) | Just the plain filename, e.g. `'2a-ask-why.html'` — no folders, no `../`, nothing else, because every scene in a genre sits in the same folder |
| Home page — but ONLY from the root scene's Return button, or from an ending scene's "Return to the beginning" link | `/index.html` |

`/style.css` and `/index.html` both start with `/`, which always means
"the site's actual root" — so those two never change no matter what.

## Ending scenes

A scene with no further choices skips the two-button `.choice-row` and
uses a single link instead:

```html
<a class="choice-btn choice-btn--end" href="/index.html">
  <span class="choice-btn__text">Return to the beginning</span>
</a>
```

See `stories/romance/6aaaaa-he-visits-her-city.html` for a working
example (any of the 32 files starting with `6` in the Romance folder
are endings — depth 6 is as deep as that tree currently goes).

## Adding a brand new genre

1. Create `stories/<genre>/`
2. Copy `stories/_template/scene-template.html` in as `1-start.html`
3. Fill in the bracketed placeholders (title, story text, choices, links)
4. Give the `<body>` a theme class: `class="theme-<genre>"`
5. In `style.css`, add a `body.theme-<genre>` block — copy the
   `body.theme-romance` section as a worked example (search for
   `theme-romance` in `style.css`) and swap in genre-appropriate colors
6. In `index.html`, add one line to the `storyPages` object:
   ```js
   const storyPages = {
     romance: 'stories/romance/1-start.html',
     western: 'stories/western/1-start.html'   // <- new line
   };
   ```

## Adding the next branch to an existing scene

1. Copy the template twice into the same genre folder, naming each
   using the pattern above (e.g. extending `2a-ask-why.html` would
   produce `3aa-....html` and `3ab-....html`)
2. Fill in the story text and choices (or make it an ending — see above)
3. Set each new file's Return button to the plain filename of the
   scene that led to it (e.g. both new files here would return to
   `'2a-ask-why.html'`)
4. Go to the scene you're branching FROM and point its two choice
   buttons at these two new filenames

## Turning an existing ENDING into a branch (going deeper later)

This is different from the case above — here you're taking a scene
that currently has no further choices and giving it two. This is
exactly how Romance grew from depth 3 to depth 6.

1. Open the ending scene. Delete its single
   `<a class="choice-btn choice-btn--end">` link
2. Replace it with a normal two-button `.choice-row` (copy from any
   branching scene, e.g. `2a-ask-why.html`)
3. In the `<script>`, delete nothing about the Return button — that
   stays exactly the same, since the scene's position in the tree
   hasn't changed, only what comes after it
4. Add the two choice-button click handlers, pointing at two new
   filenames one depth deeper (e.g. turning `3aa-....html` into a
   branch means its children are named `4aaa-....html` and
   `4aab-....html`)
5. Create those two new files using the template, following the same
   steps as "adding the next branch" above

**Validating a big batch of changes:** if you're extending several
branches at once (like turning all 4 depth-3 endings into branches and
writing everything below them in one pass), it's worth writing a quick
script to check your work before committing — walk every `.html` file
in the genre folder, confirm every link in it points at a filename
that actually exists in that same folder, and confirm every file is
reachable starting from `1-start.html`. A single typo in one filename
breaks that whole branch silently (the page just won't navigate, with
no error shown), and that's very easy to miss by eye once you're past
a dozen or so files.