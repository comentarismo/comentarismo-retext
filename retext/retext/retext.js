/*!
 * @copyright 2014 Titus Wormer
 * @license MIT
 * @module retext
 * @version 5.0.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.retext = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

},{}],2:[function(require,module,exports){
'use strict';

var unherit = require('unherit');
var Latin = require('parse-latin');

module.exports = parse;
parse.Parser = Latin;

function parse() {
  this.Parser = unherit(Latin);
}

},{"parse-latin":6,"unherit":29}],3:[function(require,module,exports){
'use strict';

module.exports = iterate;

var own = {}.hasOwnProperty;

function iterate(values, callback, context) {
  var index = -1;
  var result;

  if (!values) {
    throw new Error('Iterate requires that |this| not be ' + values);
  }

  if (!own.call(values, 'length')) {
    throw new Error('Iterate requires that |this| has a `length`');
  }

  if (typeof callback !== 'function') {
    throw new Error('`callback` must be a function');
  }

  /* The length might change, so we do not cache it. */
  while (++index < values.length) {
    /* Skip missing values. */
    if (!(index in values)) {
      continue;
    }

    result = callback.call(context, values[index], index, values);

    /* If `callback` returns a `number`, move `index` over to
     * `number`. */
    if (typeof result === 'number') {
      /* Make sure that negative numbers do not break the loop. */
      if (result < 0) {
        index = 0;
      }

      index = result - 1;
    }
  }
}

},{}],4:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],5:[function(require,module,exports){
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
'use strict';
module.exports = require('./lib/index.js');

},{"./lib/index.js":8}],7:[function(require,module,exports){
/* This module is generated by `script/build-expressions.js` */
'use strict';

module.exports = {
  affixSymbol: /^([\)\]\}\u0F3B\u0F3D\u169C\u2046\u207E\u208E\u2309\u230B\u232A\u2769\u276B\u276D\u276F\u2771\u2773\u2775\u27C6\u27E7\u27E9\u27EB\u27ED\u27EF\u2984\u2986\u2988\u298A\u298C\u298E\u2990\u2992\u2994\u2996\u2998\u29D9\u29DB\u29FD\u2E23\u2E25\u2E27\u2E29\u3009\u300B\u300D\u300F\u3011\u3015\u3017\u3019\u301B\u301E\u301F\uFD3E\uFE18\uFE36\uFE38\uFE3A\uFE3C\uFE3E\uFE40\uFE42\uFE44\uFE48\uFE5A\uFE5C\uFE5E\uFF09\uFF3D\uFF5D\uFF60\uFF63]|["'\xBB\u2019\u201D\u203A\u2E03\u2E05\u2E0A\u2E0D\u2E1D\u2E21]|[!\.\?\u2026\u203D])\1*$/,
  newLine: /^[ \t]*((\r?\n|\r)[\t ]*)+$/,
  newLineMulti: /^[ \t]*((\r?\n|\r)[\t ]*){2,}$/,
  terminalMarker: /^((?:[!\.\?\u2026\u203D])+)$/,
  wordSymbolInner: /^((?:[&'\-\.:=\?@\xAD\xB7\u2010\u2011\u2019\u2027])|(?:_)+)$/,
  numerical: /^(?:[0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]|\uD800[\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDEE1-\uDEFB\uDF20-\uDF23\uDF41\uDF4A\uDFD1-\uDFD5]|\uD801[\uDCA0-\uDCA9]|\uD802[\uDC58-\uDC5F\uDC79-\uDC7F\uDCA7-\uDCAF\uDCFB-\uDCFF\uDD16-\uDD1B\uDDBC\uDDBD\uDDC0-\uDDCF\uDDD2-\uDDFF\uDE40-\uDE47\uDE7D\uDE7E\uDE9D-\uDE9F\uDEEB-\uDEEF\uDF58-\uDF5F\uDF78-\uDF7F\uDFA9-\uDFAF]|\uD803[\uDCFA-\uDCFF\uDE60-\uDE7E]|\uD804[\uDC52-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9\uDDE1-\uDDF4\uDEF0-\uDEF9]|\uD805[\uDCD0-\uDCD9\uDE50-\uDE59\uDEC0-\uDEC9\uDF30-\uDF3B]|\uD806[\uDCE0-\uDCF2]|\uD809[\uDC00-\uDC6E]|\uD81A[\uDE60-\uDE69\uDF50-\uDF59\uDF5B-\uDF61]|\uD834[\uDF60-\uDF71]|\uD835[\uDFCE-\uDFFF]|\uD83A[\uDCC7-\uDCCF]|\uD83C[\uDD00-\uDD0C])+$/,
  digitStart: /^[0-9]/,
  lowerInitial: /^(?:[a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A]|\uD801[\uDC28-\uDC4F]|\uD803[\uDCC0-\uDCF2]|\uD806[\uDCC0-\uDCDF]|\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB])/,
  surrogates: /[\uD800-\uDFFF]/,
  punctuation: /[!"'-\),-\/:;\?\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u201F\u2022-\u2027\u2032-\u203A\u203C-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]/,
  word: /[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09F4-\u09F9\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71-\u0B77\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BF2\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C78-\u0C7E\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D75\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F33\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u17F0-\u17F9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABE\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u20D0-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u3192-\u3195\u31A0-\u31BA\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA672\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA830-\uA835\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0-\uDEFB\uDF00-\uDF23\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F-\uDE47\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE6\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDCFF\uDE60-\uDE7E]|\uD804[\uDC00-\uDC46\uDC52-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF3B]|\uD806[\uDCA0-\uDCF2\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44\uDF60-\uDF71]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/,
  whiteSpace: /[\t-\r \x85\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/
};

},{}],8:[function(require,module,exports){
'use strict';

/* Dependencies. */
var createParser = require('./parser');
var expressions = require('./expressions');

/* Expose. */
module.exports = ParseLatin;

/* == PARSE LATIN ================================================== */

/* Transform Latin-script natural language into
 * an NLCST-tree. */
function ParseLatin(doc, file) {
  var value = file || doc;

  if (!(this instanceof ParseLatin)) {
    return new ParseLatin(doc, file);
  }

  this.doc = value ? String(value) : null;
}

/* Quick access to the prototype. */
var proto = ParseLatin.prototype;

/* Default position. */
proto.position = true;

/* Create text nodes. */
proto.tokenizeSymbol = createTextFactory('Symbol');
proto.tokenizeWhiteSpace = createTextFactory('WhiteSpace');
proto.tokenizePunctuation = createTextFactory('Punctuation');
proto.tokenizeSource = createTextFactory('Source');
proto.tokenizeText = createTextFactory('Text');

/* Expose `run`. */
proto.run = run;

/* Inject `plugins` to modifiy the result of the method
 * at `key` on the operated on context. */
proto.use = useFactory(function (context, key, plugins) {
  context[key] = context[key].concat(plugins);
});

/* Inject `plugins` to modifiy the result of the method
 * at `key` on the operated on context, before any other. */
proto.useFirst = useFactory(function (context, key, plugins) {
  context[key] = plugins.concat(context[key]);
});

/* Easy access to the document parser. This additionally
 * supports retext-style invocation: where an instance is
 * created for each file, and the file is given on
 * construction. */
proto.parse = function (value) {
  return this.tokenizeRoot(value || this.doc);
};

/* Transform a `value` into a list of `NLCSTNode`s. */
proto.tokenize = function (value) {
  return tokenize(this, value);
};

/* == PARENT NODES =================================================
 *
 * All these nodes are `pluggable`: they come with a
 * `use` method which accepts a plugin
 * (`function(NLCSTNode)`). Every time one of these
 * methods are called, the plugin is invoked with the
 * node, allowing for easy modification.
 *
 * In fact, the internal transformation from `tokenize`
 * (a list of words, white space, punctuation, and
 * symbols) to `tokenizeRoot` (an NLCST tree), is also
 * implemented through this mechanism. */

/* Create a `WordNode` with its children set to a single
 * `TextNode`, its value set to the given `value`. */
pluggable(ParseLatin, 'tokenizeWord', function (value, eat) {
  var add = (eat || noopEat)('');
  var parent = {type: 'WordNode', children: []};

  this.tokenizeText(value, eat, parent);

  return add(parent);
});

/* Create a `SentenceNode` with its children set to
 * `Node`s, their values set to the tokenized given
 * `value`.
 *
 * Unless plugins add new nodes, the sentence is
 * populated by `WordNode`s, `SymbolNode`s,
 * `PunctuationNode`s, and `WhiteSpaceNode`s. */
pluggable(ParseLatin, 'tokenizeSentence', createParser({
  type: 'SentenceNode',
  tokenizer: 'tokenize'
}));

/* Create a `ParagraphNode` with its children set to
 * `Node`s, their values set to the tokenized given
 * `value`.
 *
 * Unless plugins add new nodes, the paragraph is
 * populated by `SentenceNode`s and `WhiteSpaceNode`s. */
pluggable(ParseLatin, 'tokenizeParagraph', createParser({
  type: 'ParagraphNode',
  delimiter: expressions.terminalMarker,
  delimiterType: 'PunctuationNode',
  tokenizer: 'tokenizeSentence'
}));

/* Create a `RootNode` with its children set to `Node`s,
 * their values set to the tokenized given `value`. */
pluggable(ParseLatin, 'tokenizeRoot', createParser({
  type: 'RootNode',
  delimiter: expressions.newLine,
  delimiterType: 'WhiteSpaceNode',
  tokenizer: 'tokenizeParagraph'
}));

/* == PLUGINS ====================================================== */

proto.use('tokenizeSentence', [
  require('./plugin/merge-initial-word-symbol'),
  require('./plugin/merge-final-word-symbol'),
  require('./plugin/merge-inner-word-symbol'),
  require('./plugin/merge-inner-word-slash'),
  require('./plugin/merge-initialisms'),
  require('./plugin/merge-words'),
  require('./plugin/patch-position')
]);

proto.use('tokenizeParagraph', [
  require('./plugin/merge-non-word-sentences'),
  require('./plugin/merge-affix-symbol'),
  require('./plugin/merge-initial-lower-case-letter-sentences'),
  require('./plugin/merge-initial-digit-sentences'),
  require('./plugin/merge-prefix-exceptions'),
  require('./plugin/merge-affix-exceptions'),
  require('./plugin/merge-remaining-full-stops'),
  require('./plugin/make-initial-white-space-siblings'),
  require('./plugin/make-final-white-space-siblings'),
  require('./plugin/break-implicit-sentences'),
  require('./plugin/remove-empty-nodes'),
  require('./plugin/patch-position')
]);

proto.use('tokenizeRoot', [
  require('./plugin/make-initial-white-space-siblings'),
  require('./plugin/make-final-white-space-siblings'),
  require('./plugin/remove-empty-nodes'),
  require('./plugin/patch-position')
]);

/* == TEXT NODES =================================================== */

/* Factory to create a `Text`. */
function createTextFactory(type) {
  type += 'Node';

  return createText;

  /* Construct a `Text` from a bound `type` */
  function createText(value, eat, parent) {
    if (value === null || value === undefined) {
      value = '';
    }

    return (eat || noopEat)(value)({
      type: type,
      value: String(value)
    }, parent);
  }
}

/* Run transform plug-ins for `key` on `nodes`. */
function run(key, nodes) {
  var wareKey = key + 'Plugins';
  var plugins = this[wareKey];
  var index = -1;

  if (plugins) {
    while (plugins[++index]) {
      plugins[index](nodes);
    }
  }

  return nodes;
}

/* Make a method “pluggable”. */
function pluggable(Constructor, key, callback) {
  /* Set a pluggable version of `callback`
   * on `Constructor`. */
  Constructor.prototype[key] = function () {
    return this.run(key, callback.apply(this, arguments));
  };
}

/* Factory to inject `plugins`. Takes `callback` for
 * the actual inserting. */
function useFactory(callback) {
  return use;

  /* Validate if `plugins` can be inserted. Invokes
   * the bound `callback` to do the actual inserting. */
  function use(key, plugins) {
    var self = this;
    var wareKey;

    /* Throw if the method is not pluggable. */
    if (!(key in self)) {
      throw new Error(
        'Illegal Invocation: Unsupported `key` for ' +
        '`use(key, plugins)`. Make sure `key` is a ' +
        'supported function'
      );
    }

    /* Fail silently when no plugins are given. */
    if (!plugins) {
      return;
    }

    wareKey = key + 'Plugins';

    /* Make sure `plugins` is a list. */
    if (typeof plugins === 'function') {
      plugins = [plugins];
    } else {
      plugins = plugins.concat();
    }

    /* Make sure `wareKey` exists. */
    if (!self[wareKey]) {
      self[wareKey] = [];
    }

    /* Invoke callback with the ware key and plugins. */
    callback(self, wareKey, plugins);
  }
}

/* == CLASSIFY ===================================================== */

/* Match a word character. */
var WORD = expressions.word;

/* Match a surrogate character. */
var SURROGATES = expressions.surrogates;

/* Match a punctuation character. */
var PUNCTUATION = expressions.punctuation;

/* Match a white space character. */
var WHITE_SPACE = expressions.whiteSpace;

/* Transform a `value` into a list of `NLCSTNode`s. */
function tokenize(parser, value) {
  var tokens;
  var offset;
  var line;
  var column;
  var index;
  var length;
  var character;
  var queue;
  var prev;
  var left;
  var right;
  var eater;

  if (value === null || value === undefined) {
    value = '';
  } else if (value instanceof String) {
    value = value.toString();
  }

  if (typeof value !== 'string') {
    /* Return the given nodes if this is either an
     * empty array, or an array with a node as a first
     * child. */
    if ('length' in value && (!value[0] || value[0].type)) {
      return value;
    }

    throw new Error(
      'Illegal invocation: \'' + value + '\'' +
      ' is not a valid argument for \'ParseLatin\''
    );
  }

  tokens = [];

  if (!value) {
    return tokens;
  }

  index = 0;
  offset = 0;
  line = 1;
  column = 1;

  /* Eat mechanism to use. */
  eater = parser.position ? eat : noPositionEat;

  length = value.length;
  prev = '';
  queue = '';

  while (index < length) {
    character = value.charAt(index);

    if (WHITE_SPACE.test(character)) {
      right = 'WhiteSpace';
    } else if (PUNCTUATION.test(character)) {
      right = 'Punctuation';
    } else if (WORD.test(character)) {
      right = 'Word';
    } else {
      right = 'Symbol';
    }

    tick();

    prev = character;
    character = '';
    left = right;
    right = null;

    index++;
  }

  tick();

  return tokens;

  /* Check one character. */
  function tick() {
    if (
      left === right &&
      (
        left === 'Word' ||
        left === 'WhiteSpace' ||
        character === prev ||
        SURROGATES.test(character)
      )
    ) {
      queue += character;
    } else {
      /* Flush the previous queue. */
      if (queue) {
        parser['tokenize' + left](queue, eater);
      }

      queue = character;
    }
  }

  /* Remove `subvalue` from `value`.
   * Expects `subvalue` to be at the start from
   * `value`, and applies no validation. */
  function eat(subvalue) {
    var pos = position();

    update(subvalue);

    return apply;

    /* Add the given arguments, add `position` to
     * the returned node, and return the node. */
    function apply() {
      return pos(add.apply(null, arguments));
    }
  }

  /* Remove `subvalue` from `value`. Does not patch
   * positional information. */
  function noPositionEat() {
    return apply;

    /* Add the given arguments and return the node. */
    function apply() {
      return add.apply(null, arguments);
    }
  }

  /* Add mechanism. */
  function add(node, parent) {
    if (parent) {
      parent.children.push(node);
    } else {
      tokens.push(node);
    }

    return node;
  }

  /* Mark position and patch `node.position`. */
  function position() {
    var before = now();

    /* Add the position to a node. */
    function patch(node) {
      node.position = new Position(before);

      return node;
    }

    return patch;
  }

  /* Update line and column based on `value`. */
  function update(subvalue) {
    var subvalueLength = subvalue.length;
    var character = -1;
    var lastIndex = -1;

    offset += subvalueLength;

    while (++character < subvalueLength) {
      if (subvalue.charAt(character) === '\n') {
        lastIndex = character;
        line++;
      }
    }

    if (lastIndex === -1) {
      column += subvalueLength;
    } else {
      column = subvalueLength - lastIndex;
    }
  }

  /* Store position information for a node. */
  function Position(start) {
    this.start = start;
    this.end = now();
  }

  /* Get the current position. */
  function now() {
    return {
      line: line,
      column: column,
      offset: offset
    };
  }
}

/* Add mechanism used when text-tokenisers are called
 * directly outside of the `tokenize` function. */
function noopAdd(node, parent) {
  if (parent) {
    parent.children.push(node);
  }

  return node;
}

/* Eat and add mechanism without adding positional
 * information, used when text-tokenisers are called
 * directly outside of the `tokenize` function. */
function noopEat() {
  return noopAdd;
}

},{"./expressions":7,"./parser":9,"./plugin/break-implicit-sentences":10,"./plugin/make-final-white-space-siblings":11,"./plugin/make-initial-white-space-siblings":12,"./plugin/merge-affix-exceptions":13,"./plugin/merge-affix-symbol":14,"./plugin/merge-final-word-symbol":15,"./plugin/merge-initial-digit-sentences":16,"./plugin/merge-initial-lower-case-letter-sentences":17,"./plugin/merge-initial-word-symbol":18,"./plugin/merge-initialisms":19,"./plugin/merge-inner-word-slash":20,"./plugin/merge-inner-word-symbol":21,"./plugin/merge-non-word-sentences":22,"./plugin/merge-prefix-exceptions":23,"./plugin/merge-remaining-full-stops":24,"./plugin/merge-words":25,"./plugin/patch-position":26,"./plugin/remove-empty-nodes":27}],9:[function(require,module,exports){
'use strict';

/* Dependencies. */
var tokenizer = require('./tokenizer');

/* Expose. */
module.exports = parserFactory;

/* Construct a parser based on `options`. */
function parserFactory(options) {
  var type = options.type;
  var tokenizerProperty = options.tokenizer;
  var delimiter = options.delimiter;
  var tokenize = delimiter && tokenizer(options.delimiterType, delimiter);

  return parser;

  function parser(value) {
    var children = this[tokenizerProperty](value);

    return {
      type: type,
      children: tokenize ? tokenize(children) : children
    };
  }
}

},{"./tokenizer":28}],10:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');
var modifyChildren = require('unist-util-modify-children');
var expressions = require('../expressions');

module.exports = modifyChildren(breakImplicitSentences);

/* Two or more new line characters. */
var MULTI_NEW_LINE = expressions.newLineMulti;

/* Break a sentence if a white space with more
 * than one new-line is found. */
function breakImplicitSentences(child, index, parent) {
  var children;
  var position;
  var length;
  var tail;
  var head;
  var end;
  var insertion;
  var node;

  if (child.type !== 'SentenceNode') {
    return;
  }

  children = child.children;

  /* Ignore first and last child. */
  length = children.length - 1;
  position = 0;

  while (++position < length) {
    node = children[position];

    if (
      node.type !== 'WhiteSpaceNode' ||
      !MULTI_NEW_LINE.test(toString(node))
    ) {
      continue;
    }

    child.children = children.slice(0, position);

    insertion = {
      type: 'SentenceNode',
      children: children.slice(position + 1)
    };

    tail = children[position - 1];
    head = children[position + 1];

    parent.children.splice(index + 1, 0, node, insertion);

    if (child.position && tail.position && head.position) {
      end = child.position.end;

      child.position.end = tail.position.end;

      insertion.position = {
        start: head.position.start,
        end: end
      };
    }

    return index + 1;
  }
}

},{"../expressions":7,"nlcst-to-string":5,"unist-util-modify-children":30}],11:[function(require,module,exports){
'use strict';

var modifyChildren = require('unist-util-modify-children');

module.exports = modifyChildren(makeFinalWhiteSpaceSiblings);

/* Move white space ending a paragraph up, so they are
 * the siblings of paragraphs. */
function makeFinalWhiteSpaceSiblings(child, index, parent) {
  var children = child.children;
  var prev;

  if (
    children &&
    children.length !== 0 &&
    children[children.length - 1].type === 'WhiteSpaceNode'
  ) {
    parent.children.splice(index + 1, 0, child.children.pop());
    prev = children[children.length - 1];

    if (prev && prev.position && child.position) {
      child.position.end = prev.position.end;
    }

    /* Next, iterate over the current node again. */
    return index;
  }
}

},{"unist-util-modify-children":30}],12:[function(require,module,exports){
'use strict';

var visitChildren = require('unist-util-visit-children');

module.exports = visitChildren(makeInitialWhiteSpaceSiblings);

/* Move white space starting a sentence up, so they are
 * the siblings of sentences. */
function makeInitialWhiteSpaceSiblings(child, index, parent) {
  var children = child.children;
  var next;

  if (children && children.length !== 0 && children[0].type === 'WhiteSpaceNode') {
    parent.children.splice(index, 0, children.shift());
    next = children[0];

    if (next && next.position && child.position) {
      child.position.start = next.position.start;
    }
  }
}

},{"unist-util-visit-children":31}],13:[function(require,module,exports){
'use strict';

/* Dependencies. */
var toString = require('nlcst-to-string');
var modifyChildren = require('unist-util-modify-children');

/* Expose. */
module.exports = modifyChildren(mergeAffixExceptions);

/* Merge a sentence into its previous sentence, when
 * the sentence starts with a comma. */
function mergeAffixExceptions(child, index, parent) {
  var children = child.children;
  var node;
  var position;
  var value;
  var previousChild;

  if (!children || children.length === 0 || index === 0) {
    return;
  }

  position = -1;

  while (children[++position]) {
    node = children[position];

    if (node.type === 'WordNode') {
      return;
    }

    if (node.type === 'SymbolNode' || node.type === 'PunctuationNode') {
      value = toString(node);

      if (value !== ',' && value !== ';') {
        return;
      }

      previousChild = parent.children[index - 1];

      previousChild.children = previousChild.children.concat(children);

      /* Update position. */
      if (previousChild.position && child.position) {
        previousChild.position.end = child.position.end;
      }

      parent.children.splice(index, 1);

      /* Next, iterate over the node *now* at the current
       * position. */
      return index;
    }
  }
}

},{"nlcst-to-string":5,"unist-util-modify-children":30}],14:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');
var modifyChildren = require('unist-util-modify-children');
var expressions = require('../expressions');

module.exports = modifyChildren(mergeAffixSymbol);

/* Closing or final punctuation, or terminal markers
 * that should still be included in the previous
 * sentence, even though they follow the sentence's
 * terminal marker. */
var AFFIX_SYMBOL = expressions.affixSymbol;

/* Move certain punctuation following a terminal
 * marker (thus in the next sentence) to the
 * previous sentence. */
function mergeAffixSymbol(child, index, parent) {
  var children = child.children;
  var first;
  var second;
  var prev;

  if (children && children.length !== 0 && index !== 0) {
    first = children[0];
    second = children[1];
    prev = parent.children[index - 1];

    if (
      (first.type === 'SymbolNode' || first.type === 'PunctuationNode') &&
      AFFIX_SYMBOL.test(toString(first))
    ) {
      prev.children.push(children.shift());

      /* Update position. */
      if (first.position && prev.position) {
        prev.position.end = first.position.end;
      }

      if (second && second.position && child.position) {
        child.position.start = second.position.start;
      }

      /* Next, iterate over the previous node again. */
      return index - 1;
    }
  }
}

},{"../expressions":7,"nlcst-to-string":5,"unist-util-modify-children":30}],15:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');
var modifyChildren = require('unist-util-modify-children');

