(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.retextDiacritics = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var keys = require('object-keys');
var casing = require('match-casing');
var search = require('nlcst-search');
var nlcstToString = require('nlcst-to-string');
var position = require('unist-util-position');
var quotation = require('quotation');
var schema = require('./schema');

module.exports = diacritics;

/* List of all phrases. */
var list = keys(schema);

/* Attacher. */
function diacritics() {
  return transformer;

  /* Search `tree` for violations. */
  function transformer(tree, file) {
    search(tree, list, searcher);

    function searcher(match, index, parent, phrase) {
      var value = nlcstToString(match);
      var replace = casing(schema[phrase], value);
      var message = 'Replace ' + quotation(value, '`') + ' with ' + quotation(replace, '`');

      message = file.warn(message, {
        start: position.start(match[0]),
        end: position.end(match[match.length - 1])
      }, phrase.replace(/\s+/g, '-').toLowerCase());

      message.source = 'retext-diacritics';
      message.actual = value;
      message.expected = [replace];
    }
  }
}

},{"./schema":12,"match-casing":2,"nlcst-search":5,"nlcst-to-string":6,"object-keys":7,"quotation":9,"unist-util-position":10}],2:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module match-casing
 * @fileoverview Match the case of `value` to that of `base`.
 */

'use strict';

module.exports = casing;

function casing(value, base) {
  var length;
  var index;
  var char;
  var rest;
  var cap;

  if (base.toUpperCase() === base) {
    return value.toUpperCase();
  }

  if (base.toLowerCase() === base) {
    return value.toLowerCase();
  }

  length = base.length;
  index = -1;

  while (++index < length) {
    char = base.charAt(index);

    if (char.toUpperCase() !== char.toLowerCase()) {
      rest = base.slice(index + 1);

      cap = char === char.toUpperCase() && rest === rest.toLowerCase();
      break;
    }
  }

  if (cap) {
    length = value.length;
    index = -1;

    while (++index < length) {
      char = value.charAt(index).toUpperCase();

      if (char !== char.toLowerCase()) {
        return value.slice(0, index) + char + value.slice(index + 1).toLowerCase();
      }
    }
  }

  return value;
}

},{}],3:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');

module.exports = isLiteral;

var single = {
  '-': true, // Hyphen-minus
  '–': true, // En dash
  '—': true, // Em dash
  ':': true, // Colon
  ';': true // Semi-colon
};

/* Pair delimiters. From common sense, and wikipedia:
 * Mostly from https://en.wikipedia.org/wiki/Quotation_mark. */
var pairs = {
  ',': {
    ',': true
  },
  '-': {
    '-': true
  },
  '–': {
    '–': true
  },
  '—': {
    '—': true
  },
  '"': {
    '"': true
  },
  '\'': {
    '\'': true
  },
  '‘': {
    '’': true
  },
  '‚': {
    '’': true
  },
  '’': {
    '’': true,
    '‚': true
  },
  '“': {
    '”': true
  },
  '”': {
    '”': true
  },
  '„': {
    '”': true,
    '“': true
  },
  '«': {
    '»': true
  },
  '»': {
    '«': true
  },
  '‹': {
    '›': true
  },
  '›': {
    '‹': true
  },
  '(': {
    ')': true
  },
  '[': {
    ']': true
  },
  '{': {
    '}': true
  },
  '⟨': {
    '⟩': true
  },
  '「': {
    '」': true
  }
};

/* Check if the node in `parent` at `position` is enclosed
 * by matching delimiters. */
function isLiteral(parent, index) {
  if (!(parent && parent.children)) {
    throw new Error('Parent must be a node');
  }

  if (isNaN(index)) {
    throw new Error('Index must be a number');
  }

  if (
    (!hasWordsBefore(parent, index) && nextDelimiter(parent, index, single)) ||
    (!hasWordsAfter(parent, index) && previousDelimiter(parent, index, single)) ||
    isWrapped(parent, index, pairs)
  ) {
    return true;
  }

  return false;
}

/* Check if the node in `parent` at `position` is enclosed
 * by matching delimiters. */
function isWrapped(parent, position, delimiters) {
  var prev = previousDelimiter(parent, position, delimiters);
  var next;

  if (prev) {
    next = nextDelimiter(parent, position, delimiters[toString(prev)]);
  }

  return Boolean(next);
}

/* Find the previous delimiter before `position` in
 * `parent`. Returns the delimiter node when found. */
function previousDelimiter(parent, position, delimiters) {
  var siblings = parent.children;
  var index = position;
  var result;

  while (index--) {
    result = delimiterCheck(siblings[index], delimiters);

    if (result === null) {
      continue;
    }

    return result;
  }

  return null;
}

/* Find the next delimiter after `position` in
 * `parent`. Returns the delimiter node when found. */
function nextDelimiter(parent, position, delimiters) {
  var siblings = parent.children;
  var index = position;
  var length = siblings.length;
  var result;

  while (++index < length) {
    result = delimiterCheck(siblings[index], delimiters);

    if (result === null) {
      continue;
    }

    return result;
  }

  return null;
}

