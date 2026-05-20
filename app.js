"use strict";

// ── Media configuration ───────────────────────────────────────────────────────
// Set MEDIA_BASE_URL to your CloudFront distribution URL (no trailing slash).
// Set to "" to serve media from the local gifs/ folder beside index.html.
var MEDIA_BASE_URL = "https://d18qapjg363q5r.cloudfront.net/public/psl-phrase/";

// ── Configuration ────────────────────────────────────────────────────────────
var CFG = {
  FUSE_THRESHOLD:  0.42,  // Fuse distance: 0=exact match only, 1=match anything; lower=better; accepts score ≤ 0.42
  FUSE_MIN_CHARS:  2,     // minimum chars before fuzzy kicks in
  FUZZY_MAX_SCORE: 0.52,  // reject fuzzy hits with Fuse score above this
  SUGGESTION_LIMIT:8,     // max autocomplete items
  DEBOUNCE_MS:     140,   // typing debounce delay (ms)
  MAX_CANDIDATES:  3,     // max alternate candidates shown per sign card
  DEBUG_ICON_EMOJI: "🤟", // hidden icon used for multi-click debug toggle
  DEBUG_ICON_CLICKS: 5,   // hidden debug-mode toggle: click icon N times quickly
  DEBUG_ICON_WINDOW_MS: 1300, // click-window for hidden icon toggle
  DEBUG_SHORTCUT_KEY: "d", // keyboard key for debug-mode toggle (Ctrl+Shift+KEY)
};

// ── Stop words (ignored when tokenising pasted phrases) ──────────────────────
var STOP_WORDS = new Set([
  "is","am","are","was","were","be","been","being",
  "a","an","the","and","or","but","nor","so","yet",
  "in","on","at","to","for","of","with","by","from","as","into","onto",
  "it","its","this","that","these","those",
  "i","you","he","she","we","they","me","him","her","us","them",
  "my","your","his","our","their",
  "do","does","did","have","has","had","will","would","shall","should",
  "can","could","may","might","must","need",
  "not","no","nor","never",
]);

// ── Contraction map ──────────────────────────────────────────────────────────
var CONTRACTIONS = {
  "i'm":"i am","i've":"i have","i'll":"i will","i'd":"i would",
  "you're":"you are","you've":"you have","you'll":"you will","you'd":"you would",
  "he's":"he is","he'd":"he would","he'll":"he will",
  "she's":"she is","she'd":"she would","she'll":"she will",
  "it's":"it is","it'd":"it would","it'll":"it will",
  "we're":"we are","we've":"we have","we'll":"we will","we'd":"we would",
  "they're":"they are","they've":"they have","they'll":"they will","they'd":"they would",
  "that's":"that is","that'd":"that would","that'll":"that will",
  "there's":"there is","there're":"there are","there'll":"there will",
  "who's":"who is","who'd":"who would","who'll":"who will","who've":"who have",
  "what's":"what is","what'd":"what did","what'll":"what will",
  "where's":"where is","when's":"when is","how's":"how is","why's":"why is",
  "don't":"do not","doesn't":"does not","didn't":"did not",
  "can't":"cannot","couldn't":"could not","won't":"will not","wouldn't":"would not",
  "shouldn't":"should not","shan't":"shall not","mightn't":"might not","mustn't":"must not",
  "isn't":"is not","aren't":"are not","wasn't":"was not","weren't":"were not",
  "hasn't":"has not","haven't":"have not","hadn't":"had not",
  "let's":"let us",
};

// ── Search index (built on startup) ─────────────────────────────────────────
var exactLookup = new Map();
var fuseIndex;
var debugModeEnabled = false;
var debugIconClickCount = 0;
var debugIconTimer;
var lastPhraseDebug = null;