module.exports = modifyChildren(mergeFinalWordSymbol);

/* Merge certain punctuation marks into their
 * preceding words. */
function mergeFinalWordSymbol(child, index, parent) {
  var children;
  var prev;
  var next;

  if (
    index !== 0 &&
    (child.type === 'SymbolNode' || child.type === 'PunctuationNode') &&
    toString(child) === '-'
  ) {
    children = parent.children;

    prev = children[index - 1];
    next = children[index + 1];

    if (
      (!next || next.type !== 'WordNode') &&
      (prev && prev.type === 'WordNode')
    ) {
      /* Remove `child` from parent. */
      children.splice(index, 1);

      /* Add the punctuation mark at the end of the
       * previous node. */
      prev.children.push(child);

      /* Update position. */
      if (prev.position && child.position) {
        prev.position.end = child.position.end;
      }

      /* Next, iterate over the node *now* at the
       * current position (which was the next node). */
      return index;
    }
  }
}

},{"nlcst-to-string":5,"unist-util-modify-children":30}],16:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');
var modifyChildren = require('unist-util-modify-children');
var expressions = require('../expressions');

module.exports = modifyChildren(mergeInitialDigitSentences);

/* Initial lowercase letter. */
var DIGIT = expressions.digitStart;

/* Merge a sentence into its previous sentence, when
 * the sentence starts with a lower case letter. */
