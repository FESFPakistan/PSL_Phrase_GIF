# PSL_Phrase_GIF

A single-page Pakistan Sign Language (PSL) phrase-to-sign viewer.

This branch has been rewritten into a richer static front end with autocomplete, fuzzy matching, normalization, and a local dictionary in `words.js`.

## What is in the repository

- `index.html` — the full UI, search, and rendering logic.
- `words.js` — the word dictionary used for exact, alias, lemma, and fuzzy matching.
- `psl-gif-maker.png` — screenshot used in this README.
- `LICENSE` — project license.

## Runtime model

The app is still static and runs directly in the browser.

It depends on:

- Tailwind CDN for styling
- Fuse.js for fuzzy matching
- Compromise for simple NLP normalization
- Local media files referenced from `words.js`

The default media path convention is still:

```text
gifs/<word>_onlysign.gif
```

## How to use

1. Open `index.html` in a browser.
2. Ensure the local GIFs are available under `gifs/` beside the HTML file.
3. Type a word or paste a phrase.
4. Use Space, Enter, or comma to add words.
5. Click a suggestion to choose a match, or use the alternate match buttons on a sign card.

## What improved in the rewrite

The current codebase is a major improvement over the earlier prototype:

- typeahead/autocomplete input
- phrase tokenization and stop-word filtering
- contraction expansion
- lemma/stemming fallback
- fuzzy matching with multiple candidate results
- sign cards with graceful missing-media fallback
- clearer UI and keyboard handling

## Issues, corrections, and risks found in review

The rewrite is much stronger, but a few issues remain:

### 1) Multi-word aliases are not fully safe

Some dictionary aliases contain spaces, such as `see you`, `thank you`, and `capital city`.
The matching code normalizes input by stripping non-letters, but alias values are compared as plain strings.
That means phrase aliases may not behave consistently unless they are normalized the same way as input.

### 2) Some dictionary entries use mixed-case filenames

Entries such as `Pakistan`, `Karachi`, `Lahore`, and `Islamabad` use capitalized file names in `words.js`.
That can create portability problems on case-sensitive environments if the on-disk files do not match exactly.

### 3) External CDN dependencies are a runtime risk

The app requires network access for Tailwind, Fuse.js, and Compromise unless those libraries are vendored locally.
If the CDN is unavailable, the page may load poorly or fail to function as intended.

### 4) Dictionary collisions are silently resolved

If two entries share a word or alias, the first one wins because the lookup map ignores later duplicates.
That is simple, but it can hide ambiguity and make future dictionary growth harder to reason about.

### 5) The normalizer is heuristic

The fallback stemming and stop-word logic is useful, but it can also over-strip or misclassify words.
That is acceptable for a prototype, but it should be treated as a best-effort matcher rather than a linguistically complete solution.

### 6) The media set is still incomplete in the repository

The code expects `gifs/` assets, but this repository view does not include that folder.
The README should therefore be treated as documenting the expected runtime layout, not a self-contained runnable media set.

## Suggested improvement plan

Below is a low-risk, commit-by-commit plan ordered from smallest impact to larger changes.

### Commit 1 — Documentation only

**Goal:** keep behavior unchanged.

- update README layout and usage notes
- document external dependencies and expected folder structure
- document the limitations found during review

**Impact:** no runtime behavior change.

### Commit 2 — Normalize dictionary inputs

**Goal:** reduce matching surprises without changing the UI.

- standardize file names in `words.js` to a single case convention
- normalize aliases before indexing them
- add a small helper for canonical dictionary keys

**Impact:** very small logic change, mainly correctness and portability.

### Commit 3 — Make alias handling phrase-aware

**Goal:** support entries like `thank you` and `see you` reliably.

- normalize aliases using the same pipeline as user input
- index multi-word aliases as normalized phrases
- keep exact-word behavior unchanged for simple words

**Impact:** moderate, but still localized to matching logic.

### Commit 4 — Handle duplicate and ambiguous matches explicitly

**Goal:** make lookup behavior more predictable.

- detect duplicate aliases during dictionary build
- warn in the console or surface secondary matches in the UI
- prefer explicit ranking over implicit first-match wins

**Impact:** moderate, mostly improves diagnostics and correctness.

### Commit 5 — Reduce external dependency risk

**Goal:** make the page resilient when offline.

- vendor Tailwind/Fuse/Compromise locally or provide fallback builds
- keep the static zero-build workflow intact

**Impact:** larger distribution change, but low product-risk.

### Commit 6 — Split the monolith into maintainable files

**Goal:** improve long-term maintainability.

- move the script out of `index.html`
- separate styles into a dedicated CSS file
- keep `words.js` as data-only

**Impact:** structural change, but low functional risk if done after the matcher stabilizes.

### Commit 7 — Add a lightweight test or validation harness

**Goal:** protect future dictionary changes.

- validate that every `videoUrl` resolves to a predictable path
- test normalization, alias lookup, and fuzzy candidate ordering
- catch duplicate or malformed entries early

**Impact:** highest maintenance value, but should come after the data model is stable.

## Notes

The project is now much closer to a usable prototype, but the safest next work is still incremental:

1. document it cleanly,
2. normalize the data model,
3. fix phrase alias handling,
4. then address packaging and structure.

That sequence keeps each commit small and makes regressions easier to spot.

## Screenshot

![Screenshot](https://github.com/zaidpirwani/PSL_Phrase_GIF/blob/main/psl-gif-maker.png?raw=true)

## References

Helpful libraries used or considered for this rewrite:

- https://compromise.cool/
- https://fusejs.io/
