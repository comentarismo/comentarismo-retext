(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.retextPassive = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var difference = require('lodash.difference');
var search = require('nlcst-search');
var toString = require('nlcst-to-string');
var position = require('unist-util-position');
var findBefore = require('unist-util-find-before');
var patterns = require('./list');

module.exports = passive;

var verbs = ['am', 'are', 'were', 'being', 'is', 'been', 'was', 'be'];

function passive(options) {
  var ignore = (options || {}).ignore || [];
  var list = difference(patterns, ignore);

  return transformer;

  /* Search `tree` for violations. */
  function transformer(tree, file) {
    search(tree, list, searcher);

    function searcher(match, index, parent, phrase) {
      var before = findBefore(parent, index, 'WordNode');
      var message;

      if (!before) {
        return;
      }

      before = toString(before).toLowerCase();

      if (verbs.indexOf(before) === -1) {
        return;
      }

      message = file.warn('Don’t use the passive voice', {
        start: position.start(match[0]),
        end: position.end(match[match.length - 1])
      }, phrase.replace(/\s+/g, '-').toLowerCase());

      message.source = 'retext-passive';
      message.actual = toString(match);
      message.expected = null;
    }
  }
}

},{"./list":2,"lodash.difference":3,"nlcst-search":6,"nlcst-to-string":7,"unist-util-find-before":8,"unist-util-position":10}],2:[function(require,module,exports){
module.exports=[
  "awoken",
  "awoke",
  "beaten",
  "beat",
  "begun",
  "began",
  "bent",
  "bitten",
  "bit",
  "bled",
  "blown",
  "blew",
  "broken",
  "broke",
  "brought",
  "built",
  "bought",
  "caught",
  "chosen",
  "chose",
  "dealt",
  "done",
  "did",
  "drawn",
  "drew",
  "driven",
  "drove",
  "eaten",
  "ate",
  "fed",
  "felt",
  "fought",
  "found",
  "forbidden",
  "forbade",
  "forgotten",
  "forgot",
  "forgiven",
  "forgave",
  "frozen",
  "froze",
  "gotten",
  "got",
  "given",
  "gave",
  "ground",
  "grinded",
  "hung",
  "heard",
  "hidden",
  "hid",
  "hit",
  "held",
  "hurt",
  "kept",
  "known",
  "knew",
  "laid",
  "led",
  "let",
  "lost",
  "made",
  "meant",
  "met",
  "paid",
  "proven",
  "proved",
  "put",
  "read",
  "ridden",
  "rode",
  "rung",
  "rang",
  "run",
  "ran",
  "said",
  "seen",
  "saw",
  "sold",
  "sent",
  "shaken",
  "shook",
  "shaved",
  "shot",
  "shown",
  "shut",
  "sung",
  "sunk",
  "slain",
  "slew",
  "slid",
  "spoken",
  "spoke",
  "spent",
  "spun",
  "split",
  "spread",
  "stolen",
  "stole",
  "struck",
  "swept",
  "swung",
  "taken",
  "took",
  "taught",
  "torn",
  "tore",
  "told",
  "thought",
  "thrown",
  "threw",
  "undergone",
  "underwent",
  "understood",
  "upset",
  "woken",
  "woke",
  "worn",
  "wore",
  "won",
  "withdrawn",
  "withdrew",
  "written",
  "wrote",
  "been",
  "born",
  "become",
  "beset",
  "bet",
  "bid",
  "bidden",
  "bound",
  "bred",
  "broadcast",
  "burnt",
  "burst",
  "cast",
  "clung",
  "come",
  "cost",
  "crept",
  "cut",
  "dug",
  "dived",
  "dreamt",
  "drunk",
  "fallen",
  "fit",
  "fled",
  "flung",
  "flown",
  "foregone",
  "forsaken",
  "gone",
  "grown",
  "knelt",
  "knit",
  "leapt",
  "learnt",
  "left",
  "lent",
  "lain",
  "lighted",
  "misspelt",
  "mistaken",
  "mown",
  "overcome",
  "overdone",
  "overtaken",
  "overthrown",
  "pled",
  "quit",
  "rid",
  "risen",
  "sawn",
  "sought",
  "set",
  "sewn",
  "shaven",
  "shorn",
  "shed",
  "shone",
  "shod",
  "shrunk",
  "sat",
  "slept",
  "slung",
  "slit",
  "smitten",
  "sown",
  "sped",
  "spilt",
  "spit",
  "sprung",
  "stood",
  "stuck",
  "stung",
  "stunk",
  "stridden",
  "strung",
  "striven",
  "sworn",
  "swollen",
  "swum",
  "thrived",
  "thrust",
  "trodden",
  "upheld",
  "woven",
  "wed",
  "wept",
  "wound",
  "withheld",
  "withstood",
  "wrung"
]

},{}],3:[function(require,module,exports){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

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
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
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
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order of result values is determined by the
 * order they occur in the first array.
 *
 * **Note:** Unlike `_.pullAll`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */
var difference = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
});

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
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

module.exports = difference;

},{}],4:[function(require,module,exports){
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

},{"nlcst-to-string":7}],5:[function(require,module,exports){
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

},{"nlcst-to-string":7}],6:[function(require,module,exports){
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

},{"nlcst-is-literal":4,"nlcst-normalize":5,"unist-util-visit":11}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

var is = require('unist-util-is');

module.exports = findBefore;

/* Find a node before `index` in `parent` which passes
 * `test`. */
function findBefore(parent, index, test) {
  var children;
  var child;

  if (!parent || !parent.type || !parent.children) {
    throw new Error('Expected parent node');
  }

  children = parent.children;

  if (index && index.type) {
    index = children.indexOf(index);
  }

  if (isNaN(index) || index < 0 || index === Infinity) {
    throw new Error('Expected positive finite index or child node');
  }

  /* Performance. */
  if (index > children.length) {
    index = children.length;
  }

  while (index--) {
    child = children[index];

    if (is(test, child, index, parent)) {
      return child;
    }
  }

  return null;
}

},{"unist-util-is":9}],9:[function(require,module,exports){
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

},{}]},{},[1])(1)
});