function mergeInitialDigitSentences(child, index, parent) {
  var children = child.children;
  var siblings = parent.children;
  var prev = siblings[index - 1];
  var head = children[0];

  if (prev && head && head.type === 'WordNode' && DIGIT.test(toString(head))) {
    prev.children = prev.children.concat(children);
    siblings.splice(index, 1);

    /* Update position. */
    if (prev.position && child.position) {
      prev.position.end = child.position.end;
    }

    /* Next, iterate over the node *now* at
     * the current position. */
    return index;
  }
}

},{"../expressions":7,"nlcst-to-string":5,"unist-util-modify-children":30}],17:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');
var modifyChildren = require('unist-util-modify-children');
var expressions = require('../expressions');

module.exports = modifyChildren(mergeInitialLowerCaseLetterSentences);

/* Initial lowercase letter. */
var LOWER_INITIAL = expressions.lowerInitial;

/* Merge a sentence into its previous sentence, when
 * the sentence starts with a lower case letter. */
function mergeInitialLowerCaseLetterSentences(child, index, parent) {
  var children = child.children;
  var position;
  var node;
  var siblings;
  var prev;

  if (children && children.length !== 0 && index !== 0) {
    position = -1;

    while (children[++position]) {
      node = children[position];

      if (node.type === 'WordNode') {
        if (!LOWER_INITIAL.test(toString(node))) {
          return;
        }

        siblings = parent.children;

        prev = siblings[index - 1];

        prev.children = prev.children.concat(children);

        siblings.splice(index, 1);

        /* Update position. */
        if (prev.position && child.position) {
          prev.position.end = child.position.end;
        }

        /* Next, iterate over the node *now* at
         * the current position. */
        return index;
      }

      if (node.type === 'SymbolNode' || node.type === 'PunctuationNode') {
        return;
      }
    }
  }
}

},{"../expressions":7,"nlcst-to-string":5,"unist-util-modify-children":30}],18:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');
var modifyChildren = require('unist-util-modify-children');