function buildSearchIndex() {
  exactLookup.clear();
  for (var i = 0; i < WORD_DICTIONARY.length; i++) {
    var entry = WORD_DICTIONARY[i];
    // Commit 2: use normaliseWord for consistent canonical keys
    var baseKey = normaliseWord(entry.baseWord);
    // Commit 4: warn on duplicate base words
    if (exactLookup.has(baseKey)) {
      console.warn("[PSL] Duplicate base word: '" + entry.baseWord + "' (skipped — first entry wins)");
    } else {
      exactLookup.set(baseKey, entry);
    }
    var aliases = entry.aliases || [];
    for (var j = 0; j < aliases.length; j++) {
      // Commit 2+3: normalise aliases the same way as user input (strips spaces too,
      // so multi-word aliases like "thank you" → "thankyou" become reachable by
      // users who type the concatenated form).
      var ak = normaliseWord(aliases[j]);
      if (!ak) continue;
      if (exactLookup.has(ak)) {
        // Commit 4: warn on alias collisions so dictionary ambiguity is visible
        if (exactLookup.get(ak) !== entry) {
          console.warn("[PSL] Alias collision: '" + aliases[j] + "' for '" + entry.baseWord +
            "' already maps to '" + exactLookup.get(ak).baseWord + "' (skipped)");
        }
      } else {
        exactLookup.set(ak, entry);
      }
    }
  }
  fuseIndex = new Fuse(WORD_DICTIONARY, {
    keys: [
      { name: "baseWord", weight: 1.0 },
      { name: "aliases",  weight: 0.6 },
    ],
    threshold:          CFG.FUSE_THRESHOLD,
    includeScore:       true,
    minMatchCharLength: CFG.FUSE_MIN_CHARS,
    ignoreLocation:     true,
  });
}

// ── Normalisation pipeline ───────────────────────────────────────────────────

