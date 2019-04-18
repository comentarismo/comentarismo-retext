(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.retextSentenceSpacing = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');
var visit = require('unist-util-visit');
var is = require('unist-util-is');
var plural = require('plur');

module.exports = sentenceSpacing;

function sentenceSpacing(options) {
  var preferred = (options || {}).preferred || 1;

  return transformer;

  function transformer(tree, file) {
    visit(tree, 'ParagraphNode', visitor);

    function visitor(node) {
      var children = node.children;
      var length = children.length;
      var index = 0;
      var value;
      var child;
      var size;
      var message;

      while (++index < length) {
        child = children[index];

        if (
          is('SentenceNode', children[index - 1]) &&
          is('WhiteSpaceNode', child) &&
          is('SentenceNode', children[index + 1])
        ) {
          value = toString(child);

          /* Ignore anything with non-spaces. */
          if (!/^ +$/.test(value)) {
            continue;
          }

          size = value.length;

          if (size !== preferred) {
            message = file.warn(
              'Expected `' + preferred + '` ' +
              plural('space', preferred) + ' between ' +
              'sentences, not `' + size + '`',
              child
            );

            message.source = 'retext-sentence-spacing';
            message.ruleId = 'retext-sentence-spacing';
          }
        }
      }
    }
  }
}

},{"nlcst-to-string":3,"plur":4,"unist-util-is":5,"unist-util-visit":6}],2:[function(require,module,exports){
module.exports={
	"addendum": "addenda",
	"aircraft": "aircraft",
	"alga": "algae",
	"alumna": "alumnae",
	"alumnus": "alumni",
	"amoeba": "amoebae",
	"analysis": "analyses",
	"antenna": "antennae",
	"antithesis": "antitheses",
	"apex": "apices",
	"appendix": "appendices",
	"axis": "axes",
	"bacillus": "bacilli",
	"bacterium": "bacteria",
	"barracks": "barracks",
	"basis": "bases",
	"beau": "beaux",
	"bison": "bison",
	"bureau": "bureaus",
	"cactus": "cacti",
	"calf": "calves",
	"child": "children",
	"château": "châteaus",
	"cherub": "cherubim",
	"codex": "codices",
	"concerto": "concerti",
	"corpus": "corpora",
	"crisis": "crises",
	"criterion": "criteria",
	"curriculum": "curricula",
	"datum": "data",
	"deer": "deer",
	"diagnosis": "diagnoses",
	"die": "dice",
	"dwarf": "dwarfs",
	"echo": "echoes",
	"elf": "elves",
	"elk": "elk",
	"ellipsis": "ellipses",
	"embargo": "embargoes",
	"emphasis": "emphases",
	"erratum": "errata",
	"faux pas": "faux pas",
	"fez": "fezes",
	"firmware": "firmware",
	"fish": "fish",
	"focus": "foci",
	"foot": "feet",
	"formula": "formulae",
	"fungus": "fungi",
	"gallows": "gallows",
	"genus": "genera",
	"goose": "geese",
	"graffito": "graffiti",
	"grouse": "grouse",
	"half": "halves",
	"hero": "heroes",
	"hoof": "hooves",
	"hypothesis": "hypotheses",
	"index": "indices",
	"knife": "knives",
	"larva": "larvae",
	"leaf": "leaves",
	"libretto": "libretti",
	"life": "lives",
	"loaf": "loaves",
	"locus": "loci",
	"louse": "lice",
	"man": "men",
	"matrix": "matrices",
	"means": "means",
	"medium": "media",
	"memorandum": "memoranda",
	"minutia": "minutiae",
	"moose": "moose",
	"mouse": "mice",
	"nebula": "nebulae",
	"neurosis": "neuroses",
	"news": "news",
	"nucleus": "nuclei",
	"oasis": "oases",
	"offspring": "offspring",
	"opus": "opera",
	"ovum": "ova",
	"ox": "oxen",
	"paralysis": "paralyses",
	"parenthesis": "parentheses",
	"phenomenon": "phenomena",
	"phylum": "phyla",
	"potato": "potatoes",
	"prognosis": "prognoses",
	"quiz": "quizzes",
	"radius": "radii",
	"referendum": "referenda",
	"salmon": "salmon",
	"scarf": "scarves",
	"self": "selves",
	"series": "series",
	"sheep": "sheep",
	"shelf": "shelves",
	"shrimp": "shrimp",
	"species": "species",
	"stimulus": "stimuli",
	"stratum": "strata",
	"swine": "swine",
	"syllabus": "syllabi",
	"symposium": "symposia",
	"synopsis": "synopses",
	"synthesis": "syntheses",
	"tableau": "tableaus",
	"that": "those",
	"thesis": "theses",
	"thief": "thieves",
	"tomato": "tomatoes",
	"tooth": "teeth",
	"trout": "trout",
	"tuna": "tuna",
	"vertebra": "vertebrae",
	"vertex": "vertices",
	"veto": "vetoes",
	"vita": "vitae",
	"vortex": "vortices",
	"wharf": "wharves",
	"wife": "wives",
	"wolf": "wolves",
	"woman": "women"
}

},{}],3:[function(require,module,exports){
'use strict';

module.exports = nlcstToString;

/* Stringify a NLCST node or list of nodes. */
function nlcstToString(node, separator) {
  var sep = separator || '';
  var values;
  var length;
  var children;

  if (!node || (!('length' in node) && !node.type)) {
    throw new Error('Expected node, not `' + node + '`');
  }

  if (typeof node.value === 'string') {
    return node.value;
  }

  children = 'length' in node ? node : node.children;
  length = children.length;

  /* Shortcut: This is pretty common, and a small performance win. */
  if (length === 1 && 'value' in children[0]) {
    return children[0].value;
  }

  values = [];

  while (length--) {
    values[length] = nlcstToString(children[length], sep);
  }

  return values.join(sep);
}

},{}],4:[function(require,module,exports){
'use strict';
var irregularPlurals = require('irregular-plurals');

module.exports = function (str, plural, count) {
	if (typeof plural === 'number') {
		count = plural;
	}

	if (str in irregularPlurals) {
		plural = irregularPlurals[str];
	} else if (typeof plural !== 'string') {
		plural = (str.replace(/(?:s|x|z|ch|sh)$/i, '$&e').replace(/([^aeiou])y$/i, '$1ie') + 's')
			.replace(/i?e?s$/i, function (m) {
				var isTailLowerCase = str.slice(-1) === str.slice(-1).toLowerCase();
				return isTailLowerCase ? m.toLowerCase() : m.toUpperCase();
			});
	}

	return count === 1 ? str : plural;
};

},{"irregular-plurals":2}],5:[function(require,module,exports){
'use strict';

/* eslint-disable max-params */

/* Expose. */
module.exports = is;

/* Assert if `test` passes for `node`.
 * When a `parent` node is known the `index` of node */
function is(test, node, index, parent, context) {
  var hasParent = parent !== null && parent !== undefined;
  var hasIndex = index !== null && index !== undefined;
  var check = convert(test);

  if (
    hasIndex &&
    (typeof index !== 'number' || index < 0 || index === Infinity)
  ) {
    throw new Error('Expected positive finite index or child node');
  }

  if (hasParent && (!is(null, parent) || !parent.children)) {
    throw new Error('Expected parent node');
  }

  if (!node || !node.type || typeof node.type !== 'string') {
    return false;
  }

  if (hasParent !== hasIndex) {
    throw new Error('Expected both parent and index');
  }

  return Boolean(check.call(context, node, index, parent));
}

function convert(test) {
  if (typeof test === 'string') {
    return typeFactory(test);
  }

  if (test === null || test === undefined) {
    return ok;
  }

  if (typeof test === 'object') {
    return ('length' in test ? anyFactory : matchesFactory)(test);
  }

  if (typeof test === 'function') {
    return test;
  }

  throw new Error('Expected function, string, or object as test');
}

function convertAll(tests) {
  var results = [];
  var length = tests.length;
  var index = -1;

  while (++index < length) {
    results[index] = convert(tests[index]);
  }

  return results;
}

/* Utility assert each property in `test` is represented
 * in `node`, and each values are strictly equal. */
function matchesFactory(test) {
  return matches;

  function matches(node) {
    var key;

    for (key in test) {
      if (node[key] !== test[key]) {
        return false;
      }
    }

    return true;
  }
}

function anyFactory(tests) {
  var checks = convertAll(tests);
  var length = checks.length;

  return matches;

  function matches() {
    var index = -1;

    while (++index < length) {
      if (checks[index].apply(this, arguments)) {
        return true;
      }
    }

    return false;
  }
}

/* Utility to convert a string into a function which checks
 * a given node’s type for said string. */
function typeFactory(test) {
  return type;

  function type(node) {
    return Boolean(node && node.type === test);
  }
}

/* Utility to return true. */
function ok() {
  return true;
}

},{}],6:[function(require,module,exports){
'use strict';

/* Expose. */
module.exports = visit;

/* Visit. */
function visit(tree, type, visitor, reverse) {
  if (typeof type === 'function') {
    reverse = visitor;
    visitor = type;
    type = null;
  }

  one(tree);

  /* Visit a single node. */
  function one(node, index, parent) {
    var result;

    index = index || (parent ? 0 : null);

    if (!type || node.type === type) {
      result = visitor(node, index, parent || null);
    }

    if (node.children && result !== false) {
      return all(node.children, node);
    }

    return result;
  }

  /* Visit children in `parent`. */
  function all(children, parent) {
    var step = reverse ? -1 : 1;
    var max = children.length;
    var min = -1;
    var index = (reverse ? max : min) + step;
    var child;

    while (index > min && index < max) {
      child = children[index];

      if (child && one(child, index, parent) === false) {
        return false;
      }

      index += step;
    }

    return true;
  }
}

},{}]},{},[1])(1)
});