module.exports = modifyChildren(mergeInitialWordSymbol);

/* Merge certain punctuation marks into their
 * following words. */
function mergeInitialWordSymbol(child, index, parent) {
  var children;
  var next;

  if (
    (child.type !== 'SymbolNode' && child.type !== 'PunctuationNode') ||
    toString(child) !== '&'
  ) {
    return;
  }

  children = parent.children;

  next = children[index + 1];

  /* If either a previous word, or no following word,
   * exists, exit early. */
  if (
    (index !== 0 && children[index - 1].type === 'WordNode') ||
    !(next && next.type === 'WordNode')
  ) {
    return;
  }

  /* Remove `child` from parent. */
  children.splice(index, 1);

  /* Add the punctuation mark at the start of the
   * next node. */
  next.children.unshift(child);

  /* Update position. */
  if (next.position && child.position) {
    next.position.start = child.position.start;
  }

  /* Next, iterate over the node at the previous
   * position, as it's now adjacent to a following
   * word. */
  return index - 1;
}

},{"nlcst-to-string":5,"unist-util-modify-children":30}],19:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');
var modifyChildren = require('unist-util-modify-children');
var expressions = require('../expressions');

module.exports = modifyChildren(mergeInitialisms);

var NUMERICAL = expressions.numerical;

/* Merge initialisms. */
function mergeInitialisms(child, index, parent) {
  var siblings;
  var prev;
  var children;
  var length;
  var position;
  var otherChild;
  var isAllDigits;
  var value;

  if (index !== 0 && toString(child) === '.') {
    siblings = parent.children;

    prev = siblings[index - 1];
    children = prev.children;

    length = children && children.length;

    if (
      prev.type === 'WordNode' &&
      length !== 1 &&
      length % 2 !== 0
    ) {
      position = length;

      isAllDigits = true;

      while (children[--position]) {
        otherChild = children[position];

        value = toString(otherChild);

        if (position % 2 === 0) {
          /* Initialisms consist of one
           * character values. */
          if (value.length > 1) {
            return;
          }

          if (!NUMERICAL.test(value)) {
            isAllDigits = false;
          }
        } else if (value !== '.') {
          if (position < length - 2) {
            break;
          } else {
            return;
          }
        }
      }

      if (!isAllDigits) {
        /* Remove `child` from parent. */
        siblings.splice(index, 1);

        /* Add child to the previous children. */
        children.push(child);

        /* Update position. */
        if (prev.position && child.position) {
          prev.position.end = child.position.end;
        }

        /* Next, iterate over the node *now* at the current
         * position. */
        return index;
      }
    }
  }
}

},{"../expressions":7,"nlcst-to-string":5,"unist-util-modify-children":30}],20:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');
var modifyChildren = require('unist-util-modify-children');

module.exports = modifyChildren(mergeInnerWordSlash);

/* Constants. */
var C_SLASH = '/';

/* Merge words joined by certain punctuation marks. */
function mergeInnerWordSlash(child, index, parent) {
  var siblings = parent.children;
  var prev;
  var next;
  var prevValue;
  var nextValue;
  var queue;
  var tail;
  var count;

  prev = siblings[index - 1];
  next = siblings[index + 1];

  if (
    prev &&
    prev.type === 'WordNode' &&
    (child.type === 'SymbolNode' || child.type === 'PunctuationNode') &&
    toString(child) === C_SLASH
  ) {
    prevValue = toString(prev);
    tail = child;
    queue = [child];
    count = 1;

    if (next && next.type === 'WordNode') {
      nextValue = toString(next);
      tail = next;
      queue = queue.concat(next.children);
      count++;
    }

    if (
      prevValue.length < 3 &&
      (!nextValue || nextValue.length < 3)
    ) {
      /* Add all found tokens to `prev`s children. */
      prev.children = prev.children.concat(queue);

      siblings.splice(index, count);

      /* Update position. */
      if (prev.position && tail.position) {
        prev.position.end = tail.position.end;
      }

      /* Next, iterate over the node *now* at the current
       * position. */
      return index;
    }
  }
}

},{"nlcst-to-string":5,"unist-util-modify-children":30}],21:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');
var modifyChildren = require('unist-util-modify-children');
var expressions = require('../expressions');

module.exports = modifyChildren(mergeInnerWordSymbol);

/* Symbols part of surrounding words. */
var INNER_WORD_SYMBOL = expressions.wordSymbolInner;

/* Merge words joined by certain punctuation marks. */
function mergeInnerWordSymbol(child, index, parent) {
  var siblings;
  var sibling;
  var prev;
  var last;
  var position;
  var tokens;
  var queue;

  if (index !== 0 && (child.type === 'SymbolNode' || child.type === 'PunctuationNode')) {
    siblings = parent.children;
    prev = siblings[index - 1];

    if (prev && prev.type === 'WordNode') {
      position = index - 1;

      tokens = [];
      queue = [];

      /* - If a token which is neither word nor
       *   inner word symbol is found, the loop
       *   is broken.
       * - If an inner word symbol is found,
       *   it's queued.
       * - If a word is found, it's queued (and
       *   the queue stored and emptied). */
      while (siblings[++position]) {
        sibling = siblings[position];

        if (sibling.type === 'WordNode') {
          tokens = tokens.concat(queue, sibling.children);

          queue = [];
        } else if (
          (
            sibling.type === 'SymbolNode' ||
            sibling.type === 'PunctuationNode'
          ) &&
          INNER_WORD_SYMBOL.test(toString(sibling))
        ) {
          queue.push(sibling);
        } else {
          break;
        }
      }

      if (tokens.length !== 0) {
        /* If there is a queue, remove its length
         * from `position`. */
        if (queue.length !== 0) {
          position -= queue.length;
        }

        /* Remove every (one or more) inner-word punctuation
         * marks and children of words. */
        siblings.splice(index, position - index);

        /* Add all found tokens to `prev`s children. */
        prev.children = prev.children.concat(tokens);

        last = tokens[tokens.length - 1];

        /* Update position. */
        if (prev.position && last.position) {
          prev.position.end = last.position.end;
        }

        /* Next, iterate over the node *now* at the current
         * position. */
        return index;
      }
    }
  }
}

},{"../expressions":7,"nlcst-to-string":5,"unist-util-modify-children":30}],22:[function(require,module,exports){
'use strict';

var modifyChildren = require('unist-util-modify-children');

module.exports = modifyChildren(mergeNonWordSentences);

/* Merge a sentence into the following sentence, when
 * the sentence does not contain word tokens. */
function mergeNonWordSentences(child, index, parent) {
  var children = child.children;
  var position = -1;
  var prev;
  var next;

  while (children[++position]) {
    if (children[position].type === 'WordNode') {
      return;
    }
  }

  prev = parent.children[index - 1];

  if (prev) {
    prev.children = prev.children.concat(children);

    /* Remove the child. */
    parent.children.splice(index, 1);

    /* Patch position. */
    if (prev.position && child.position) {
      prev.position.end = child.position.end;
    }

    /* Next, iterate over the node *now* at
     * the current position (which was the
     * next node). */
    return index;
  }

  next = parent.children[index + 1];

  if (next) {
    next.children = children.concat(next.children);

    /* Patch position. */
    if (next.position && child.position) {
      next.position.start = child.position.start;
    }

    /* Remove the child. */
    parent.children.splice(index, 1);
  }
}

},{"unist-util-modify-children":30}],23:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');
var modifyChildren = require('unist-util-modify-children');