function expandContractions(text) {
  return text.replace(/[\w']+/g, function(w) { return CONTRACTIONS[w] || w; });
}

function normaliseWord(raw) {
  return raw.toLowerCase().trim().replace(/[^a-z]/g, "");
}

// Lemmatise via compromise (NLP), fall back to suffix stripping.
function getLemma(word) {
  if (typeof nlp !== "undefined") {
    try {
      var vDoc = nlp(word).verbs();
      if (vDoc.length > 0) {
        var inf = vDoc.toInfinitive().text().toLowerCase().trim();
        if (inf && inf !== word && /^[a-z]+$/.test(inf) && inf.length > 1) return inf;
      }
      var nDoc = nlp(word).nouns();
      if (nDoc.length > 0) {
        var sing = nDoc.toSingular().text().toLowerCase().trim();
        if (sing && sing !== word && /^[a-z]+$/.test(sing) && sing.length > 1) return sing;
      }
    } catch (_) {}
  }
  return simpleStem(word);
}

// Heuristic suffix-stripping stemmer (offline fallback).
function simpleStem(word) {
  if (word.length <= 3) return word;
  if (word.endsWith("ying")) {
    var sy1 = word.slice(0, -4) + "y";   // trying → try
    var sy2 = word.slice(0, -3) + "ie";  // dying  → die
    if (exactLookup.has(sy2)) return sy2;
    if (exactLookup.has(sy1)) return sy1;
    return word; // neither stem in dictionary; preserve original for fuzzy search
  }
  if (word.endsWith("ing")) {
    var s = word.slice(0, -3);
    if (exactLookup.has(s))       return s;
    if (exactLookup.has(s + "e")) return s + "e";
    return s;
  }
  if (word.endsWith("ied")) return word.slice(0, -3) + "y";
  if (word.endsWith("ed")) {
    var s2 = word.slice(0, -2);
    if (exactLookup.has(s2))        return s2;
    if (exactLookup.has(s2 + "e")) return s2 + "e";
    return s2;
  }
  if (word.endsWith("ies"))                       return word.slice(0, -3) + "y";
  if (word.endsWith("ves"))                       return word.slice(0, -3) + "f";
  if (word.endsWith("es") && word.length > 4) {
    var s3 = word.slice(0, -2);
    if (exactLookup.has(s3)) return s3;
    return word.slice(0, -1);
  }
  if (word.endsWith("s") && word.length > 3)     return word.slice(0, -1);
  return word;
}

// Tokenise a free-text phrase (handles contractions + stop word removal).
function tokenisePhrase(phrase) {
  return tokenisePhraseDetailed(phrase).tokens;
}

function tokenisePhraseDetailed(phrase) {
  var text = phrase.toLowerCase().trim();
  var expanded = expandContractions(text);
  var cleaned = expanded.replace(/[^a-z\s]/g, " ");
  var rawTokens = cleaned.split(/\s+/).filter(function(t) { return t.length > 0; });
  var removedShortTokens = rawTokens.filter(function(t) { return t.length <= 1; });
  var lengthFilteredTokens = rawTokens.filter(function(t) { return t.length > 1; });
  var removedStopWords = lengthFilteredTokens.filter(function(t) { return STOP_WORDS.has(t); });
  var tokens = lengthFilteredTokens.filter(function(t) { return !STOP_WORDS.has(t); });
  return {
    original: phrase,
    expanded: expanded,
    cleaned: cleaned,
    rawTokens: rawTokens,
    lengthFilteredTokens: lengthFilteredTokens,
    removedShortTokens: removedShortTokens,
    removedStopWords: removedStopWords,
    tokens: tokens,
  };
}

// ── Tiered matching ──────────────────────────────────────────────────────────
// Returns [{entry, score, tier}] sorted best-first.
function findBestMatches(rawWord) {
  var debug = {
    rawWord: rawWord,
    normalised: "",
    lemma: "",
    selectedTier: "none",
    decision: "",
    fuzzyNormHits: [],
    fuzzyLemmaHits: [],
  };
  var norm = normaliseWord(rawWord);
  debug.normalised = norm;
  if (!norm) {
    debug.decision = "normalised-to-empty";
    return { candidates: [], debug: debug };
  }

  // Tier 1 – exact
  var e1 = exactLookup.get(norm);
  if (e1) {
    debug.selectedTier = "exact";
    debug.decision = "exact-lookup-hit";
    return { candidates: [{ entry: e1, score: 1.0, tier: "exact" }], debug: debug };
  }

  // Tier 2 – lemma
  var lemma = getLemma(norm);
  debug.lemma = lemma;
  if (lemma !== norm) {
    var e2 = exactLookup.get(lemma);
    if (e2) {
      debug.selectedTier = "lemma";
      debug.decision = "lemma-lookup-hit";
      return { candidates: [{ entry: e2, score: 0.9, tier: "lemma" }], debug: debug };
    }
  }

  // Tier 3 – fuzzy
  var candidates = [];
  if (norm.length >= CFG.FUSE_MIN_CHARS) {
    var hits = fuseIndex.search(norm);
    for (var i = 0; i < Math.min(hits.length, CFG.MAX_CANDIDATES * 2); i++) {
      var hScore = hits[i].score || 0;
      debug.fuzzyNormHits.push({
        baseWord: hits[i].item.baseWord,
        rawScore: hScore,
        confidence: 1 - hScore,
        accepted: hScore < CFG.FUZZY_MAX_SCORE,
      });
      if (hScore < CFG.FUZZY_MAX_SCORE) {
        candidates.push({ entry: hits[i].item, score: 1 - hScore, tier: "fuzzy" });
      }
    }
    if (lemma !== norm) {
      var lhits = fuseIndex.search(lemma);
      for (var k = 0; k < Math.min(lhits.length, 2); k++) {
        var lhScore = lhits[k].score || 0;
        var already = candidates.some(function(c) { return c.entry.baseWord === lhits[k].item.baseWord; });
        debug.fuzzyLemmaHits.push({
          baseWord: lhits[k].item.baseWord,
          rawScore: lhScore,
          confidence: (1 - lhScore) * 0.85,
          accepted: lhScore < CFG.FUZZY_MAX_SCORE && !already,
        });
        if (lhScore < CFG.FUZZY_MAX_SCORE && !already) {
          candidates.push({ entry: lhits[k].item, score: (1 - lhScore) * 0.85, tier: "fuzzy" });
        }
      }
    }
  } else {
    debug.decision = "below-fuzzy-min-chars";
  }
  candidates = candidates.sort(function(a, b) { return b.score - a.score; }).slice(0, CFG.MAX_CANDIDATES);
  if (candidates.length > 0) {
    debug.selectedTier = "fuzzy";
    debug.decision = "fuzzy-candidates-selected";
  } else if (!debug.decision) {
    debug.decision = "no-candidates";
  }
  return { candidates: candidates, debug: debug };
}

// ── Autocomplete suggestions ─────────────────────────────────────────────────
function getSuggestions(rawInput) {
  var norm = normaliseWord(rawInput);
  if (!norm) return [];
  var lemma = getLemma(norm);
  var seen  = new Map();

  // Prefix matches (highest priority)
  for (var i = 0; i < WORD_DICTIONARY.length; i++) {
    var entry = WORD_DICTIONARY[i];
    var bw = entry.baseWord.toLowerCase();
    if (bw.startsWith(norm) || (lemma !== norm && bw.startsWith(lemma))) {
      seen.set(bw, { entry: entry, score: 1.0, matchType: "prefix" });
      continue;
    }
    var aliases = entry.aliases || [];
    for (var j = 0; j < aliases.length; j++) {
      // Commit 3: normalise alias before prefix comparison so multi-word aliases
      // ("thank you" → "thankyou") are matched consistently with normalised input.
      var normAlias = normaliseWord(aliases[j]);
      if (normAlias.startsWith(norm)) {
        if (!seen.has(bw)) seen.set(bw, { entry: entry, score: 0.85, matchType: "alias" });
        break;
      }
    }
  }

  // Exact via index
  var eEntry = exactLookup.get(norm) || exactLookup.get(lemma);
  if (eEntry && !seen.has(eEntry.baseWord.toLowerCase())) {
    seen.set(eEntry.baseWord.toLowerCase(), { entry: eEntry, score: 0.95, matchType: "exact" });
  }

  // Fuzzy fill-up
  if (norm.length >= CFG.FUSE_MIN_CHARS) {
    var hits = fuseIndex.search(norm);
    for (var h = 0; h < hits.length && seen.size < CFG.SUGGESTION_LIMIT + 2; h++) {
      var bk = hits[h].item.baseWord.toLowerCase();
      if (!seen.has(bk) && (hits[h].score || 0) < CFG.FUZZY_MAX_SCORE) {
        seen.set(bk, { entry: hits[h].item, score: 1 - (hits[h].score || 0), matchType: "fuzzy" });
      }
    }
  }

  return Array.from(seen.values())
    .sort(function(a, b) { return b.score - a.score; })
    .slice(0, CFG.SUGGESTION_LIMIT);
}

// ── Pill state ───────────────────────────────────────────────────────────────
// pills = [{ rawWord, candidates:[{entry,score,tier}], debug, candidateIdx }]
var pills = [];

function addPill(rawWord) {
  var word = rawWord.trim();
  if (!word) return;
  var matchResult = findBestMatches(word);
  pills.push({ rawWord: word, candidates: matchResult.candidates, debug: matchResult.debug, candidateIdx: 0 });
  renderPills();
  renderCards();
  renderDebugPanel();
}

function addPhrasePills(phrase) {
  var phraseInfo = tokenisePhraseDetailed(phrase);
  var tokens = phraseInfo.tokens;
  lastPhraseDebug = {
    original: phraseInfo.original,
    expanded: phraseInfo.expanded,
    cleaned: phraseInfo.cleaned,
    beforeStop: phraseInfo.lengthFilteredTokens,
    afterStop: tokens,
    removedStopWords: phraseInfo.removedStopWords,
    removedShortTokens: phraseInfo.removedShortTokens,
  };
  for (var i = 0; i < tokens.length; i++) {
    var matchResult = findBestMatches(tokens[i]);
    pills.push({ rawWord: tokens[i], candidates: matchResult.candidates, debug: matchResult.debug, candidateIdx: 0 });
  }
  renderPills();
  renderCards();
  renderDebugPanel();
}

function removePill(idx) {
  pills.splice(idx, 1);
  renderPills();
  renderCards();
}

function clearAll() {
  pills = [];
  lastPhraseDebug = null;
  renderPills();
  renderCards();
  renderDebugPanel();
}

function setCandidateIdx(pillIdx, candIdx) {
  pills[pillIdx].candidateIdx = candIdx;
  renderCards();
  renderDebugPanel();
}

// ── Render pills ─────────────────────────────────────────────────────────────
function renderPills() {
  var container = document.getElementById("pillContainer");
  var input     = document.getElementById("typeaheadInput");
  container.querySelectorAll(".pill").forEach(function(el) { el.remove(); });

  pills.forEach(function(pill, i) {
    var hasMatch = pill.candidates && pill.candidates.length > 0;
    var span = document.createElement("span");
    span.className = "pill" + (hasMatch ? "" : " no-match");
    span.innerHTML =
      esc(pill.rawWord) +
      '<button class="pill-remove" data-idx="' + i + '" aria-label="Remove">\xd7</button>';
    container.insertBefore(span, input);
  });

  container.querySelectorAll(".pill-remove").forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      removePill(parseInt(this.dataset.idx, 10));
    });
  });
}