/* Check if `node` is in `delimiters`. */
function delimiterCheck(node, delimiters) {
  var type = node.type;

  if (type === 'WordNode' || type === 'SourceNode') {
    return false;
  }

  if (type === 'WhiteSpaceNode') {
    return null;
  }

  return toString(node) in delimiters ? node : false;
}

/* Check if there are word nodes before `position`
 * in `parent`. */
function hasWordsBefore(parent, position) {
  return containsWord(parent, 0, position);
}

/* Check if there are word nodes before `position`
 * in `parent`. */
function hasWordsAfter(parent, position) {
  return containsWord(parent, position + 1, parent.children.length);
}

/* Check if parent contains word-nodes between
 * `start` and `end`. */
function containsWord(parent, start, end) {
  var siblings = parent.children;
  var index = start - 1;

  while (++index < end) {
    if (siblings[index].type === 'WordNode') {
      return true;
    }
  }

  return false;
}

},{"nlcst-to-string":6}],4:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');

module.exports = normalize;

var ALL = /[-']/g;
var DASH = /-/g;
var APOSTROPHE = /’/g;
var QUOTE = '\'';
var EMPTY = '';

/* Normalize `value`. */
function normalize(value, options) {
  var settings = options || {};
  var allowApostrophes = settings.allowApostrophes;
  var allowDashes = settings.allowDashes;
  var result = (typeof value === 'string' ? value : toString(value))
    .toLowerCase()
    .replace(APOSTROPHE, QUOTE);

  if (allowApostrophes && allowDashes) {
    return result;
  }

  if (allowApostrophes) {
    return result.replace(DASH, EMPTY);
  }

  if (allowDashes) {
    return result.replace(QUOTE, EMPTY);
  }

  return result.replace(ALL, EMPTY);
}

},{"nlcst-to-string":6}],5:[function(require,module,exports){
'use strict';

/* Dependencies. */
var visit = require('unist-util-visit');
var normalize = require('nlcst-normalize');
var isLiteral = require('nlcst-is-literal');

var own = {}.hasOwnProperty;

/* Expose. */
module.exports = search;

/* Constants. */
var C_SPACE = ' ';
var T_WORD = 'WordNode';
var T_WHITE_SPACE = 'WhiteSpaceNode';

/* Search. */
function search(tree, phrases, handler, options) {
  var settings = options || {};
  var apos = settings.allowApostrophes || options;
  var dashes = settings.allowDashes || false;
  var literals = settings.allowLiterals;
  var config = {allowApostrophes: apos, allowDashes: dashes};
  var byWord = {};
  var length;
  var index;
  var key;
  var firstWord;

  if (!tree || !tree.type) {
    throw new Error('Expected node');
  }

  if (typeof phrases !== 'object') {
    throw new Error('Expected object for phrases');
  }

  length = phrases.length;
  index = -1;

  if ('length' in phrases) {
    while (++index < length) {
      handlePhrase(phrases[index]);
    }
  } else {
    for (key in phrases) {
      handlePhrase(key);
    }
  }

  /* Search the tree. */
  visit(tree, T_WORD, visitor);

  /* Test a phrase.   */
  function test(phrase, position, parent) {
    var siblings = parent.children;
    var node = siblings[position];
    var count = siblings.length;
    var queue = [node];
    var expression = phrase.split(C_SPACE).slice(1);
    var length = expression.length;
    var index = -1;

    /* Move one position forward. */
    position++;

    /* Iterate over `expression`. */
    while (++index < length) {
      /* Allow joining white-space. */
      while (position < count) {
        node = siblings[position];

        if (node.type !== T_WHITE_SPACE) {
          break;
        }

        queue.push(node);
        position++;
      }

      node = siblings[position];

      /* Exit if there are no nodes left, if the
       * current node is not a word, or if the
       * current word does not match the search for
       * value. */
      if (
        !node ||
        node.type !== T_WORD ||
        normalize(expression[index], config) !== normalize(node, config)
      ) {
        return null;
      }

      queue.push(node);
      position++;
    }

    return queue;
  }

  /* Visitor for `WordNode`s.   */
  function visitor(node, position, parent) {
    var word;
    var phrases;
    var length;
    var index;
    var result;

    if (!literals && isLiteral(parent, position)) {
      return;
    }

    word = normalize(node, config);
    phrases = own.call(byWord, word) ? byWord[word] : [];
    length = phrases.length;
    index = -1;

    while (++index < length) {
      result = test(phrases[index], position, parent);

      if (result) {
        handler(result, position, parent, phrases[index]);
      }
    }
  }

  /* Handle a phrase. */
  function handlePhrase(phrase) {
    firstWord = normalize(phrase.split(C_SPACE, 1)[0], config);

    if (own.call(byWord, firstWord)) {
      byWord[firstWord].push(phrase);
    } else {
      byWord[firstWord] = [phrase];
    }
  }
}

},{"nlcst-is-literal":3,"nlcst-normalize":4,"unist-util-visit":11}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = require('./isArguments');
var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":8}],8:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}],9:[function(require,module,exports){
'use strict';

module.exports = quotation;

var C_DEFAULT = '"';

/* Quote text. */
function quotation(value, open, close) {
  var result;
  var index;
  var length;

  open = open || C_DEFAULT;
  close = close || open;

  if (typeof value === 'string') {
    return open + value + close;
  }

  if (typeof value !== 'object' || !('length' in value)) {
    throw new Error('Expected string or array of strings');
  }

  result = [];
  length = value.length;
  index = -1;

  while (++index < length) {
    result[index] = quotation(value[index], open, close);
  }

  return result;
}

},{}],10:[function(require,module,exports){
'use strict';

/* Expose. */
var position = exports;

position.start = positionFactory('start');
position.end = positionFactory('end');

/* Factory to get a position at `type`. */
function positionFactory(type) {
  return pos;

  /* Get a position in `node` at a bound `type`. */
  function pos(node) {
    var pos = (node && node.position && node.position[type]) || {};

    return {
      line: pos.line || null,
      column: pos.column || null,
      offset: isNaN(pos.offset) ? null : pos.offset
    };
  }
}

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
/* eslint-disable quote-props */
module.exports = {
  /* French. */
  'beau ideal': 'beau idéal',
  'boutonniere': 'boutonnière',
  'bric-a-brac': 'bric-à-brac',
  'cafe': 'café',
  'cause celebre': 'cause célèbre',
  'chevre': 'chèvre',
  'cliche': 'cliché',
  'comsi comsa': 'comme ci comme ça',
  'comme ci comme ca': 'comme ci comme ça',
  'consomme': 'consommé',
  'coup d\'etat': 'coup d\'état',
  'coup de grace': 'coup de grâce',
  'crudites': 'crudités',
  'creme brulee': 'crème brûlée',
  'creme de menthe': 'crème de menthe',
  'creme fraice': 'crème fraîche',
  'creme fresh': 'crème fraîche',
  'crepe': 'crêpe',
  'debutante': 'débutante',
  'decor': 'décor',
  'deja vu': 'déjà vu',
  'denouement': 'dénouement',
  'facade': 'façade',
  'fiance': 'fiancé',
  'fiancee': 'fiancée',
  'flambe': 'flambé',
  'garcon': 'garçon',
  'lycee': 'lycée',
  'maitre d': 'maître d',
  'menage a trois': 'ménage à trois',
  'negligee': 'négligée',
  'papier-mache': 'papier-mâché',
  'paper mache': 'papier-mâché',
  'paper-mache': 'papier-mâché',
  'protege': 'protégé',
  'protegee': 'protégée',
  'puree': 'purée',

  'raison d\'etre': 'raison d\'être',
  'my resume': 'my résumé',
  'your resume': 'your résumé',
  'his resume': 'his résumé',
  'her resume': 'her résumé',
  'a resume': 'a résumé',
  'the resume': 'the résumé',
  'risque': 'risqué',
  'roue': 'roué',
  'soiree': 'soirée',
  'souffle': 'soufflé',
  'soupcon': 'soupçon',
  'touche': 'touché',
  'tete-a-tete': 'tête-à-tête',
  'voila': 'voilà',
  'a la carte': 'à la carte',
  'a la mode': 'à la mode',
  'emigre': 'émigré',

  /* Spanish. */
  'el nino': 'el niño',
  'jalapeno': 'jalapeño',
  'la nina': 'la niña',
  'pina colada': 'piña colada',
  'senor': 'señor',
  'senora': 'señora',
  'senorita': 'señorita',

  /* Portuguese. */
  'acai': 'açaí',

  /* German. */
  'doppelganger': 'doppelgänger',
  'fuhrer': 'führer',
  'gewurztraminer': 'gewürztraminer',
  'ubermensch': 'Übermensch',

  /* Latin. */
  'vis-a-vis': 'vis-à-vis',

  /* Swedish. */
  'filmjolk': 'filmjölk',
  'smorgasbord': 'smörgåsbord',

  /* Names, places, and companies */
  'beyonce': 'beyoncé',
  'bronte': 'brontë',
  'champs-elysees': 'champs-Élysées',
  'citroen': 'citroën',
  'curacao': 'curaçao',
  'haagen-dazs': 'häagen-dazs',
  'haagen dazs': 'häagen-dazs',
  'lowenbrau': 'löwenbräu',
  'monegasque': 'monégasque',
  'motley crue': 'mötley crüe',
  'nescafe': 'nescafé',
  'queensryche': 'Queensrÿche',
  'quebec': 'québec',
  'quebecois': 'québécois',
  'Angstrom': 'Ångström',
  'angstrom': 'ångström',
  'skoda': 'Škoda'
};

},{}]},{},[1])(1)
});