module.exports = modifyChildren(mergePrefixExceptions);

/* Blacklist of full stop characters that should not
 * be treated as terminal sentence markers: A case-insensitive
 * abbreviation. */
var ABBREVIATION_PREFIX = new RegExp(
  '^(' +
    '[0-9]+|' +
    '[a-z]|' +

    /* Common Latin Abbreviations:
     * Based on: http://en.wikipedia.org/wiki/List_of_Latin_abbreviations
     * Where only the abbreviations written without joining full stops,
     * but with a final full stop, were extracted.
     *
     * circa, capitulus, confer, compare, centum weight, eadem, (et) alii,
     * et cetera, floruit, foliis, ibidem, idem, nemine && contradicente,
     * opere && citato, (per) cent, (per) procurationem, (pro) tempore,
     * sic erat scriptum, (et) sequentia, statim, videlicet. */
    'al|ca|cap|cca|cent|cf|cit|con|cp|cwt|ead|etc|ff|' +
    'fl|ibid|id|nem|op|pro|seq|sic|stat|tem|viz' +
  ')$'
);

/* Merge a sentence into its next sentence, when the
 * sentence ends with a certain word. */
function mergePrefixExceptions(child, index, parent) {
  var children = child.children;
  var node;
  var next;

  if (
    children &&
    children.length !== 0 &&
    index !== parent.children.length - 1
  ) {
    node = children[children.length - 1];

    if (node && toString(node) === '.') {
      node = children[children.length - 2];

      if (
        node &&
        node.type === 'WordNode' &&
        ABBREVIATION_PREFIX.test(
          toString(node).toLowerCase()
        )
      ) {
        next = parent.children[index + 1];

        child.children = children.concat(next.children);

        parent.children.splice(index + 1, 1);

        /* Update position. */
        if (next.position && child.position) {
          child.position.end = next.position.end;
        }

        /* Next, iterate over the current node again. */
        return index - 1;
      }
    }
  }
}

},{"nlcst-to-string":5,"unist-util-modify-children":30}],24:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');
var visitChildren = require('unist-util-visit-children');
var expressions = require('../expressions');

module.exports = visitChildren(mergeRemainingFullStops);

/* Blacklist of full stop characters that should not
 * be treated as terminal sentence markers: A
 * case-insensitive abbreviation. */
var TERMINAL_MARKER = expressions.terminalMarker;

/* Merge non-terminal-marker full stops into
 * the previous word (if available), or the next
 * word (if available). */
function mergeRemainingFullStops(child) {
  var children = child.children;
  var position = children.length;
  var hasFoundDelimiter = false;
  var grandchild;
  var prev;
  var next;
  var nextNext;

  while (children[--position]) {
    grandchild = children[position];

    if (grandchild.type !== 'SymbolNode' && grandchild.type !== 'PunctuationNode') {
      /* This is a sentence without terminal marker,
       * so we 'fool' the code to make it think we
       * have found one. */
      if (grandchild.type === 'WordNode') {
        hasFoundDelimiter = true;
      }

      continue;
    }

    /* Exit when this token is not a terminal marker. */
    if (!TERMINAL_MARKER.test(toString(grandchild))) {
      continue;
    }

    /* Ignore the first terminal marker found
     * (starting at the end), as it should not
     * be merged. */
    if (!hasFoundDelimiter) {
      hasFoundDelimiter = true;

      continue;
    }

    /* Only merge a single full stop. */
    if (toString(grandchild) !== '.') {
      continue;
    }

    prev = children[position - 1];
    next = children[position + 1];

    if (prev && prev.type === 'WordNode') {
      nextNext = children[position + 2];

      /* Continue when the full stop is followed by
       * a space and another full stop, such as:
       * `{.} .` */
      if (
        next &&
        nextNext &&
        next.type === 'WhiteSpaceNode' &&
        toString(nextNext) === '.'
      ) {
        continue;
      }

      /* Remove `child` from parent. */
      children.splice(position, 1);

      /* Add the punctuation mark at the end of the
       * previous node. */
      prev.children.push(grandchild);

      /* Update position. */
      if (grandchild.position && prev.position) {
        prev.position.end = grandchild.position.end;
      }

      position--;
    } else if (next && next.type === 'WordNode') {
      /* Remove `child` from parent. */
      children.splice(position, 1);

      /* Add the punctuation mark at the start of
       * the next node. */
      next.children.unshift(grandchild);

      if (grandchild.position && next.position) {
        next.position.start = grandchild.position.start;
      }
    }
  }
}

},{"../expressions":7,"nlcst-to-string":5,"unist-util-visit-children":31}],25:[function(require,module,exports){
'use strict';

var modifyChildren = require('unist-util-modify-children');

module.exports = modifyChildren(mergeFinalWordSymbol);

/* Merge multiple words. This merges the children of
 * adjacent words, something which should not occur
 * naturally by parse-latin, but might happen when
 * custom tokens were passed in. */
function mergeFinalWordSymbol(child, index, parent) {
  var siblings = parent.children;
  var next;

  if (child.type === 'WordNode') {
    next = siblings[index + 1];

    if (next && next.type === 'WordNode') {
      /* Remove `next` from parent. */
      siblings.splice(index + 1, 1);

      /* Add the punctuation mark at the end of the
       * previous node. */
      child.children = child.children.concat(next.children);

      /* Update position. */
      if (next.position && child.position) {
        child.position.end = next.position.end;
      }

      /* Next, re-iterate the current node. */
      return index;
    }
  }
}

},{"unist-util-modify-children":30}],26:[function(require,module,exports){
'use strict';

var visitChildren = require('unist-util-visit-children');

module.exports = visitChildren(patchPosition);

/* Patch the position on a parent node based on its first
 * and last child. */
function patchPosition(child, index, node) {
  var siblings = node.children;

  if (!child.position) {
    return;
  }

  if (index === 0 && (!node.position || /* istanbul ignore next */ !node.position.start)) {
    patch(node);
    node.position.start = child.position.start;
  }

  if (
    index === siblings.length - 1 &&
    (!node.position || !node.position.end)
  ) {
    patch(node);
    node.position.end = child.position.end;
  }
}

/* Add a `position` object when it does not yet exist
 * on `node`. */
function patch(node) {
  if (!node.position) {
    node.position = {};
  }
}

},{"unist-util-visit-children":31}],27:[function(require,module,exports){
'use strict';

var modifyChildren = require('unist-util-modify-children');

module.exports = modifyChildren(removeEmptyNodes);

/* Remove empty children. */
function removeEmptyNodes(child, index, parent) {
  if ('children' in child && child.children.length === 0) {
    parent.children.splice(index, 1);

    /* Next, iterate over the node *now* at
     * the current position (which was the
     * next node). */
    return index;
  }
}

},{"unist-util-modify-children":30}],28:[function(require,module,exports){
'use strict';

/* Dependencies. */
var toString = require('nlcst-to-string');

/* Expose. */
module.exports = tokenizerFactory;

/* Factory to create a tokenizer based on a given
 * `expression`. */
function tokenizerFactory(childType, expression) {
  return tokenizer;

  /* A function that splits. */
  function tokenizer(node) {
    var children = [];
    var tokens = node.children;
    var type = node.type;
    var length = tokens.length;
    var index = -1;
    var lastIndex = length - 1;
    var start = 0;
    var first;
    var last;
    var parent;

    while (++index < length) {
      if (
        index === lastIndex ||
        (
          tokens[index].type === childType &&
          expression.test(toString(tokens[index]))
        )
      ) {
        first = tokens[start];
        last = tokens[index];

        parent = {
          type: type,
          children: tokens.slice(start, index + 1)
        };

        if (first.position && last.position) {
          parent.position = {
            start: first.position.start,
            end: last.position.end
          };
        }

        children.push(parent);

        start = index + 1;
      }
    }

    return children;
  }
}

},{"nlcst-to-string":5}],29:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module unherit
 * @fileoverview Create a custom constructor which can be modified
 *   without affecting the original class.
 */