// ── Media URL helper ─────────────────────────────────────────────────────────
function mediaUrl(relPath) {
  if (!MEDIA_BASE_URL) return relPath;
  return MEDIA_BASE_URL.replace(/\/$/, "") + "/" + relPath.replace(/^\//, "");
}

// ── Render sign cards ────────────────────────────────────────────────────────
function renderCards() {
  var container    = document.getElementById("signCards");
  var resultsLabel = document.getElementById("resultsLabel");
  container.innerHTML = "";

  if (pills.length === 0) {
    resultsLabel.hidden = true;
    container.innerHTML =
      '<div class="empty-state">' +
        '<div class="empty-icon">🤟</div>' +
        '<p>Type words or paste a phrase above to see PSL signs</p>' +
      '</div>';
    return;
  }

  resultsLabel.hidden = false;

  pills.forEach(function(pill, pillIdx) {
    var card     = document.createElement("div");
    var hasMatch = pill.candidates && pill.candidates.length > 0;
    card.className = "sign-card" + (hasMatch ? "" : " no-match");

    if (!hasMatch) {
      card.innerHTML =
        '<button class="card-remove" data-idx="' + pillIdx + '" title="Remove word">✕</button>' +
        '<div class="sign-media-placeholder">🤷</div>' +
        '<div class="sign-label">' + esc(pill.rawWord) + '</div>' +
        '<span class="tier-badge tier-none">not found</span>';
    } else {
      var match   = pill.candidates[pill.candidateIdx || 0];
      var entry   = match.entry;
      var src     = esc(mediaUrl(entry.videoUrl));
      var alt     = esc(entry.baseWord);

      var mediaEl = '<video src="' + src + '" class="sign-media" autoplay loop muted playsinline></video>';

      var typedNote = pill.rawWord.toLowerCase() !== entry.baseWord.toLowerCase()
        ? '<div class="sign-input-word">↑ typed: ' + esc(pill.rawWord) + '</div>'
        : '';

      var altBtns = "";
      if (pill.candidates.length > 1) {
        altBtns = '<div class="alt-buttons">';
        pill.candidates.forEach(function(c, ci) {
          altBtns +=
            '<button class="alt-btn' + (ci === (pill.candidateIdx || 0) ? ' active' : '') + '" ' +
              'data-pill="' + pillIdx + '" data-cand="' + ci + '">' +
              esc(c.entry.baseWord) + '</button>';
        });
        altBtns += '</div>';
      }

      card.innerHTML =
        '<button class="card-remove" data-idx="' + pillIdx + '" title="Remove word">✕</button>' +
        mediaEl +
        '<div class="sign-media-placeholder" style="display:none">📷</div>' +
        '<div class="sign-label">' + esc(entry.baseWord) + '</div>' +
        typedNote +
        '<span class="tier-badge tier-' + match.tier + '">' + match.tier + '</span>' +
        altBtns +
        (debugModeEnabled ? renderCardDebug(pill, match) : "");
    }

    container.appendChild(card);
  });

  container.querySelectorAll(".alt-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      setCandidateIdx(parseInt(this.dataset.pill, 10), parseInt(this.dataset.cand, 10));
    });
  });

  container.querySelectorAll(".card-remove").forEach(function(btn) {
    btn.addEventListener("click", function() {
      removePill(parseInt(this.dataset.idx, 10));
    });
  });

  // Attach media-error handlers via addEventListener (avoids inline event attributes).
  container.querySelectorAll(".sign-media").forEach(function(media) {
    media.addEventListener("error", function() {
      this.style.display = "none";
      var placeholder = this.nextElementSibling;
      if (placeholder && placeholder.classList.contains("sign-media-placeholder")) {
        placeholder.style.display = "flex";
      }
    });
  });
}

