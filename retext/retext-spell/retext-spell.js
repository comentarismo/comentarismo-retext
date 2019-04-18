(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.retextSpell = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var nspell = require('nspell');
var has = require('has');
var visit = require('unist-util-visit');
var toString = require('nlcst-to-string');
var isLiteral = require('nlcst-is-literal');
var includes = require('lodash.includes');
var quote = require('quotation');

module.exports = spell;

var source = 'retext-spell';
var digitsOnly = /^\d+$/;
var smart = /’/g;
var straight = '\'';
var max = 30;

function spell(options) {
  var queue = [];
  var settings = options || {};
  var load = options && (options.dictionary || options);
  var literal = settings.ignoreLiteral;
  var digits = settings.ignoreDigits;
  var apos = settings.normalizeApostrophes;
  var personal = settings.personal;
  var config = {};
  var loadError;

  if (typeof load !== 'function') {
    throw new Error('Expected `Object`, got `' + load + '`');
  }

  config.ignoreLiteral = literal === null || literal === undefined ? true : literal;
  config.ignoreDigits = digits === null || digits === undefined ? true : digits;
  config.normalizeApostrophes = apos === null || apos === undefined ? true : apos;
  config.ignore = settings.ignore;
  config.max = settings.max || max;
  config.count = 0;
  config.cache = {};

  load(construct);

  return transformer;

  /* Transformer which either immediatly invokes `all`
   * when everything has finished loading or queues
   * the arguments. */
  function transformer(tree, file, next) {
    if (loadError) {
      next(loadError);
    } else if (config.checker) {
      all(tree, file, config);
      next();
    } else {
      queue.push([tree, file, config, next]);
    }
  }

  /* Callback invoked when a `dictionary` is loaded
   * (possibly erroneous) or when `load`ing failed.
   * Flushes the queue when available, and sets the
   * results on the parent scope. */
  function construct(err, dictionary) {
    var length = queue.length;
    var index = -1;

    loadError = err;

    if (dictionary) {
      config.checker = nspell(dictionary);

      if (personal) {
        config.checker.personal(personal);
      }
    }

    while (++index < length) {
      if (!err) {
        all.apply(null, queue[index]);
      }

      queue[index][3](err);
    }

    queue = [];
  }
}

/* Check a file for spelling mistakes. */
function all(tree, file, config) {
  var ignore = config.ignore;
  var ignoreLiteral = config.ignoreLiteral;
  var ignoreDigits = config.ignoreDigits;
  var apos = config.normalizeApostrophes;
  var checker = config.checker;
  var cache = config.cache;

  visit(tree, 'WordNode', checkWord);

  /* Check one word. */
  function checkWord(node, position, parent) {
    var children = node.children;
    var word = toString(node);
    var correct;
    var length;
    var index;
    var child;
    var reason;
    var message;
    var suggestions;

    if (ignoreLiteral && isLiteral(parent, position)) {
      return;
    }

    if (apos) {
      word = word.replace(smart, straight);
    }

    if (irrelevant(word)) {
      return;
    }

    correct = checker.correct(word);

    if (!correct && children.length > 1) {
      correct = true;
      length = children.length;
      index = -1;

      while (++index < length) {
        child = children[index];

        if (child.type !== 'TextNode' || irrelevant(child.value)) {
          continue;
        }

        if (!checker.correct(child.value)) {
          correct = false;
        }
      }
    }

    if (!correct) {
      if (has(cache, word)) {
        reason = cache[word];
      } else {
        reason = quote(word, '`') + ' is misspelt';

        if (config.count === config.max) {
          message = file.message(
            'Too many misspellings; no further spell suggestions are given',
            node,
            'overflow'
          );

          message.source = source;
        }

        config.count++;

        if (config.count < config.max) {
          suggestions = checker.suggest(word);

          if (suggestions.length !== 0) {
            reason += '; did you mean ' + quote(suggestions, '`').join(', ') + '?';
            cache[word] = reason;
          }
        }

        cache[word] = reason;
      }

      message = file.message(reason, node, source);
      message.source = source;
      message.actual = word;
      message.expected = suggestions;
    }
  }

  /* Check if a word is irrelevant. */
  function irrelevant(word) {
    return includes(ignore, word) || (ignoreDigits && digitsOnly.test(word));
  }
}

},{"has":4,"lodash.includes":6,"nlcst-is-literal":7,"nlcst-to-string":8,"nspell":12,"quotation":27,"unist-util-visit":29}],2:[function(require,module,exports){
var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],3:[function(require,module,exports){
var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":2}],4:[function(require,module,exports){
var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":3}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object),
    nativeMax = Math.max;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }
  return isString(collection)
    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object ? baseValues(object, keys(object)) : [];
}

module.exports = includes;

},{}],7:[function(require,module,exports){
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

},{"nlcst-to-string":8}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
'use strict';

module.exports = add;

var own = {}.hasOwnProperty;

/* Add `value` to the checker. */
function add(value, model) {
  var self = this;
  var dict = self.data;

  dict[value] = [];

  if (model && own.call(dict, model) && dict[model]) {
    dict[value] = dict[model].concat();
  }

  return self;
}

},{}],10:[function(require,module,exports){
'use strict';

var trim = require('trim');
var form = require('./util/form.js');

module.exports = correct;

/* Check spelling of `value`. */
function correct(value) {
  return Boolean(form(this, trim(value)));
}

},{"./util/form.js":23,"trim":28}],11:[function(require,module,exports){
'use strict';

var parse = require('./util/dictionary.js');

module.exports = add;

/* Add a dictionary file. */
function add(buf) {
  var self = this;
  var compound = self.compoundRules;
  var compoundCodes = self.compoundRuleCodes;
  var index = -1;
  var length = compound.length;
  var rule;
  var source;
  var character;
  var offset;
  var count;

  parse(buf, self, self.data);

  /* Regenerate compound expressions. */
  while (++index < length) {
    rule = compound[index];
    source = '';

    offset = -1;
    count = rule.length;

    while (++offset < count) {
      character = rule.charAt(offset);

      if (compoundCodes[character].length === 0) {
        source += character;
      } else {
        source += '(' + compoundCodes[character].join('|') + ')';
      }
    }

    compound[index] = new RegExp(source, 'i');
  }

  return self;
}

},{"./util/dictionary.js":20}],12:[function(require,module,exports){
'use strict';

var buffer = require('is-buffer');
var affix = require('./util/affix.js');

module.exports = NSpell;

var proto = NSpell.prototype;

proto.correct = require('./correct.js');
proto.suggest = require('./suggest.js');
proto.spell = require('./spell.js');
proto.add = require('./add.js');
proto.remove = require('./remove.js');
proto.wordCharacters = require('./word-characters.js');
proto.dictionary = require('./dictionary.js');
proto.personal = require('./personal.js');

/* Construct a new spelling context. */
function NSpell(aff, dic) {
  var length;
  var index;
  var dictionaries;

  if (!(this instanceof NSpell)) {
    return new NSpell(aff, dic);
  }

  if (typeof aff === 'string' || buffer(aff)) {
    if (typeof dic === 'string' || buffer(dic)) {
      dictionaries = [{dic: dic}];
    }
  } else if (aff) {
    if ('length' in aff) {
      dictionaries = aff;
      aff = aff[0] && aff[0].aff;
    } else {
      if (aff.dic) {
        dictionaries = [aff];
      }

      aff = aff.aff;
    }
  }

  if (!aff) {
    throw new Error('Missing `aff` in dictionary');
  }

  aff = affix(aff);

  this.data = {};
  this.compoundRuleCodes = aff.compoundRuleCodes;
  this.replacementTable = aff.replacementTable;
  this.conversion = aff.conversion;
  this.compoundRules = aff.compoundRules;
  this.rules = aff.rules;
  this.flags = aff.flags;

  length = dictionaries ? dictionaries.length : 0;
  index = -1;

  while (++index < length) {
    dic = dictionaries[index];

    if (dic && dic.dic) {
      this.dictionary(dic.dic);
    }
  }
}

},{"./add.js":9,"./correct.js":10,"./dictionary.js":11,"./personal.js":13,"./remove.js":14,"./spell.js":15,"./suggest.js":16,"./util/affix.js":17,"./word-characters.js":26,"is-buffer":5}],13:[function(require,module,exports){
'use strict';

var trim = require('trim');

module.exports = add;

/* Add a dictionary. */
function add(buf) {
  var self = this;
  var flags = self.flags;
  var lines = buf.toString('utf8').split('\n');
  var length = lines.length;
  var index = -1;
  var line;
  var forbidden;
  var word;
  var model;
  var flag;

  /* Ensure there’s a key for `FORBIDDENWORD`: `false`
   * cannot be set through an affix file so its safe to use
   * as a magic constant. */
  flag = flags.FORBIDDENWORD || false;
  flags.FORBIDDENWORD = flag;

  while (++index < length) {
    line = trim(lines[index]);

    if (!line) {
      continue;
    }

    line = line.split('/');
    word = line[0];
    model = line[1];
    forbidden = word.charAt(0) === '*';

    if (forbidden) {
      word = word.slice(1);
    }

    self.add(word, model);

    if (forbidden) {
      self.data[word].push(flag);
    }
  }

  return self;
}

},{"trim":28}],14:[function(require,module,exports){
'use strict';

module.exports = remove;

/* Remove `value` from the checker. */
function remove(value) {
  var self = this;

  self.data[value] = null;

  return self;
}

},{}],15:[function(require,module,exports){
'use strict';

var form = require('./util/form.js');
var flag = require('./util/flag.js');

module.exports = spell;

/* Check spelling of `word`. */
function spell(word) {
  var self = this;
  var dict = self.data;
  var flags = self.flags;
  var value = form(self, word, true);

  /* Hunspell also provides `root` (root word of the input word),
   * and `compound` (whether `word` was compound). */
  return {
    correct: self.correct(word),
    forbidden: Boolean(value && flag(flags, 'FORBIDDENWORD', dict[value])),
    warn: Boolean(value && flag(flags, 'WARN', dict[value]))
  };
}

},{"./util/flag.js":22,"./util/form.js":23}],16:[function(require,module,exports){
'use strict';

var trim = require('trim');
var casing = require('./util/casing.js');
var normalize = require('./util/normalize.js');
var flag = require('./util/flag.js');
var form = require('./util/form.js');

module.exports = suggest;

var T_NOSUGGEST = 'NOSUGGEST';

/* Suggest spelling for `value`. */
function suggest(value) {
  var self = this;
  var replacementTable = self.replacementTable;
  var conversion = self.conversion;
  var groups = self.flags.KEY;
  var suggestions = [];
  var weighted = {};
  var memory;
  var replacement;
  var edits = [];
  var values;
  var index;
  var length;
  var offset;
  var position;
  var count;
  var otherOffset;
  var otherCount;
  var otherCharacter;
  var character;
  var group;
  var before;
  var after;
  var upper;
  var insensitive;
  var firstLevel;
  var prev;
  var next;
  var nextCharacter;
  var max;
  var distance;
  var end;
  var size;
  var normalized;
  var suggestion;
  var currentCase;

  value = normalize(trim(value), conversion.in);

  if (!value || self.correct(value)) {
    return [];
  }

  currentCase = casing(value);

  /* Check the replacement table. */
  length = replacementTable.length;
  index = -1;

  while (++index < length) {
    replacement = replacementTable[index];
    offset = value.indexOf(replacement[0]);

    while (offset !== -1) {
      edits.push(value.replace(replacement[0], replacement[1]));
      offset = value.indexOf(replacement[0], offset + 1);
    }
  }

  /* Check the keyboard. */
  length = value.length;
  index = -1;

  while (++index < length) {
    character = value.charAt(index);
    insensitive = character.toLowerCase();
    upper = insensitive !== character;
    offset = -1;
    count = groups.length;

    while (++offset < count) {
      group = groups[offset];
      position = group.indexOf(insensitive);

      if (position === -1) {
        continue;
      }

      before = value.slice(0, position);
      after = value.slice(position + 1);
      otherOffset = -1;
      otherCount = group.length;

      while (++otherOffset < otherCount) {
        if (otherOffset !== position) {
          otherCharacter = group.charAt(otherOffset);

          if (upper) {
            otherCharacter = otherCharacter.toUpperCase();
          }

          edits.push(before + otherCharacter + after);
        }
      }
    }
  }

  /* Check cases where one of a double character was
   * forgotten, or one too many were added, up to three
   * “distances”.
   * This increases the success-rate by 2% and speeds the
   * process up by 13%. */
  length = value.length;
  index = -1;
  nextCharacter = value.charAt(0);
  values = [''];
  max = 1;
  distance = 0;

  while (++index < length) {
    character = nextCharacter;
    nextCharacter = value.charAt(index + 1);
    before = value.slice(0, index);

    replacement = character === nextCharacter ? '' : character + character;
    offset = -1;
    count = values.length;

    while (++offset < count) {
      if (offset <= max) {
        values.push(values[offset] + replacement);
      }

      values[offset] += character;
    }

    if (++distance < 3) {
      max = values.length;
    }
  }

  edits = edits.concat(values);

  /* Ensure the lower-cased, capitalised, and uppercase
   * values are included. */
  values = [value];
  replacement = value.toLowerCase();

  if (value === replacement) {
    values.push(value.charAt(0).toUpperCase() + replacement.slice(1));
  } else {
    values.push(replacement);
  }

  replacement = value.toUpperCase();

  if (value !== replacement) {
    values.push(replacement);
  }

  /* Construct a memory object for `generate`. */
  memory = {
    state: {},
    weighted: weighted,
    suggestions: suggestions
  };

  firstLevel = generate(self, memory, values, edits);

  /* While there are no suggestions based on generated
   * values with an edit-distance of `1`, check the
   * generated values, `SIZE` at a time.
   * Basically, we’re generating values with an
   * edit-distance of `2`, but were doing it in small
   * batches because it’s such an expensive operation. */
  prev = 0;
  max = Math.pow(Math.max(15 - value.length, 3), 3);
  max = Math.min(firstLevel.length, max);
  end = Date.now() + Math.min(30 * value.length, 200);
  size = Math.max(Math.pow(10 - value.length, 3), 1);

  while (!suggestions.length && prev < max) {
    next = prev + size;
    generate(self, memory, firstLevel.slice(prev, next));
    prev = next;

    if (Date.now() > end) {
      break;
    }
  }

  /* Sort the suggestions based on their weight. */
  suggestions.sort(function (a, b) {
    if (weighted[a] > weighted[b]) {
      return -1;
    }

    return weighted[a] === weighted[b] ? 0 : 1;
  });

  /* Normalize the output. */
  values = [];
  normalized = [];
  index = -1;
  length = suggestions.length;

  while (++index < length) {
    suggestion = normalize(suggestions[index], conversion.out);
    suggestions[index] = suggestion;
    replacement = suggestion.toLowerCase();
    offset = normalized.indexOf(replacement);

    if (offset === -1) {
      values.push(suggestion);
      normalized.push(replacement);
    } else if (currentCase && currentCase === casing(suggestion)) {
      values[offset] = suggestion;
    }
  }

  /* BOOM! All done! */
  return values;
}

/* Get a list of values close in edit distance to `words`. */
function generate(context, memory, words, edits) {
  var characters = context.flags.TRY;
  var characterLength = characters.length;
  var data = context.data;
  var flags = context.flags;
  var result = [];
  var upper;
  var length;
  var index;
  var word;
  var position;
  var count;
  var before;
  var after;
  var nextAfter;
  var nextNextAfter;
  var character;
  var nextCharacter;
  var inject;
  var offset;

  /* Check the pre-generated edits. */
  length = edits && edits.length;
  index = -1;

  while (++index < length) {
    check(edits[index], true);
  }

  /* Iterate over given word. */
  length = words.length;
  index = -1;

  while (++index < length) {
    word = words[index];

    before = '';
    character = '';
    nextAfter = word;
    nextNextAfter = word.slice(1);
    nextCharacter = word.charAt(0);
    position = -1;
    count = word.length + 1;

    /* Iterate over every character (including the end). */
    while (++position < count) {
      before += character;
      after = nextAfter;
      nextAfter = nextNextAfter;
      nextNextAfter = nextAfter.slice(1);
      character = nextCharacter;
      nextCharacter = word.charAt(position + 1);
      upper = character.toLowerCase() !== character;

      /* Remove. */
      check(before + nextAfter);

      /* Switch. */
      if (nextAfter) {
        check(before + nextCharacter + character + nextNextAfter);
      }

      /* Iterate over all possible letters. */
      offset = -1;

      while (++offset < characterLength) {
        inject = characters[offset];

        /* Add and replace. */
        check(before + inject + after);
        check(before + inject + nextAfter);

        /* Try upper-case if the original character
         * was upper-cased. */
        if (upper) {
          inject = inject.toUpperCase();

          check(before + inject + after);
          check(before + inject + nextAfter);
        }
      }
    }
  }

  /* Return the list of generated words. */
  return result;

  /* Check and handle a generated value. */
  function check(value, double) {
    var state = memory.state[value];
    var corrected;

    if (state !== Boolean(state)) {
      result.push(value);

      corrected = form(context, value);
      state = corrected && !flag(flags, T_NOSUGGEST, data[corrected]);

      memory.state[value] = state;

      if (state) {
        memory.weighted[value] = double ? 10 : 0;
        memory.suggestions.push(value);
      }
    }

    if (state) {
      memory.weighted[value]++;
    }
  }
}

},{"./util/casing.js":19,"./util/flag.js":22,"./util/form.js":23,"./util/normalize.js":24,"trim":28}],17:[function(require,module,exports){
'use strict';

var trim = require('trim');
var parse = require('./rule-codes.js');

module.exports = affix;

/* Rule types. */
var T_ONLYINCOMPOUND = 'ONLYINCOMPOUND';
var T_COMPOUNDRULE = 'COMPOUNDRULE';
var T_COMPOUNDMIN = 'COMPOUNDMIN';
var T_WORDCHARS = 'WORDCHARS';
var T_KEEPCASE = 'KEEPCASE';
var T_NOSUGGEST = 'NOSUGGEST';
var T_ICONV = 'ICONV';
var T_OCONV = 'OCONV';
var T_FLAG = 'FLAG';
var T_PFX = 'PFX';
var T_SFX = 'SFX';
var T_REP = 'REP';
var T_TRY = 'TRY';
var T_KEY = 'KEY';

/* Constants. */
var COMBINEABLE = 'Y';
var UTF8 = 'utf8';

/* Relative frequencies of letters in the English language. */
var ALPHABET = 'etaoinshrdlcumwfgypbvkjxqz'.split('');

/* Expressions. */
var RE_WHITE_SPACE = /\s/;
var RE_INLINE_WHITE_SPACE = / +/;

/* Characters. */
var C_LINE = '\n';
var C_HASH = '#';
var C_DOLLAR = '$';
var C_CARET = '^';
var C_SLASH = '/';
var C_DOT = '.';
var C_0 = '0';

/* Defaults. */
var DEFAULT_COMPOUNDMIN = 3;

var DEFAULT_KEY = [
  'qwertzuop',
  'yxcvbnm',
  'qaw',
  'say',
  'wse',
  'dsx',
  'sy',
  'edr',
  'fdc',
  'dx',
  'rft',
  'gfv',
  'fc',
  'tgz',
  'hgb',
  'gv',
  'zhu',
  'jhn',
  'hb',
  'uji',
  'kjm',
  'jn',
  'iko',
  'lkm'
];

/* Parse an affix file. */
function affix(aff) {
  var rules = {};
  var replacementTable = [];
  var conversion = {in: [], out: []};
  var compoundRuleCodes = {};
  var lines = [];
  var flags = {};
  var compoundRules = [];
  var index;
  var length;
  var parts;
  var line;
  var ruleType;
  var entries;
  var count;
  var remove;
  var add;
  var source;
  var entry;
  var ruleLength;
  var position;
  var rule;
  var last;
  var lineEnd;
  var hashIndex;
  var value;
  var offset;
  var character;

  flags[T_KEY] = [];

  /* Process the affix buffer into a list of applicable
   * lines. */
  aff = aff.toString(UTF8);
  index = aff.indexOf(C_LINE);
  hashIndex = aff.indexOf(C_HASH);
  last = 0;

  while (index !== -1) {
    if (hashIndex < last) {
      hashIndex = aff.indexOf(C_HASH, last);
    }

    lineEnd = hashIndex !== -1 && hashIndex < index ? hashIndex : index;
    line = trim(aff.slice(last, lineEnd));

    if (line) {
      lines.push(line);
    }

    last = index + 1;
    index = aff.indexOf(C_LINE, last);
  }

  /* Process each line. */
  index = -1;
  length = lines.length;

  while (++index < length) {
    line = lines[index];
    parts = line.split(RE_WHITE_SPACE);
    ruleType = parts[0];

    if (ruleType === T_REP) {
      count = index + parseInt(parts[1], 10);

      while (++index <= count) {
        parts = lines[index].split(RE_INLINE_WHITE_SPACE);
        replacementTable.push([parts[1], parts[2]]);
      }

      index = count;
    } else if (ruleType === T_ICONV || ruleType === T_OCONV) {
      entry = conversion[ruleType === T_ICONV ? 'in' : 'out'];
      count = index + parseInt(parts[1], 10);

      while (++index <= count) {
        parts = lines[index].split(RE_INLINE_WHITE_SPACE);

        entry.push([new RegExp(parts[1], 'g'), parts[2]]);
      }

      index = count;
    } else if (ruleType === T_COMPOUNDRULE) {
      count = index + parseInt(parts[1], 10);

      while (++index <= count) {
        rule = lines[index].split(RE_INLINE_WHITE_SPACE)[1];
        ruleLength = rule.length;
        position = -1;

        compoundRules.push(rule);

        while (++position < ruleLength) {
          compoundRuleCodes[rule.charAt(position)] = [];
        }
      }

      index = count;
    } else if (ruleType === T_PFX || ruleType === T_SFX) {
      count = index + parseInt(parts[3], 10);
      entries = [];

      rule = {
        type: ruleType,
        combineable: parts[2] === COMBINEABLE,
        entries: entries
      };

      rules[parts[1]] = rule;

      while (++index <= count) {
        parts = lines[index].split(RE_INLINE_WHITE_SPACE);
        remove = parts[2];
        add = parts[3].split(C_SLASH);
        source = parts[4];

        entry = {
          add: '',
          remove: '',
          match: '',
          continuation: parse(flags, add[1])
        };

        entries.push(entry);

        if (add && add[0] !== C_0) {
          entry.add = add[0];
        }

        if (remove !== C_0) {
          entry.remove = ruleType === T_SFX ? end(remove) : remove;
        }

        if (source && source !== C_DOT) {
          entry.match = (ruleType === T_SFX ? end : start)(source);
        }
      }

      index = count;
    } else if (ruleType === T_TRY) {
      source = parts[1];
      count = source.length;
      offset = -1;
      value = [];

      while (++offset < count) {
        character = source.charAt(offset);

        if (character.toLowerCase() === character) {
          value.push(character);
        }
      }

      /* Some dictionaries may forget a character.
       * Notably the enUS forgets the j`, `x`,
       * and `y`. */
      offset = -1;
      count = ALPHABET.length;

      while (++offset < count) {
        character = ALPHABET[offset];

        if (source.indexOf(character) === -1) {
          value.push(character);
        }
      }

      flags[ruleType] = value;
    } else if (ruleType === T_KEY) {
      flags[ruleType] = flags[ruleType].concat(parts[1].split('|'));
    } else if (ruleType === T_COMPOUNDMIN) {
      flags[ruleType] = Number(parts[1]);
    } else if (ruleType === T_ONLYINCOMPOUND) {
      /* If we add this ONLYINCOMPOUND flag to
       * `compoundRuleCodes`, then `parseDic` will do
       * the work of saving the list of words that
       * are compound-only. */
      flags[ruleType] = parts[1];
      compoundRuleCodes[parts[1]] = [];
    } else if (
      ruleType === T_KEEPCASE ||
      ruleType === T_WORDCHARS ||
      ruleType === T_FLAG ||
      ruleType === T_NOSUGGEST
    ) {
      flags[ruleType] = parts[1];
    } else {
      /* Default handling. Set them for now. */
      flags[ruleType] = parts[1];
    }
  }

  /* Default for `COMPOUNDMIN` is `3`.
   * See man 4 hunspell. */
  if (isNaN(flags[T_COMPOUNDMIN])) {
    flags[T_COMPOUNDMIN] = DEFAULT_COMPOUNDMIN;
  }

  if (flags[T_KEY].length === 0) {
    flags[T_KEY] = DEFAULT_KEY;
  }

  /* istanbul ignore if - Dictionaries seem to always have this. */
  if (!flags[T_TRY]) {
    flags[T_TRY] = ALPHABET.concat();
  }

  if (!flags[T_KEEPCASE]) {
    flags[T_KEEPCASE] = false;
  }

  return {
    compoundRuleCodes: compoundRuleCodes,
    replacementTable: replacementTable,
    conversion: conversion,
    compoundRules: compoundRules,
    rules: rules,
    flags: flags
  };
}

/* Wrap the `source` of an expression-like string so that
 * it matches only at the end of a value. */
function end(source) {
  return new RegExp(source + C_DOLLAR);
}

/* Wrap the `source` of an expression-like string so that
 * it matches only at the start of a value. */
function start(source) {
  return new RegExp(C_CARET + source);
}

},{"./rule-codes.js":25,"trim":28}],18:[function(require,module,exports){
'use strict';

module.exports = apply;

/* Apply a rule. */
function apply(value, rule, rules) {
  var entries = rule.entries;
  var words = [];
  var index = -1;
  var length = entries.length;
  var entry;
  var next;
  var continuationRule;
  var continuation;
  var position;
  var count;

  while (++index < length) {
    entry = entries[index];

    if (!entry.match || value.match(entry.match)) {
      next = value;

      if (entry.remove) {
        next = next.replace(entry.remove, '');
      }

      if (rule.type === 'SFX') {
        next += entry.add;
      } else {
        next = entry.add + next;
      }

      words.push(next);

      continuation = entry.continuation;

      if (continuation && continuation.length !== 0) {
        position = -1;
        count = continuation.length;

        while (++position < count) {
          continuationRule = rules[continuation[position]];

          if (continuationRule) {
            words = words.concat(
              apply(next, continuationRule, rules)
            );
          }
        }
      }
    }
  }

  return words;
}

},{}],19:[function(require,module,exports){
'use strict';

module.exports = casing;

/* Get the casing of `value`. */
function casing(value) {
  var head = exact(value.charAt(0));
  var rest = value.slice(1);

  if (!rest) {
    return head;
  }

  rest = exact(rest);

  if (head === rest) {
    return head;
  }

  if (head === 'u' && rest === 'l') {
    return 's';
  }

  return null;
}

function exact(value) {
  if (value.toLowerCase() === value) {
    return 'l';
  }

  return value.toUpperCase() === value ? 'u' : null;
}

},{}],20:[function(require,module,exports){
'use strict';

var parseCodes = require('./rule-codes.js');
var apply = require('./apply.js');

module.exports = parse;

var own = {}.hasOwnProperty;

/* Constants. */
var UTF8 = 'utf8';
var C_LINE = '\n';
var C_SLASH = '/';
var CC_TAB = '\t'.charCodeAt(0);

/* Parse a dictionary. */
function parse(buf, options, dict) {
  var flags = options.flags;
  var rules = options.rules;
  var compoundRuleCodes = options.compoundRuleCodes;
  var index;
  var line;
  var word;
  var codes;
  var position;
  var length;
  var code;
  var rule;
  var newWords;
  var offset;
  var newWord;
  var subposition;
  var combined;
  var otherNewWords;
  var suboffset;
  var last;
  var wordCount;
  var newWordCount;
  var value;

  /* Parse as lines. */
  value = buf.toString(UTF8);
  last = value.indexOf(C_LINE) + 1;
  index = value.indexOf(C_LINE, last);

  while (index !== -1) {
    if (value.charCodeAt(last) !== CC_TAB) {
      line = value.slice(last, index);
      offset = line.indexOf(C_SLASH);

      if (offset === -1) {
        word = line;
        codes = [];
      } else {
        word = line.slice(0, offset);
        codes = parseCodes(flags, line.slice(offset + 1));
      }

      /* Compound words. */
      if (!own.call(flags, 'NEEDAFFIX') || codes.indexOf(flags.NEEDAFFIX) === -1) {
        add(word, codes);
      }

      position = -1;
      length = codes.length;

      while (++position < length) {
        code = codes[position];
        rule = rules[code];

        if (code in compoundRuleCodes) {
          compoundRuleCodes[code].push(word);
        }

        if (rule) {
          newWords = apply(word, rule, rules);
          wordCount = newWords.length;
          offset = -1;

          while (++offset < wordCount) {
            newWord = newWords[offset];

            add(newWord);

            if (!rule.combineable) {
              continue;
            }

            subposition = position;

            while (++subposition < length) {
              combined = rules[codes[subposition]];

              if (
                !combined ||
                !combined.combineable ||
                rule.type === combined.type
              ) {
                continue;
              }

              otherNewWords = apply(newWord, combined, rules);
              newWordCount = otherNewWords.length;
              suboffset = -1;

              while (++suboffset < newWordCount) {
                add(otherNewWords[suboffset]);
              }
            }
          }
        }
      }
    }

    last = index + 1;
    index = value.indexOf(C_LINE, last);
  }

  /* Add `rules` for `word` to the table. */
  function add(word, rules) {
    /* Some dictionaries will list the same word multiple times
     * with different rule sets. */
    dict[word] = ((own.call(dict, word) && dict[word]) || []).concat(rules || []);
  }
}

},{"./apply.js":18,"./rule-codes.js":25}],21:[function(require,module,exports){
'use strict';

var flag = require('./flag.js');

module.exports = exact;

var own = {}.hasOwnProperty;

/* Check spelling of `value`, exactly. */
function exact(context, value) {
  var data = context.data;
  var flags = context.flags;
  var codes = own.call(data, value) ? data[value] : null;
  var compound;
  var index;
  var length;

  if (codes) {
    return !flag(flags, 'ONLYINCOMPOUND', codes);
  }

  compound = context.compoundRules;
  length = compound.length;
  index = -1;

  /* Check if this might be a compound word. */
  if (value.length >= flags.COMPOUNDMIN) {
    while (++index < length) {
      if (value.match(compound[index])) {
        return true;
      }
    }
  }

  return false;
}

},{"./flag.js":22}],22:[function(require,module,exports){
'use strict';

module.exports = flag;

var own = {}.hasOwnProperty;

/* Check whether a word has a flag. */
function flag(values, value, flags) {
  return flags &&
    own.call(values, value) &&
    flags.indexOf(values[value]) !== -1;
}

},{}],23:[function(require,module,exports){
'use strict';

var trim = require('trim');
var exact = require('./exact.js');
var flag = require('./flag.js');

module.exports = form;

/* Find a known form of `value`. */
function form(context, value, all) {
  var dict = context.data;
  var flags = context.flags;
  var alternative;

  value = trim(value);

  if (!value) {
    return null;
  }

  if (exact(context, value)) {
    if (!all && flag(flags, 'FORBIDDENWORD', dict[value])) {
      return null;
    }

    return value;
  }

  /* Try sentence-case if the value is upper-case. */
  if (value.toUpperCase() === value) {
    alternative = value.charAt(0) + value.slice(1).toLowerCase();

    if (ignore(flags, dict[alternative], all)) {
      return null;
    }

    if (exact(context, alternative)) {
      return alternative;
    }
  }

  /* Try lower-case. */
  alternative = value.toLowerCase();

  if (alternative !== value) {
    if (ignore(flags, dict[alternative], all)) {
      return null;
    }

    if (exact(context, alternative)) {
      return alternative;
    }
  }

  return null;
}

function ignore(flags, dict, all) {
  return flag(flags, 'KEEPCASE', dict) ||
    all ||
    flag(flags, 'FORBIDDENWORD', dict);
}

},{"./exact.js":21,"./flag.js":22,"trim":28}],24:[function(require,module,exports){
'use strict';

module.exports = normalize;

/* Normalize `value` with patterns. */
function normalize(value, patterns) {
  var length = patterns.length;
  var index = -1;
  var pattern;

  while (++index < length) {
    pattern = patterns[index];
    value = value.replace(pattern[0], pattern[1]);
  }

  return value;
}

},{}],25:[function(require,module,exports){
'use strict';

module.exports = ruleCodes;

/* Parse rule codes. */
function ruleCodes(flags, value) {
  var flag = flags.FLAG;
  var result = [];
  var length;
  var index;

  if (!value) {
    return result;
  }

  if (flag === 'long') {
    index = 0;
    length = value.length;

    while (index < length) {
      result.push(value.substr(index, 2));

      index += 2;
    }

    return result;
  }

  return value.split(flag === 'num' ? ',' : '');
}

},{}],26:[function(require,module,exports){
'use strict';

module.exports = wordCharacters;

/* Get the word characters defined in affix. */
function wordCharacters() {
  return this.flags.WORDCHARS || null;
}

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],29:[function(require,module,exports){
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