'use strict';

/* Dependencies. */
var xtend = require('xtend');
var inherits = require('inherits');

/* Expose. */
module.exports = unherit;

/**
 * Create a custom constructor which can be modified
 * without affecting the original class.
 *
 * @param {Function} Super - Super-class.
 * @return {Function} - Constructor acting like `Super`,
 *   which can be modified without affecting the original
 *   class.
 */
function unherit(Super) {
  var result;
  var key;
  var value;

  inherits(Of, Super);
  inherits(From, Of);

  /* Clone values. */
  result = Of.prototype;

  for (key in result) {
    value = result[key];

    if (value && typeof value === 'object') {
      result[key] = 'concat' in value ? value.concat() : xtend(value);
    }
  }

  return Of;

  /**
   * Constructor accepting a single argument,
   * which itself is an `arguments` object.
   */
  function From(parameters) {
    return Super.apply(this, parameters);
  }

  /**
   * Constructor accepting variadic arguments.
   */
  function Of() {
    if (!(this instanceof Of)) {
      return new From(arguments);
    }

    return Super.apply(this, arguments);
  }
}

},{"inherits":4,"xtend":32}],30:[function(require,module,exports){
'use strict';

var iterate = require('array-iterate');

module.exports = modifierFactory;

/* Turn `callback` into a child-modifier accepting a parent.
 * See `array-iterate` for more info. */
function modifierFactory(callback) {
  return iteratorFactory(wrapperFactory(callback));
}

/* Turn `callback` into a `iterator' accepting a parent. */
function iteratorFactory(callback) {
  return iterator;

  function iterator(parent) {
    var children = parent && parent.children;

    if (!children) {
      throw new Error('Missing children in `parent` for `modifier`');
    }

    return iterate(children, callback, parent);
  }
}

/* Pass the context as the third argument to `callback`. */
function wrapperFactory(callback) {
  return wrapper;

  function wrapper(value, index) {
    return callback(value, index, this);
  }
}

},{"array-iterate":3}],31:[function(require,module,exports){
'use strict';

/* Expose. */
module.exports = visitorFactory;

/* Turns `callback` into a child-visitor accepting a parent. */
function visitorFactory(callback) {
  return visitor;

  /* Visit `parent`, invoking `callback` for each child. */
  function visitor(parent) {
    var index = -1;
    var children = parent && parent.children;

    if (!children) {
      throw new Error('Missing children in `parent` for `visitor`');
    }

    while (++index in children) {
      callback(children[index], index, parent);
    }
  }
}

},{}],32:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],33:[function(require,module,exports){
'use strict';

var toString = require('nlcst-to-string');

module.exports = stringify;

function stringify() {
  this.Compiler = compiler;
}

function compiler(tree) {
  return toString(tree);
}

},{"nlcst-to-string":34}],34:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],35:[function(require,module,exports){
'use strict';

var unified = require('unified');
var latin = require('retext-latin');
var stringify = require('retext-stringify');

module.exports = unified()
  .use(latin)
  .use(stringify)
  .freeze();

},{"retext-latin":2,"retext-stringify":33,"unified":42}],36:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module bail
 * @fileoverview Throw a given error.
 */

'use strict';

/* Expose. */
module.exports = bail;

/**
 * Throw a given error.
 *
 * @example
 *   bail();
 *
 * @example
 *   bail(new Error('failure'));
 *   // Error: failure
 *   //     at repl:1:6
 *   //     at REPLServer.defaultEval (repl.js:154:27)
 *   //     ...
 *
 * @param {Error?} [err] - Optional error.
 * @throws {Error} - `err`, when given.
 */
function bail(err) {
  if (err) {
    throw err;
  }
}

},{}],37:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};

},{}],38:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],39:[function(require,module,exports){
'use strict';
var toString = Object.prototype.toString;

module.exports = function (x) {
	var prototype;
	return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
};

},{}],40:[function(require,module,exports){
'use strict';

var path = require('path');

function replaceExt(npath, ext) {
  if (typeof npath !== 'string') {
    return npath;
  }

  if (npath.length === 0) {
    return npath;
  }

  var nFileName = path.basename(npath, path.extname(npath)) + ext;
  return path.join(path.dirname(npath), nFileName);
}

module.exports = replaceExt;

},{"path":1}],41:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module trough
 * @fileoverview Middleware.  Inspired by `segmentio/ware`,
 *   but able to change the values from transformer to
 *   transformer.
 */

'use strict';

/* Expose. */
module.exports = trough;

/* Methods. */
var slice = [].slice;

/**
 * Create new middleware.
 *
 * @return {Object} - Middlewre.
 */
function trough() {
  var fns = [];
  var middleware = {};

  middleware.run = run;
  middleware.use = use;

  return middleware;

  /**
   * Run `fns`.  Last argument must be
   * a completion handler.
   *
   * @param {...*} input - Parameters
   */
  function run() {
    var index = -1;
    var input = slice.call(arguments, 0, -1);
    var done = arguments[arguments.length - 1];

    if (typeof done !== 'function') {
      throw new Error('Expected function as last argument, not ' + done);
    }

    next.apply(null, [null].concat(input));

    return;

    /**
     * Run the next `fn`, if any.
     *
     * @param {Error?} err - Failure.
     * @param {...*} values - Other input.
     */
    function next(err) {
      var fn = fns[++index];
      var params = slice.call(arguments, 0);
      var values = params.slice(1);
      var length = input.length;
      var pos = -1;

      if (err) {
        done(err);
        return;
      }

      /* Copy non-nully input into values. */
      while (++pos < length) {
        if (values[pos] === null || values[pos] === undefined) {
          values[pos] = input[pos];
        }
      }

      input = values;

      /* Next or done. */
      if (fn) {
        wrap(fn, next).apply(null, input);
      } else {
        done.apply(null, [null].concat(input));
      }
    }
  }

  /**
   * Add `fn` to the list.
   *
   * @param {Function} fn - Anything `wrap` accepts.
   */
  function use(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Expected `fn` to be a function, not ' + fn);
    }

    fns.push(fn);

    return middleware;
  }
}

/**
 * Wrap `fn`.  Can be sync or async; return a promise,
 * receive a completion handler, return new values and
 * errors.
 *
 * @param {Function} fn - Thing to wrap.
 * @param {Function} next - Completion handler.
 * @return {Function} - Wrapped `fn`.
 */