function renderCardDebug(pill, match) {
  var debug = pill.debug || {};
  var normHits = (debug.fuzzyNormHits || []).map(function(h) {
    return esc(h.baseWord) + " (" + (h.rawScore || 0).toFixed(3) + ", " + (h.accepted ? "kept" : "rejected") + ")";
  }).join(", ");
  var lemmaHits = (debug.fuzzyLemmaHits || []).map(function(h) {
    return esc(h.baseWord) + " (" + (h.rawScore || 0).toFixed(3) + ", " + (h.accepted ? "kept" : "rejected") + ")";
  }).join(", ");
  return (
    '<div class="w-full mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-[0.67rem] text-slate-600 text-left">' +
      '<div><strong>debug</strong> · decision: ' + esc(debug.decision || "n/a") + '</div>' +
      '<div>raw: <code>' + esc(debug.rawWord || pill.rawWord) + '</code></div>' +
      '<div>normalised: <code>' + esc(debug.normalised || "") + '</code></div>' +
      '<div>lemma: <code>' + esc(debug.lemma || (debug.normalised || "")) + '</code></div>' +
      '<div>selected tier: <code>' + esc(debug.selectedTier || match.tier || "none") + '</code></div>' +
      '<div>selected word: <code>' + esc(match.entry.baseWord) + '</code></div>' +
      '<div>selected score: <code>' + (match.score || 0).toFixed(3) + '</code></div>' +
      '<div>fuzzy hits (norm): ' + (normHits ? '<code>' + normHits + '</code>' : '<code>none</code>') + '</div>' +
      '<div>fuzzy hits (lemma): ' + (lemmaHits ? '<code>' + lemmaHits + '</code>' : '<code>none</code>') + '</div>' +
    '</div>'
  );
}

