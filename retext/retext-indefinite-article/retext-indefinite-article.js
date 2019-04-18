(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.retextIndefiniteArticle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
module.exports = require('./lib');

},{"./lib":4}],2:[function(require,module,exports){
module.exports=[
  "U",
  "UEFA",
  "UK",
  "UN",
  "UNHCR",
  "US",
  "USB",
  "eucalypt*",
  "eucha*",
  "euchr*",
  "euclid*",
  "eucrite",
  "eucryphia",
  "eugen*",
  "eukar*",
  "eulog*",
  "eunice",
  "eunuch",
  "euph*",
  "eura*",
  "eure*",
  "euro*",
  "eury*",
  "eutha*",
  "ewe",
  "ewer",
  "habitual",
  "hallucin*",
  "herb*",
  "heredit*",
  "histor*",
  "hilarious*",
  "horrend*",
  "horrif*",
  "hotel*",
  "ms",
  "once",
  "one",
  "oneness",
  "onetime",
  "oneway",
  "oneyear",
  "ubiq*",
  "ugandan",
  "ukase",
  "ukrain*",
  "ukulele",
  "ululated",
  "ululation",
  "unanim*",
  "unary",
  "unesco",
  "uniam*",
  "uniart*",
  "uniat*",
  "uniaur*",
  "uniax*",
  "unibas*",
  "unible",
  "unit*",
  "univ*",
  "unif*",
  "uniq*",
  "uran*",
  "urate",
  "uri*",
  "urologist",
  "uruguay",
  "uruguayan",
  "uruguayans",
  "usab*",
  "usage",
  "use*",
  "using",
  "usu*",
  "utah",
  "uten*",
  "uter*",
  "util*",
  "utop*",
  "utrecht",
  "uttoxeter",
  "uvula",
  "uvular",
  "uyghur"
]

},{}],3:[function(require,module,exports){
module.exports=[
  "α",
  "f",
  "fbi",
  "fm",
  "fda",
  "l",
  "m",
  "n",
  "nfl",
  "nba",
  "nbc",
  "nhl",
  "ngo",
  "npm",
  "nvidia",
  "s",
  "r",
  "h",
  "habitual",
  "hallucin*",
  "hauteur",
  "heir*",
  "herb*",
  "heredit*",
  "hilarious*",
  "histor*",
  "homage",
  "honest*",
  "honor*",
  "honour*",
  "horrend*",
  "horrif*",
  "hotel*",
  "hour*",
  "hiv",
  "lbw",
  "lcd",
  "mpg",
  "mph",
  "MBA",
  "MA",
  "MRI",
  "msc",
  "MS",
  "MTV",
  "html",
  "r&d",
  "SGML",
  "SOS",
  "SMS",
  "x",
  "XML",
  "xmas",
  "x-ray",
  "x-rays",
  "xbox",
  "SUV",
  "STD",
  "SPF",
  "HB",
  "RAF",
  "IOU"
]

},{}],4:[function(require,module,exports){
'use strict';

var visit = require('unist-util-visit');
var is = require('unist-util-is');
var toString = require('nlcst-to-string');
var toWords = require('number-to-words').toWords;
var requiresA = require('./a');
var requiresAn = require('./an');

module.exports = indefiniteArticle;

var vowel = /[aeiou]/;
var digits = /^\d+/;
var join = /^(and|or|nor)$/i;
var punctuation = /^[“”‘’'"()[\]]$/;
var split = /['’ -]/;

requiresA = factory(requiresA);
requiresAn = factory(requiresAn);

function indefiniteArticle() {
  return transformer;

  function transformer(tree, file) {
    visit(tree, 'WordNode', visitor);

    function visitor(node, index, parent) {
      var value = toString(node);
      var normal = lower(value);
      var message;
      var following;
      var suggestion;
      var an;

      if (normal !== 'a' && normal !== 'an') {
        return;
      }

      an = value.length !== 1;
      following = after(parent, index);

      if (!following) {
        return;
      }

      following = toString(following);

      /* Exit if `A` and this isn’t sentence-start: `Station A equals` */
      if (normal !== value && !an && !firstWord(parent, index)) {
        return;
      }

      /* Exit if `a` is used as a letter: `a and b`. */
      if (normal === value && !an && join.test(following)) {
        return;
      }

      suggestion = classify(following);

      if ((suggestion === 'an' && !an) || (suggestion === 'a' && an)) {
        if (normal !== value) {
          suggestion = suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
        }

        message = file.warn(
          'Use `' + suggestion + '` before `' + following + '`, ' +
          'not `' + value + '`',
          node
        );

        message.source = 'retext-indefinite-article';
        message.ruleId = 'retext-indefinite-article';
        message.actual = value;
        message.expected = [suggestion];
      }
    }
  }
}

/** Check if there’s no word before `index`. */
function firstWord(parent, index) {
  var siblings = parent.children;

  while (index--) {
    if (is('WordNode', siblings[index])) {
      return false;
    }
  }

  return true;
}

/** Get the next word. */
function after(parent, index) {
  var siblings = parent.children;
  var sibling = siblings[++index];
  var other;

  if (is('WhiteSpaceNode', sibling)) {
    sibling = siblings[++index];

    if (
      is('PunctuationNode', sibling) &&
      punctuation.test(toString(sibling))
    ) {
      sibling = siblings[++index];
    }

    if (is('WordNode', sibling)) {
      other = sibling;
    }
  }

  return other;
}

/** Classify a word. */
function classify(value) {
  var type = null;
  var normal;

  value = value.replace(digits, toWords).split(split, 1)[0];
  normal = lower(value);

  if (requiresA(value)) {
    type = 'a';
  }

  if (requiresAn(value)) {
    type = type === 'a' ? 'a-or-an' : 'an';
  }

  if (!type && normal === value) {
    type = vowel.test(normal.charAt(0)) ? 'an' : 'a';
  }

  return type;
}

/** Create a test based on a list of phrases. */
function factory(list) {
  var expressions = [];
  var sensitive = [];
  var insensitive = [];

  construct();

  return test;

  function construct() {
    var length = list.length;
    var index = -1;
    var value;
    var normal;

    while (++index < length) {
      value = list[index];
      normal = value === lower(value);

      if (value.charAt(value.length - 1) === '*') {
        /* Regexes are insensitive now, once we need them this
         * should check for `normal` as well. */
        expressions.push(new RegExp('^' + value.slice(0, -1), 'i'));
      } else {
        (normal ? insensitive : sensitive).push(value);
      }
    }
  }

  function test(value) {
    var normal = lower(value);
    var length;
    var index;

    if (
      sensitive.indexOf(value) !== -1 ||
      insensitive.indexOf(normal) !== -1
    ) {
      return true;
    }

    length = expressions.length;
    index = -1;

    while (++index < length) {
      if (expressions[index].test(value)) {
        return true;
      }
    }

    return false;
  }
}

/** Lower-case `value`. */
function lower(value) {
  return value.toLowerCase();
}

},{"./a":2,"./an":3,"nlcst-to-string":5,"number-to-words":6,"unist-util-is":7,"unist-util-visit":8}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
!function(){"use strict";function e(e){return!("number"!=typeof e||e!==e||e===1/0||e===-(1/0))}function t(e){return h.test(e)||s.test(e)?e+"th":u.test(e)?e.replace(u,"ieth"):a.test(e)?e.replace(a,n):e}function n(e,t){return d[t]}function o(t){var n=parseInt(t,10);if(!e(n))throw new TypeError("Not a finite number: "+t+" ("+typeof t+")");var o=String(n),r=n%100,i=r>=11&&13>=r,f=o.charAt(o.length-1);return o+(i?"th":"1"===f?"st":"2"===f?"nd":"3"===f?"rd":"th")}function r(n,o){var r,f=parseInt(n,10);if(!e(f))throw new TypeError("Not a finite number: "+n+" ("+typeof n+")");return r=i(f),o?t(r):r}function i(e){var t,n,o=arguments[1];return 0===e?o?o.join(" ").replace(/,$/,""):"zero":(o||(o=[]),0>e&&(o.push("minus"),e=Math.abs(e)),20>e?(t=0,n=x[e]):p>e?(t=e%v,n=M[Math.floor(e/v)],t&&(n+="-"+x[t],t=0)):y>e?(t=e%p,n=i(Math.floor(e/p))+" hundred"):c>e?(t=e%y,n=i(Math.floor(e/y))+" thousand,"):b>e?(t=e%c,n=i(Math.floor(e/c))+" million,"):g>e?(t=e%b,n=i(Math.floor(e/b))+" billion,"):m>e?(t=e%g,n=i(Math.floor(e/g))+" trillion,"):w>=e&&(t=e%m,n=i(Math.floor(e/m))+" quadrillion,"),o.push(n),i(t,o))}function f(e){var n=r(e);return t(n)}var l="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||this,h=/(hundred|thousand|(m|b|tr|quadr)illion)$/,s=/teen$/,u=/y$/,a=/(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/,d={zero:"zeroth",one:"first",two:"second",three:"third",four:"fourth",five:"fifth",six:"sixth",seven:"seventh",eight:"eighth",nine:"ninth",ten:"tenth",eleven:"eleventh",twelve:"twelfth"},v=10,p=100,y=1e3,c=1e6,b=1e9,g=1e12,m=1e15,w=9007199254740992,x=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],M=["zero","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"],z={toOrdinal:o,toWords:r,toWordsOrdinal:f};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=z),exports.numberToWords=z):l.numberToWords=z}();
},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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