function wrap(fn, next) {
  var invoked;

  return wrapped;

  function wrapped() {
    var params = slice.call(arguments, 0);
    var callback = fn.length > params.length;
    var result;

    if (callback) {
      params.push(done);
    }

    try {
      result = fn.apply(null, params);
    } catch (err) {
      /* Well, this is quite the pickle.  `fn` received
       * a callback and invoked it (thus continuing the
       * pipeline), but later also threw an error.
       * We’re not about to restart the pipeline again,
       * so the only thing left to do is to throw the
       * thing instea. */
      if (callback && invoked) {
        throw err;
      }

      return done(err);
    }

    if (!callback) {
      if (result && typeof result.then === 'function') {
        result.then(then, done);
      } else if (result instanceof Error) {
        done(result);
      } else {
        then(result);
      }
    }
  }

  /**
   * Invoke `next`, only once.
   *
   * @param {Error?} err - Optional error.
   */
  function done() {
    if (!invoked) {
      invoked = true;

      next.apply(null, arguments);
    }
  }

  /**
   * Invoke `done` with one value.
   * Tracks if an error is passed, too.
   *
   * @param {*} value - Optional value.
   */
  function then(value) {
    done(null, value);
  }
}

},{}],42:[function(require,module,exports){
'use strict';

/* Dependencies. */
var extend = require('extend');
var bail = require('bail');
var vfile = require('vfile');
var trough = require('trough');
var string = require('x-is-string');
var func = require('x-is-function');
var plain = require('is-plain-obj');

/* Expose a frozen processor. */
module.exports = unified().freeze();

var slice = [].slice;
var own = {}.hasOwnProperty;

/* Process pipeline. */
var pipeline = trough().use(pipelineParse).use(pipelineRun).use(pipelineStringify);

function pipelineParse(p, ctx) {
  ctx.tree = p.parse(ctx.file);
}

function pipelineRun(p, ctx, next) {
  p.run(ctx.tree, ctx.file, done);

  function done(err, tree, file) {
    if (err) {
      next(err);
    } else {
      ctx.tree = tree;
      ctx.file = file;
      next();
    }
  }
}

function pipelineStringify(p, ctx) {
  ctx.file.contents = p.stringify(ctx.tree, ctx.file);
}

/* Function to create the first processor. */
function unified() {
  var attachers = [];
  var transformers = trough();
  var namespace = {};
  var frozen = false;
  var freezeIndex = -1;

  /* Data management. */
  processor.data = data;

  /* Lock. */
  processor.freeze = freeze;

  /* Plug-ins. */
  processor.attachers = attachers;
  processor.use = use;

  /* API. */
  processor.parse = parse;
  processor.stringify = stringify;
  processor.run = run;
  processor.runSync = runSync;
  processor.process = process;
  processor.processSync = processSync;

  /* Expose. */
  return processor;

  /* Create a new processor based on the processor
   * in the current scope. */
  function processor() {
    var destination = unified();
    var length = attachers.length;
    var index = -1;

    while (++index < length) {
      destination.use.apply(null, attachers[index]);
    }

    destination.data(extend(true, {}, namespace));

    return destination;
  }

  /* Freeze: used to signal a processor that has finished
   * configuration.
   *
   * For example, take unified itself.  It’s frozen.
   * Plug-ins should not be added to it.  Rather, it should
   * be extended, by invoking it, before modifying it.
   *
   * In essence, always invoke this when exporting a
   * processor. */
  function freeze() {
    var values;
    var plugin;
    var options;
    var transformer;

    if (frozen) {
      return processor;
    }

    while (++freezeIndex < attachers.length) {
      values = attachers[freezeIndex];
      plugin = values[0];
      options = values[1];
      transformer = null;

      if (options === false) {
        continue;
      }

      if (options === true) {
        values[1] = undefined;
      }

      transformer = plugin.apply(processor, values.slice(1));

      if (func(transformer)) {
        transformers.use(transformer);
      }
    }

    frozen = true;
    freezeIndex = Infinity;

    return processor;
  }

  /* Data management.
   * Getter / setter for processor-specific informtion. */
  function data(key, value) {
    if (string(key)) {
      /* Set `key`. */
      if (arguments.length === 2) {
        assertUnfrozen('data', frozen);

        namespace[key] = value;

        return processor;
      }

      /* Get `key`. */
      return (own.call(namespace, key) && namespace[key]) || null;
    }

    /* Set space. */
    if (key) {
      assertUnfrozen('data', frozen);
      namespace = key;
      return processor;
    }

    /* Get space. */
    return namespace;
  }

  /* Plug-in management.
   *
   * Pass it:
   * *   an attacher and options,
   * *   a preset,
   * *   a list of presets, attachers, and arguments (list
   *     of attachers and options). */
  function use(value) {
    var settings;

    assertUnfrozen('use', frozen);

    if (value === null || value === undefined) {
      /* Empty */
    } else if (func(value)) {
      addPlugin.apply(null, arguments);
    } else if (typeof value === 'object') {
      if ('length' in value) {
        addList(value);
      } else {
        addPreset(value);
      }
    } else {
      throw new Error('Expected usable value, not `' + value + '`');
    }

    if (settings) {
      namespace.settings = extend(namespace.settings || {}, settings);
    }

    return processor;

    function addPreset(result) {
      addList(result.plugins);

      if (result.settings) {
        settings = extend(settings || {}, result.settings);
      }
    }

    function add(value) {
      if (func(value)) {
        addPlugin(value);
      } else if (typeof value === 'object') {
        if ('length' in value) {
          addPlugin.apply(null, value);
        } else {
          addPreset(value);
        }
      } else {
        throw new Error('Expected usable value, not `' + value + '`');
      }
    }

    function addList(plugins) {
      var length;
      var index;

      if (plugins === null || plugins === undefined) {
        /* Empty */
      } else if (typeof plugins === 'object' && 'length' in plugins) {
        length = plugins.length;
        index = -1;

        while (++index < length) {
          add(plugins[index]);
        }
      } else {
        throw new Error('Expected a list of plugins, not `' + plugins + '`');
      }
    }

    function addPlugin(plugin, value) {
      var entry = find(plugin);

      if (entry) {
        if (plain(entry[1]) && plain(value)) {
          value = extend(entry[1], value);
        }

        entry[1] = value;
      } else {
        attachers.push(slice.call(arguments));
      }
    }
  }

  function find(plugin) {
    var length = attachers.length;
    var index = -1;
    var entry;

    while (++index < length) {
      entry = attachers[index];

      if (entry[0] === plugin) {
        return entry;
      }
    }
  }

  /* Parse a file (in string or VFile representation)
   * into a Unist node using the `Parser` on the
   * processor. */
  function parse(doc) {
    var file = vfile(doc);
    var Parser;

    freeze();
    Parser = processor.Parser;
    assertParser('parse', Parser);

    if (newable(Parser)) {
      return new Parser(String(file), file).parse();
    }

    return Parser(String(file), file); // eslint-disable-line new-cap
  }

  /* Run transforms on a Unist node representation of a file
   * (in string or VFile representation), async. */
  function run(node, file, cb) {
    assertNode(node);
    freeze();

    if (!cb && func(file)) {
      cb = file;
      file = null;
    }

    if (!cb) {
      return new Promise(executor);
    }

    executor(null, cb);

    function executor(resolve, reject) {
      transformers.run(node, vfile(file), done);

      function done(err, tree, file) {
        tree = tree || node;
        if (err) {
          reject(err);
        } else if (resolve) {
          resolve(tree);
        } else {
          cb(null, tree, file);
        }
      }
    }
  }

  /* Run transforms on a Unist node representation of a file
   * (in string or VFile representation), sync. */
  function runSync(node, file) {
    var complete = false;
    var result;

    run(node, file, done);

    assertDone('runSync', 'run', complete);

    return result;

    function done(err, tree) {
      complete = true;
      bail(err);
      result = tree;
    }
  }

  /* Stringify a Unist node representation of a file
   * (in string or VFile representation) into a string
   * using the `Compiler` on the processor. */
  function stringify(node, doc) {
    var file = vfile(doc);
    var Compiler;

    freeze();
    Compiler = processor.Compiler;
    assertCompiler('stringify', Compiler);
    assertNode(node);

    if (newable(Compiler)) {
      return new Compiler(node, file).compile();
    }

    return Compiler(node, file); // eslint-disable-line new-cap
  }

  /* Parse a file (in string or VFile representation)
   * into a Unist node using the `Parser` on the processor,
   * then run transforms on that node, and compile the
   * resulting node using the `Compiler` on the processor,
   * and store that result on the VFile. */
  function process(doc, cb) {
    freeze();
    assertParser('process', processor.Parser);
    assertCompiler('process', processor.Compiler);

    if (!cb) {
      return new Promise(executor);
    }

    executor(null, cb);

    function executor(resolve, reject) {
      var file = vfile(doc);

      pipeline.run(processor, {file: file}, done);

      function done(err) {
        if (err) {
          reject(err);
        } else if (resolve) {
          resolve(file);
        } else {
          cb(null, file);
        }
      }
    }
  }

  /* Process the given document (in string or VFile
   * representation), sync. */
  function processSync(doc) {
    var complete = false;
    var file;

    freeze();
    assertParser('processSync', processor.Parser);
    assertCompiler('processSync', processor.Compiler);
    file = vfile(doc);

    process(file, done);

    assertDone('processSync', 'process', complete);

    return file;

    function done(err) {
      complete = true;
      bail(err);
    }
  }
}

/* Check if `func` is a constructor. */
function newable(value) {
  return func(value) && keys(value.prototype);
}

/* Check if `value` is an object with keys. */
function keys(value) {
  var key;
  for (key in value) {
    return true;
  }
  return false;
}

/* Assert a parser is available. */
function assertParser(name, Parser) {
  if (!func(Parser)) {
    throw new Error('Cannot `' + name + '` without `Parser`');
  }
}

/* Assert a compiler is available. */
function assertCompiler(name, Compiler) {
  if (!func(Compiler)) {
    throw new Error('Cannot `' + name + '` without `Compiler`');
  }
}

/* Assert the processor is not frozen. */
function assertUnfrozen(name, frozen) {
  if (frozen) {
    throw new Error(
      'Cannot invoke `' + name + '` on a frozen processor.\n' +
      'Create a new processor first, by invoking it: ' +
      'use `processor()` instead of `processor`.'
    );
  }
}

/* Assert `node` is a Unist node. */
function assertNode(node) {
  if (!node || !string(node.type)) {
    throw new Error('Expected node, got `' + node + '`');
  }
}

/* Assert that `complete` is `true`. */
function assertDone(name, asyncName, complete) {
  if (!complete) {
    throw new Error('`' + name + '` finished async. Use `' + asyncName + '` instead');
  }
}

},{"bail":36,"extend":37,"is-plain-obj":39,"trough":41,"vfile":44,"x-is-function":45,"x-is-string":46}],43:[function(require,module,exports){
'use strict';

var own = {}.hasOwnProperty;

module.exports = stringify;

function stringify(value) {
  /* Nothing. */
  if (!value || typeof value !== 'object') {
    return null;
  }

  /* Node. */
  if (own.call(value, 'position') || own.call(value, 'type')) {
    return location(value.position);
  }

  /* Location. */
  if (own.call(value, 'start') || own.call(value, 'end')) {
    return location(value);
  }

  /* Position. */
  if (own.call(value, 'line') || own.call(value, 'column')) {
    return position(value);
  }

  /* ? */
  return null;
}

function position(pos) {
  if (!pos || typeof pos !== 'object') {
    pos = {};
  }

  return index(pos.line) + ':' + index(pos.column);
}

function location(loc) {
  if (!loc || typeof loc !== 'object') {
    loc = {};
  }

  return position(loc.start) + '-' + position(loc.end);
}

function index(value) {
  return value && typeof value === 'number' ? value : 1;
}

},{}],44:[function(require,module,exports){
'use strict';

var path = require('path');
var replace = require('replace-ext');
var stringify = require('unist-util-stringify-position');
var buffer = require('is-buffer');

module.exports = VFile;

var own = {}.hasOwnProperty;
var proto = VFile.prototype;

proto.toString = toString;
proto.message = message;
proto.fail = fail;

/* Slight backwards compatibility.  Remove in the future. */
proto.warn = message;

/* Order of setting (least specific to most), we need this because
 * otherwise `{stem: 'a', path: '~/b.js'}` would throw, as a path
 * is needed before a stem can be set. */
var order = [
  'history',
  'path',
  'basename',
  'stem',
  'extname',
  'dirname'
];

/* Construct a new file. */
function VFile(options) {
  var prop;
  var index;
  var length;

  if (!options) {
    options = {};
  } else if (typeof options === 'string' || buffer(options)) {
    options = {contents: options};
  } else if ('message' in options && 'messages' in options) {
    return options;
  }

  if (!(this instanceof VFile)) {
    return new VFile(options);
  }

  this.data = {};
  this.messages = [];
  this.history = [];
  this.cwd = process.cwd();

  /* Set path related properties in the correct order. */
  index = -1;
  length = order.length;

  while (++index < length) {
    prop = order[index];

    if (own.call(options, prop)) {
      this[prop] = options[prop];
    }
  }

  /* Set non-path related properties. */
  for (prop in options) {
    if (order.indexOf(prop) === -1) {
      this[prop] = options[prop];
    }
  }
}

/* Access full path (`~/index.min.js`). */
Object.defineProperty(proto, 'path', {
  get: function () {
    return this.history[this.history.length - 1];
  },
  set: function (path) {
    assertNonEmpty(path, 'path');

    if (path !== this.path) {
      this.history.push(path);
    }
  }
});

/* Access parent path (`~`). */
Object.defineProperty(proto, 'dirname', {
  get: function () {
    return typeof this.path === 'string' ? path.dirname(this.path) : undefined;
  },
  set: function (dirname) {
    assertPath(this.path, 'dirname');
    this.path = path.join(dirname || '', this.basename);
  }
});

/* Access basename (`index.min.js`). */
Object.defineProperty(proto, 'basename', {
  get: function () {
    return typeof this.path === 'string' ? path.basename(this.path) : undefined;
  },
  set: function (basename) {
    assertNonEmpty(basename, 'basename');
    assertPart(basename, 'basename');
    this.path = path.join(this.dirname || '', basename);
  }
});

/* Access extname (`.js`). */
Object.defineProperty(proto, 'extname', {
  get: function () {
    return typeof this.path === 'string' ? path.extname(this.path) : undefined;
  },
  set: function (extname) {
    var ext = extname || '';

    assertPart(ext, 'extname');
    assertPath(this.path, 'extname');

    if (ext) {
      if (ext.charAt(0) !== '.') {
        throw new Error('`extname` must start with `.`');
      }

      if (ext.indexOf('.', 1) !== -1) {
        throw new Error('`extname` cannot contain multiple dots');
      }
    }

    this.path = replace(this.path, ext);
  }
});

/* Access stem (`index.min`). */
Object.defineProperty(proto, 'stem', {
  get: function () {
    return typeof this.path === 'string' ? path.basename(this.path, this.extname) : undefined;
  },
  set: function (stem) {
    assertNonEmpty(stem, 'stem');
    assertPart(stem, 'stem');
    this.path = path.join(this.dirname || '', stem + (this.extname || ''));
  }
});

/* Get the value of the file. */
function toString(encoding) {
  var value = this.contents || '';
  return buffer(value) ? value.toString(encoding) : String(value);
}

/* Create a message with `reason` at `position`.
 * When an error is passed in as `reason`, copies the
 * stack.  This does not add a message to `messages`. */
function message(reason, position, ruleId) {
  var filePath = this.path;
  var range = stringify(position) || '1:1';
  var location;
  var err;

  location = {
    start: {line: null, column: null},
    end: {line: null, column: null}
  };

  if (position && position.position) {
    position = position.position;
  }

  if (position) {
    /* Location. */
    if (position.start) {
      location = position;
      position = position.start;
    } else {
      /* Position. */
      location.start = position;
    }
  }

  err = new VMessage(reason.message || reason);

  err.name = (filePath ? filePath + ':' : '') + range;
  err.file = filePath || '';
  err.reason = reason.message || reason;
  err.line = position ? position.line : null;
  err.column = position ? position.column : null;
  err.location = location;
  err.ruleId = ruleId || null;
  err.source = null;
  err.fatal = false;

  if (reason.stack) {
    err.stack = reason.stack;
  }

  this.messages.push(err);

  return err;
}

/* Fail. Creates a vmessage, associates it with the file,
 * and throws it. */
function fail() {
  var message = this.message.apply(this, arguments);

  message.fatal = true;

  throw message;
}

/* Inherit from `Error#`. */
function VMessagePrototype() {}
VMessagePrototype.prototype = Error.prototype;
VMessage.prototype = new VMessagePrototype();

/* Message properties. */
proto = VMessage.prototype;

proto.file = '';
proto.name = '';
proto.reason = '';
proto.message = '';
proto.stack = '';
proto.fatal = null;
proto.column = null;
proto.line = null;

/* Construct a new file message.
 *
 * Note: We cannot invoke `Error` on the created context,
 * as that adds readonly `line` and `column` attributes on
 * Safari 9, thus throwing and failing the data. */
function VMessage(reason) {
  this.message = reason;
}

/* Assert that `part` is not a path (i.e., does
 * not contain `path.sep`). */
function assertPart(part, name) {
  if (part.indexOf(path.sep) !== -1) {
    throw new Error('`' + name + '` cannot be a path: did not expect `' + path.sep + '`');
  }
}

/* Assert that `part` is not empty. */
function assertNonEmpty(part, name) {
  if (!part) {
    throw new Error('`' + name + '` cannot be empty');
  }
}

/* Assert `path` exists. */
function assertPath(path, name) {
  if (!path) {
    throw new Error('Setting `' + name + '` requires `path` to be set too');
  }
}

},{"is-buffer":38,"path":1,"replace-ext":40,"unist-util-stringify-position":43}],45:[function(require,module,exports){
module.exports = function isFunction (fn) {
  return Object.prototype.toString.call(fn) === '[object Function]'
}

},{}],46:[function(require,module,exports){
var toString = Object.prototype.toString

module.exports = isString

function isString(obj) {
    return toString.call(obj) === "[object String]"
}

},{}]},{},[35])(35)
});