function setDebugMode(enabled, source) {
  debugModeEnabled = !!enabled;
  var panel = document.getElementById("debugPanel");
  if (panel) panel.hidden = !debugModeEnabled;
  renderCards();
  renderDebugPanel();
  console.info("[PSL] Debug mode " + (debugModeEnabled ? "enabled" : "disabled") + (source ? " via " + source : ""));
}

function toggleDebugMode(source) {
  setDebugMode(!debugModeEnabled, source);
}

function renderDebugPanel() {
  var panel = document.getElementById("debugPanel");
  if (!panel) return;
  if (!debugModeEnabled) { panel.hidden = true; return; }
  panel.hidden = false;

  var phraseHtml = '<div><strong>last phrase transform:</strong> none</div>';
  if (lastPhraseDebug) {
    phraseHtml =
      '<div><strong>last phrase transform</strong></div>' +
      '<div>original: <code>' + esc(lastPhraseDebug.original) + '</code></div>' +
      '<div>expanded contractions: <code>' + esc(lastPhraseDebug.expanded) + '</code></div>' +
      '<div>cleaned input: <code>' + esc(lastPhraseDebug.cleaned) + '</code></div>' +
      '<div>tokens after removing short words (len ≤ 1): <code>' + esc(lastPhraseDebug.beforeStop.join(", ")) + '</code></div>' +
      '<div>removed stop-words: <code>' + esc(lastPhraseDebug.removedStopWords.length ? lastPhraseDebug.removedStopWords.join(", ") : "none") + '</code></div>' +
      '<div>removed short tokens (len ≤ 1): <code>' + esc(lastPhraseDebug.removedShortTokens.length ? lastPhraseDebug.removedShortTokens.join(", ") : "none") + '</code></div>' +
      '<div>tokens used for matching: <code>' + esc(lastPhraseDebug.afterStop.length ? lastPhraseDebug.afterStop.join(", ") : "none") + '</code></div>';
  }

  panel.innerHTML =
    '<div class="text-[0.72rem] text-slate-700 bg-slate-100 border border-slate-300 rounded-xl px-3 py-2">' +
      '<div class="font-bold mb-1">Debug mode active</div>' +
      '<div>Toggle with <code>' + esc(getDebugShortcutLabel()) + '</code> or click ' + esc(CFG.DEBUG_ICON_EMOJI) + ' icon ' + CFG.DEBUG_ICON_CLICKS + ' times.</div>' +
      '<div class="mt-1">' + phraseHtml + '</div>' +
    '</div>';
}

