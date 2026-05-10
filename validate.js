// validate.js — PSL dictionary validation script
// Usage: node validate.js
//
// Checks words.js for duplicate base words, alias collisions, self-aliases,
// missing videoUrl fields, and malformed entries. Run this after any change
// to words.js to catch issues before they reach the browser.

"use strict";

var vm   = require("vm");
var fs   = require("fs");
var path = require("path");

var dictPath = path.join(__dirname, "words.js");
var code     = fs.readFileSync(dictPath, "utf8");
var ctx      = {};
vm.createContext(ctx);
vm.runInContext(code, ctx);

var WORD_DICTIONARY = ctx.WORD_DICTIONARY;
if (!Array.isArray(WORD_DICTIONARY)) {
  console.error("ERROR: Could not load WORD_DICTIONARY from words.js");
  process.exit(1);
}

function normalise(raw) {
  return String(raw).toLowerCase().trim().replace(/[^a-z]/g, "");
}

var errors   = [];
var warnings = [];
var index    = new Map(); // normalised key → first entry that claimed it

WORD_DICTIONARY.forEach(function(entry, i) {
  var label = entry.baseWord ? "'" + entry.baseWord + "'" : "entry[" + i + "]";

  // Required fields
  if (!entry.baseWord) {
    errors.push("Entry " + i + ": missing baseWord");
    return;
  }
  if (!entry.videoUrl) {
    warnings.push(label + ": missing videoUrl");
  }
  if (!Array.isArray(entry.aliases)) {
    warnings.push(label + ": aliases should be an array (got " + typeof entry.aliases + ")");
  }

  // Duplicate base words
  var baseKey = normalise(entry.baseWord);
  if (index.has(baseKey)) {
    errors.push(label + ": base word collides with '" + index.get(baseKey).baseWord + "'");
  } else {
    index.set(baseKey, entry);
  }

  // Alias checks
  var aliases = Array.isArray(entry.aliases) ? entry.aliases : [];
  aliases.forEach(function(alias) {
    if (typeof alias !== "string") {
      warnings.push(label + ": non-string alias: " + JSON.stringify(alias));
      return;
    }
    var ak = normalise(alias);
    if (!ak) {
      warnings.push(label + ": alias '" + alias + "' normalises to empty string");
      return;
    }
    // Self-alias
    if (ak === baseKey) {
      warnings.push(label + ": alias '" + alias + "' is the same as the base word (self-alias)");
      return;
    }
    // Collision with another entry
    if (index.has(ak)) {
      var owner = index.get(ak);
      if (owner !== entry) {
        warnings.push(label + ": alias '" + alias + "' already claimed by '" + owner.baseWord + "'");
      }
    } else {
      index.set(ak, entry);
    }
  });
});

// Summary
var pad = function(n) { return n > 0 ? String(n) : "-"; };
if (errors.length) {
  console.error("\nERRORS (" + errors.length + "):");
  errors.forEach(function(e) { console.error("  ✗ " + e); });
}
if (warnings.length) {
  console.warn("\nWARNINGS (" + warnings.length + "):");
  warnings.forEach(function(w) { console.warn("  ⚠ " + w); });
}
if (!errors.length && !warnings.length) {
  console.log("✓ Dictionary looks clean (" + WORD_DICTIONARY.length + " entries).");
} else {
  console.log(
    "\n" + WORD_DICTIONARY.length + " entries  |  " +
    pad(errors.length)   + " error(s)  |  " +
    pad(warnings.length) + " warning(s)"
  );
}

process.exit(errors.length > 0 ? 1 : 0);