function getDebugShortcutLabel() {
  return "Ctrl + Shift + " + String(CFG.DEBUG_SHORTCUT_KEY || "d").toUpperCase();
}

// ── Autocomplete UI ──────────────────────────────────────────────────────────
var activeSuggIdx = -1;
var debounceTimer;

function showSuggestions(items) {
  var dropdown = document.getElementById("suggestions");
  if (!items.length) { hideSuggestions(); return; }
  activeSuggIdx = -1;
  dropdown.innerHTML = "";
  items.forEach(function(s, idx) {
    var item = document.createElement("div");
    item.className = "suggestion-item";
    item.dataset.idx = idx;
    item.innerHTML =
      '<span class="suggestion-word">' + esc(s.entry.baseWord) + '</span>' +
      '<span class="suggestion-badge badge-' + s.matchType + '">' + s.matchType + '</span>';
    item.addEventListener("mouseover", function() { setActiveSugg(idx); });
    item.addEventListener("mousedown", function(e) {
      e.preventDefault();
      confirmSuggestion(s.entry.baseWord);
    });
    dropdown.appendChild(item);
  });
  dropdown.hidden = false;
}

function hideSuggestions() {
  document.getElementById("suggestions").hidden = true;
  activeSuggIdx = -1;
}

function setActiveSugg(idx) {
  activeSuggIdx = idx;
  document.querySelectorAll(".suggestion-item").forEach(function(el, i) {
    el.classList.toggle("active", i === idx);
  });
}

function confirmSuggestion(word) {
  document.getElementById("typeaheadInput").value = "";
  addPill(word);
  hideSuggestions();
  document.getElementById("typeaheadInput").focus();
}

// ── Input event handlers ─────────────────────────────────────────────────────
function onInput(e) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(function() {
    var val = e.target.value.trim();
    if (!val) { hideSuggestions(); return; }
    showSuggestions(getSuggestions(val));
  }, CFG.DEBOUNCE_MS);
}

function onKeydown(e) {
  var input    = e.target;
  var dropdown = document.getElementById("suggestions");
  var items    = dropdown.querySelectorAll(".suggestion-item");

  if (e.key === "ArrowDown")  { e.preventDefault(); setActiveSugg(Math.min(activeSuggIdx + 1, items.length - 1)); return; }
  if (e.key === "ArrowUp")    { e.preventDefault(); setActiveSugg(Math.max(activeSuggIdx - 1, 0));               return; }
  if (e.key === "Escape")     { hideSuggestions(); return; }

  if (e.key === "Enter" || e.key === " " || e.key === ",") {
    // If suggestions are visible, Enter selects the highlighted item or the first one.
    // Space and comma only select if an item is explicitly highlighted via arrows.
    var shouldConfirm = !dropdown.hidden && items.length > 0 && (
      (e.key === "Enter") ||
      ((e.key === " " || e.key === ",") && activeSuggIdx >= 0)
    );

    if (shouldConfirm) {
      e.preventDefault();
      var targetIdx = activeSuggIdx >= 0 ? activeSuggIdx : 0;
      var word = items[targetIdx].querySelector(".suggestion-word").textContent;
      confirmSuggestion(word);
      return;
    }
    var val = input.value.trim().replace(/[, ]+$/, "");
    if (!val) return;
    e.preventDefault();
    if (val.indexOf(" ") !== -1) { addPhrasePills(val); } else { addPill(val); }
    input.value = "";
    hideSuggestions();
    return;
  }

  if (e.key === "Backspace" && input.value === "" && pills.length > 0) {
    var last = pills[pills.length - 1];
    removePill(pills.length - 1);
    input.value = last.rawWord;
    hideSuggestions();
  }
}

function onPaste(e) {
  e.preventDefault();
  var text = (e.clipboardData || window.clipboardData).getData("text");
  if (!text) return;
  var input = document.getElementById("typeaheadInput");
  var cur   = input.value.trim();
  if (cur) { addPill(cur); input.value = ""; }
  addPhrasePills(text);
  hideSuggestions();
}

// ── Utility ──────────────────────────────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  buildSearchIndex();

  var input    = document.getElementById("typeaheadInput");
  var pillBox  = document.getElementById("pillContainer");
  var clearBtn = document.getElementById("clearBtn");
  var debugIcon = document.getElementById("debugToggleIcon");

  input.addEventListener("input",   onInput);
  input.addEventListener("keydown", onKeydown);
  input.addEventListener("paste",   onPaste);
  input.addEventListener("blur",    function() { setTimeout(hideSuggestions, 160); });
  pillBox.addEventListener("click", function() { input.focus(); });
  clearBtn.addEventListener("click", function() {
    clearAll();
    input.value = "";
    hideSuggestions();
    input.focus();
  });
  if (debugIcon) {
    debugIcon.textContent = CFG.DEBUG_ICON_EMOJI;
    debugIcon.addEventListener("click", function() {
      debugIconClickCount += 1;
      clearTimeout(debugIconTimer);
      debugIconTimer = setTimeout(function() { debugIconClickCount = 0; }, CFG.DEBUG_ICON_WINDOW_MS);
      if (debugIconClickCount >= CFG.DEBUG_ICON_CLICKS) {
        debugIconClickCount = 0;
        clearTimeout(debugIconTimer);
        toggleDebugMode("icon-multiclick");
      }
    });
  }
  document.addEventListener("keydown", function(e) {
    var target = e.target || null;
    var tag = (target && target.tagName) ? target.tagName.toLowerCase() : "";
    var isEditable = tag === "input" || tag === "textarea" || (target && target.isContentEditable);
    if (isEditable) return;
    if (e.ctrlKey && e.shiftKey && String(e.key).toLowerCase() === CFG.DEBUG_SHORTCUT_KEY) {
      e.preventDefault();
      toggleDebugMode("keyboard");
    }
  });

  renderCards(); // show empty state
  renderDebugPanel();
});
