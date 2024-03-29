(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.retextEmoji = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var affixEmoticonModifier = require('nlcst-affix-emoticon-modifier');
var emoticonModifier = require('nlcst-emoticon-modifier');
var emojiModifier = require('nlcst-emoji-modifier');
var emoticons = require('emoticon');
var toString = require('nlcst-to-string');
var gemoji = require('gemoji');
var visit = require('unist-util-visit');

module.exports = emoji;

var EMOTICON_NODE = 'EmoticonNode';

/* Map of visitors. */
var fns = {
  encode: toEmoji,
  decode: toGemoji
};

var unicodes = gemoji.unicode;
var names = gemoji.name;

var shortcodes = {};

(function () {
  var key;
  var shortcode;
  var result = {};
  var length = emoticons.length;
  var index = -1;
  var count;
  var offset;
  var subset;
  var name;

  for (key in names) {
    shortcode = ':' + key + ':';
    shortcodes[shortcode] = names[key];
    shortcodes[shortcode].shortcode = shortcode;
  }

  while (++index < length) {
    name = emoticons[index].name;
    subset = emoticons[index].emoticons;
    count = subset.length;
    offset = -1;

    while (++offset < count) {
      result[subset[offset]] = names[name];
    }
  }

  emoticons = result;
})();

/* Attacher. */
function emoji(options) {
  var Parser = this.Parser;
  var proto = Parser.prototype;
  var convert = (options || {}).convert;
  var fn;

  proto.useFirst('tokenizeSentence', emoticonModifier);
  proto.useFirst('tokenizeSentence', emojiModifier);
  proto.useFirst('tokenizeParagraph', affixEmoticonModifier);

  if (convert !== null && convert !== undefined) {
    fn = fns[convert];

    if (!fn) {
      throw new TypeError(
        'Illegal invocation: `' + convert +
        '` is not a valid value for ' +
        '`options.convert` in `retext#use(emoji, options)`'
      );
    }
  }

  return transformer;

  function transformer(node) {
    visit(node, EMOTICON_NODE, visitor);
  }

  function visitor(node) {
    var data = node.data;
    var value = toString(node);
    var info;

    if (fn) {
      fn(node);
    }

    info = unicodes[value] || shortcodes[value] || emoticons[value];

    if (!data) {
      data = {};
      node.data = data;
    }

    data.names = info.names.concat();
    data.description = info.description;
    data.tags = info.tags.concat();
  }
}

/* Replace a unicode emoji with a short-code. */
function toGemoji(node) {
  var value = toString(node);
  var info = (unicodes[value] || emoticons[value] || {}).shortcode;

  if (info) {
    node.value = info;
  }
}

/* Replace a short-code with a unicode emoji. */
function toEmoji(node) {
  var value = toString(node);
  var info = (shortcodes[value] || emoticons[value] || {}).emoji;

  if (info) {
    node.value = info;
  }
}

},{"emoticon":3,"gemoji":7,"nlcst-affix-emoticon-modifier":9,"nlcst-emoji-modifier":10,"nlcst-emoticon-modifier":11,"nlcst-to-string":12,"unist-util-visit":14}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
module.exports=[
  {
    "name": "angry",
    "emoji": "😠",
    "tags": [
      "mad",
      "annoyed"
    ],
    "description": "angry face",
    "emoticons": [
      ">:(",
      ">:[",
      ">:-(",
      ">:-[",
      ">=(",
      ">=[",
      ">=-(",
      ">=-["
    ]
  },
  {
    "name": "blush",
    "emoji": "😊",
    "tags": [
      "proud"
    ],
    "description": "smiling face with smiling eyes",
    "emoticons": [
      ":\")",
      ":\"]",
      ":\"D",
      ":-\")",
      ":-\"]",
      ":-\"D",
      "=\")",
      "=\"]",
      "=\"D",
      "=-\")",
      "=-\"]",
      "=-\"D"
    ]
  },
  {
    "name": "broken_heart",
    "emoji": "💔",
    "tags": [],
    "description": "broken heart",
    "emoticons": [
      "<\\3",
      "</3"
    ]
  },
  {
    "name": "confused",
    "emoji": "😕",
    "tags": [],
    "description": "confused face",
    "emoticons": [
      ":/",
      ":\\",
      ":-/",
      ":-\\",
      "=/",
      "=\\",
      "=-/",
      "=-\\"
    ]
  },
  {
    "name": "cry",
    "emoji": "😢",
    "tags": [
      "sad",
      "tear"
    ],
    "description": "crying face",
    "emoticons": [
      ":,(",
      ":,[",
      ":,|",
      ":,-(",
      ":,-[",
      ":,-|",
      ":'(",
      ":'[",
      ":'|",
      ":'-(",
      ":'-[",
      ":'-|",
      "=,(",
      "=,[",
      "=,|",
      "=,-(",
      "=,-[",
      "=,-|",
      "='(",
      "='[",
      "='|",
      "='-(",
      "='-[",
      "='-|"
    ]
  },
  {
    "name": "frowning",
    "emoji": "😦",
    "tags": [],
    "description": "frowning face with open mouth",
    "emoticons": [
      ":(",
      ":[",
      ":-(",
      ":-[",
      "=(",
      "=[",
      "=-(",
      "=-["
    ]
  },
  {
    "name": "heart",
    "emoji": "❤️",
    "tags": [
      "love"
    ],
    "description": "heavy black heart",
    "emoticons": [
      "<3"
    ]
  },
  {
    "name": "imp",
    "emoji": "👿",
    "tags": [
      "angry",
      "devil",
      "evil",
      "horns"
    ],
    "description": "imp",
    "emoticons": [
      "]:(",
      "]:[",
      "]:-(",
      "]:-[",
      "]=(",
      "]=[",
      "]=-(",
      "]=-["
    ]
  },
  {
    "name": "innocent",
    "emoji": "😇",
    "tags": [
      "angel"
    ],
    "description": "smiling face with halo",
    "emoticons": [
      "o:)",
      "o:]",
      "o:D",
      "o:-)",
      "o:-]",
      "o:-D",
      "o=)",
      "o=]",
      "o=D",
      "o=-)",
      "o=-]",
      "o=-D",
      "O:)",
      "O:]",
      "O:D",
      "O:-)",
      "O:-]",
      "O:-D",
      "O=)",
      "O=]",
      "O=D",
      "O=-)",
      "O=-]",
      "O=-D",
      "0:)",
      "0:]",
      "0:D",
      "0:-)",
      "0:-]",
      "0:-D",
      "0=)",
      "0=]",
      "0=D",
      "0=-)",
      "0=-]",
      "0=-D"
    ]
  },
  {
    "name": "joy",
    "emoji": "😂",
    "tags": [
      "tears"
    ],
    "description": "face with tears of joy",
    "emoticons": [
      ":,)",
      ":,]",
      ":,D",
      ":,-)",
      ":,-]",
      ":,-D",
      ":')",
      ":']",
      ":'D",
      ":'-)",
      ":'-]",
      ":'-D",
      "=,)",
      "=,]",
      "=,D",
      "=,-)",
      "=,-]",
      "=,-D",
      "=')",
      "=']",
      "='D",
      "='-)",
      "='-]",
      "='-D"
    ]
  },
  {
    "name": "kissing",
    "emoji": "😗",
    "tags": [],
    "description": "kissing face",
    "emoticons": [
      ":*",
      ":-*",
      "=*",
      "=-*"
    ]
  },
  {
    "name": "laughing",
    "emoji": "😆",
    "tags": [
      "happy",
      "haha"
    ],
    "description": "smiling face with open mouth and tightly-closed eyes",
    "emoticons": [
      "x)",
      "x]",
      "xD",
      "x-)",
      "x-]",
      "x-D",
      "X)",
      "X]",
      "X-)",
      "X-]",
      "X-D"
    ]
  },
  {
    "name": "man",
    "emoji": "👨",
    "tags": [
      "mustache",
      "father",
      "dad"
    ],
    "description": "man",
    "emoticons": [
      ":3",
      ":-3",
      "=3",
      "=-3",
      ";3",
      ";-3",
      "x3",
      "x-3",
      "X3",
      "X-3"
    ]
  },
  {
    "name": "neutral_face",
    "emoji": "😐",
    "tags": [
      "meh"
    ],
    "description": "neutral face",
    "emoticons": [
      ":|",
      ":-|",
      "=|",
      "=-|"
    ]
  },
  {
    "name": "no_mouth",
    "emoji": "😶",
    "tags": [
      "mute",
      "silence"
    ],
    "description": "face without mouth",
    "emoticons": [
      ":-"
    ]
  },
  {
    "name": "open_mouth",
    "emoji": "😮",
    "tags": [
      "surprise",
      "impressed",
      "wow"
    ],
    "description": "face with open mouth",
    "emoticons": [
      ":o",
      ":O",
      ":0",
      ":-o",
      ":-O",
      ":-0",
      "=o",
      "=O",
      "=0",
      "=-o",
      "=-O",
      "=-0"
    ]
  },
  {
    "name": "rage",
    "emoji": "😡",
    "tags": [
      "angry"
    ],
    "description": "pouting face",
    "emoticons": [
      ":@",
      ":-@",
      "=@",
      "=-@"
    ]
  },
  {
    "name": "smile",
    "emoji": "😄",
    "tags": [
      "happy",
      "joy",
      "pleased"
    ],
    "description": "smiling face with open mouth and smiling eyes",
    "emoticons": [
      ":D",
      ":-D",
      "=D",
      "=-D"
    ]
  },
  {
    "name": "smiley",
    "emoji": "😃",
    "tags": [
      "happy",
      "joy",
      "haha"
    ],
    "description": "smiling face with open mouth",
    "emoticons": [
      ":)",
      ":]",
      ":-)",
      ":-]",
      "=)",
      "=]",
      "=-)",
      "=-]"
    ]
  },
  {
    "name": "smiling_imp",
    "emoji": "😈",
    "tags": [
      "devil",
      "evil",
      "horns"
    ],
    "description": "smiling face with horns",
    "emoticons": [
      "]:)",
      "]:]",
      "]:D",
      "]:-)",
      "]:-]",
      "]:-D",
      "]=)",
      "]=]",
      "]=D",
      "]=-)",
      "]=-]",
      "]=-D"
    ]
  },
  {
    "name": "sob",
    "emoji": "😭",
    "tags": [
      "sad",
      "cry",
      "bawling"
    ],
    "description": "loudly crying face",
    "emoticons": [
      ":,'(",
      ":,'[",
      ":,'-(",
      ":,'-[",
      ":',(",
      ":',[",
      ":',-(",
      ":',-[",
      "=,'(",
      "=,'[",
      "=,'-(",
      "=,'-[",
      "=',(",
      "=',[",
      "=',-(",
      "=',-["
    ]
  },
  {
    "name": "stuck_out_tongue",
    "emoji": "😛",
    "tags": [],
    "description": "face with stuck-out tongue",
    "emoticons": [
      ":p",
      ":P",
      ":d",
      ":-p",
      ":-P",
      ":-d",
      "=p",
      "=P",
      "=d",
      "=-p",
      "=-P",
      "=-d"
    ]
  },
  {
    "name": "stuck_out_tongue_closed_eyes",
    "emoji": "😝",
    "tags": [
      "prank"
    ],
    "description": "face with stuck-out tongue and tightly-closed eyes",
    "emoticons": [
      "xP",
      "x-p",
      "x-P",
      "x-d",
      "Xp",
      "Xd",
      "X-p",
      "X-P",
      "X-d"
    ]
  },
  {
    "name": "stuck_out_tongue_winking_eye",
    "emoji": "😜",
    "tags": [
      "prank",
      "silly"
    ],
    "description": "face with stuck-out tongue and winking eye",
    "emoticons": [
      ";p",
      ";P",
      ";d",
      ";-p",
      ";-P",
      ";-d"
    ]
  },
  {
    "name": "sunglasses",
    "emoji": "😎",
    "tags": [
      "cool"
    ],
    "description": "smiling face with sunglasses",
    "emoticons": [
      "8)",
      "8]",
      "8D",
      "8-)",
      "8-]",
      "8-D",
      "B)",
      "B]",
      "B-)",
      "B-]",
      "B-D"
    ]
  },
  {
    "name": "sweat",
    "emoji": "😓",
    "tags": [],
    "description": "face with cold sweat",
    "emoticons": [
      ",:(",
      ",:[",
      ",:-(",
      ",:-[",
      ",=(",
      ",=[",
      ",=-(",
      ",=-[",
      "':(",
      "':[",
      "':-(",
      "':-[",
      "'=(",
      "'=[",
      "'=-(",
      "'=-["
    ]
  },
  {
    "name": "sweat_smile",
    "emoji": "😅",
    "tags": [
      "hot"
    ],
    "description": "smiling face with open mouth and cold sweat",
    "emoticons": [
      ",:)",
      ",:]",
      ",:D",
      ",:-)",
      ",:-]",
      ",:-D",
      ",=)",
      ",=]",
      ",=D",
      ",=-)",
      ",=-]",
      ",=-D",
      "':)",
      "':]",
      "':D",
      "':-)",
      "':-]",
      "':-D",
      "'=)",
      "'=]",
      "'=D",
      "'=-)",
      "'=-]",
      "'=-D"
    ]
  },
  {
    "name": "unamused",
    "emoji": "😒",
    "tags": [
      "meh"
    ],
    "description": "unamused face",
    "emoticons": [
      ":$",
      ":s",
      ":z",
      ":S",
      ":Z",
      ":-$",
      ":-s",
      ":-z",
      ":-S",
      ":-Z",
      "=$",
      "=s",
      "=z",
      "=S",
      "=Z",
      "=-$",
      "=-s",
      "=-z",
      "=-S",
      "=-Z"
    ]
  },
  {
    "name": "wink",
    "emoji": "😉",
    "tags": [
      "flirt"
    ],
    "description": "winking face",
    "emoticons": [
      ";)",
      ";]",
      ";D",
      ";-)",
      ";-]",
      ";-D"
    ]
  }
]

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":4}],6:[function(require,module,exports){
module.exports={
  "😄": {
    "description": "smiling face with open mouth and smiling eyes",
    "names": [
      "smile"
    ],
    "tags": [
      "happy",
      "joy",
      "pleased"
    ]
  },
  "😃": {
    "description": "smiling face with open mouth",
    "names": [
      "smiley"
    ],
    "tags": [
      "happy",
      "joy",
      "haha"
    ]
  },
  "😀": {
    "description": "grinning face",
    "names": [
      "grinning"
    ],
    "tags": [
      "smile",
      "happy"
    ]
  },
  "😊": {
    "description": "smiling face with smiling eyes",
    "names": [
      "blush"
    ],
    "tags": [
      "proud"
    ]
  },
  "☺️": {
    "description": "white smiling face",
    "names": [
      "relaxed"
    ],
    "tags": [
      "blush",
      "pleased"
    ]
  },
  "😉": {
    "description": "winking face",
    "names": [
      "wink"
    ],
    "tags": [
      "flirt"
    ]
  },
  "😍": {
    "description": "smiling face with heart-shaped eyes",
    "names": [
      "heart_eyes"
    ],
    "tags": [
      "love",
      "crush"
    ]
  },
  "😘": {
    "description": "face throwing a kiss",
    "names": [
      "kissing_heart"
    ],
    "tags": [
      "flirt"
    ]
  },
  "😚": {
    "description": "kissing face with closed eyes",
    "names": [
      "kissing_closed_eyes"
    ],
    "tags": []
  },
  "😗": {
    "description": "kissing face",
    "names": [
      "kissing"
    ],
    "tags": []
  },
  "😙": {
    "description": "kissing face with smiling eyes",
    "names": [
      "kissing_smiling_eyes"
    ],
    "tags": []
  },
  "😜": {
    "description": "face with stuck-out tongue and winking eye",
    "names": [
      "stuck_out_tongue_winking_eye"
    ],
    "tags": [
      "prank",
      "silly"
    ]
  },
  "😝": {
    "description": "face with stuck-out tongue and tightly-closed eyes",
    "names": [
      "stuck_out_tongue_closed_eyes"
    ],
    "tags": [
      "prank"
    ]
  },
  "😛": {
    "description": "face with stuck-out tongue",
    "names": [
      "stuck_out_tongue"
    ],
    "tags": []
  },
  "😳": {
    "description": "flushed face",
    "names": [
      "flushed"
    ],
    "tags": []
  },
  "😁": {
    "description": "grinning face with smiling eyes",
    "names": [
      "grin"
    ],
    "tags": []
  },
  "😔": {
    "description": "pensive face",
    "names": [
      "pensive"
    ],
    "tags": []
  },
  "😌": {
    "description": "relieved face",
    "names": [
      "relieved"
    ],
    "tags": [
      "whew"
    ]
  },
  "😒": {
    "description": "unamused face",
    "names": [
      "unamused"
    ],
    "tags": [
      "meh"
    ]
  },
  "😞": {
    "description": "disappointed face",
    "names": [
      "disappointed"
    ],
    "tags": [
      "sad"
    ]
  },
  "😣": {
    "description": "persevering face",
    "names": [
      "persevere"
    ],
    "tags": [
      "struggling"
    ]
  },
  "😢": {
    "description": "crying face",
    "names": [
      "cry"
    ],
    "tags": [
      "sad",
      "tear"
    ]
  },
  "😂": {
    "description": "face with tears of joy",
    "names": [
      "joy"
    ],
    "tags": [
      "tears"
    ]
  },
  "😭": {
    "description": "loudly crying face",
    "names": [
      "sob"
    ],
    "tags": [
      "sad",
      "cry",
      "bawling"
    ]
  },
  "😪": {
    "description": "sleepy face",
    "names": [
      "sleepy"
    ],
    "tags": [
      "tired"
    ]
  },
  "😥": {
    "description": "disappointed but relieved face",
    "names": [
      "disappointed_relieved"
    ],
    "tags": [
      "phew",
      "sweat",
      "nervous"
    ]
  },
  "😰": {
    "description": "face with open mouth and cold sweat",
    "names": [
      "cold_sweat"
    ],
    "tags": [
      "nervous"
    ]
  },
  "😅": {
    "description": "smiling face with open mouth and cold sweat",
    "names": [
      "sweat_smile"
    ],
    "tags": [
      "hot"
    ]
  },
  "😓": {
    "description": "face with cold sweat",
    "names": [
      "sweat"
    ],
    "tags": []
  },
  "😩": {
    "description": "weary face",
    "names": [
      "weary"
    ],
    "tags": [
      "tired"
    ]
  },
  "😫": {
    "description": "tired face",
    "names": [
      "tired_face"
    ],
    "tags": [
      "upset",
      "whine"
    ]
  },
  "😨": {
    "description": "fearful face",
    "names": [
      "fearful"
    ],
    "tags": [
      "scared",
      "shocked",
      "oops"
    ]
  },
  "😱": {
    "description": "face screaming in fear",
    "names": [
      "scream"
    ],
    "tags": [
      "horror",
      "shocked"
    ]
  },
  "😠": {
    "description": "angry face",
    "names": [
      "angry"
    ],
    "tags": [
      "mad",
      "annoyed"
    ]
  },
  "😡": {
    "description": "pouting face",
    "names": [
      "rage",
      "pout"
    ],
    "tags": [
      "angry"
    ]
  },
  "😤": {
    "description": "face with look of triumph",
    "names": [
      "triumph"
    ],
    "tags": [
      "smug"
    ]
  },
  "😖": {
    "description": "confounded face",
    "names": [
      "confounded"
    ],
    "tags": []
  },
  "😆": {
    "description": "smiling face with open mouth and tightly-closed eyes",
    "names": [
      "laughing",
      "satisfied"
    ],
    "tags": [
      "happy",
      "haha"
    ]
  },
  "😋": {
    "description": "face savouring delicious food",
    "names": [
      "yum"
    ],
    "tags": [
      "tongue",
      "lick"
    ]
  },
  "😷": {
    "description": "face with medical mask",
    "names": [
      "mask"
    ],
    "tags": [
      "sick",
      "ill"
    ]
  },
  "😎": {
    "description": "smiling face with sunglasses",
    "names": [
      "sunglasses"
    ],
    "tags": [
      "cool"
    ]
  },
  "😴": {
    "description": "sleeping face",
    "names": [
      "sleeping"
    ],
    "tags": [
      "zzz"
    ]
  },
  "😵": {
    "description": "dizzy face",
    "names": [
      "dizzy_face"
    ],
    "tags": []
  },
  "😲": {
    "description": "astonished face",
    "names": [
      "astonished"
    ],
    "tags": [
      "amazed",
      "gasp"
    ]
  },
  "😟": {
    "description": "worried face",
    "names": [
      "worried"
    ],
    "tags": [
      "nervous"
    ]
  },
  "😦": {
    "description": "frowning face with open mouth",
    "names": [
      "frowning"
    ],
    "tags": []
  },
  "😧": {
    "description": "anguished face",
    "names": [
      "anguished"
    ],
    "tags": [
      "stunned"
    ]
  },
  "😈": {
    "description": "smiling face with horns",
    "names": [
      "smiling_imp"
    ],
    "tags": [
      "devil",
      "evil",
      "horns"
    ]
  },
  "👿": {
    "description": "imp",
    "names": [
      "imp"
    ],
    "tags": [
      "angry",
      "devil",
      "evil",
      "horns"
    ]
  },
  "😮": {
    "description": "face with open mouth",
    "names": [
      "open_mouth"
    ],
    "tags": [
      "surprise",
      "impressed",
      "wow"
    ]
  },
  "😬": {
    "description": "grimacing face",
    "names": [
      "grimacing"
    ],
    "tags": []
  },
  "😐": {
    "description": "neutral face",
    "names": [
      "neutral_face"
    ],
    "tags": [
      "meh"
    ]
  },
  "😕": {
    "description": "confused face",
    "names": [
      "confused"
    ],
    "tags": []
  },
  "😯": {
    "description": "hushed face",
    "names": [
      "hushed"
    ],
    "tags": [
      "silence",
      "speechless"
    ]
  },
  "😶": {
    "description": "face without mouth",
    "names": [
      "no_mouth"
    ],
    "tags": [
      "mute",
      "silence"
    ]
  },
  "😇": {
    "description": "smiling face with halo",
    "names": [
      "innocent"
    ],
    "tags": [
      "angel"
    ]
  },
  "😏": {
    "description": "smirking face",
    "names": [
      "smirk"
    ],
    "tags": [
      "smug"
    ]
  },
  "😑": {
    "description": "expressionless face",
    "names": [
      "expressionless"
    ],
    "tags": []
  },
  "👲": {
    "description": "man with gua pi mao",
    "names": [
      "man_with_gua_pi_mao"
    ],
    "tags": []
  },
  "👳": {
    "description": "man with turban",
    "names": [
      "man_with_turban"
    ],
    "tags": []
  },
  "👮": {
    "description": "police officer",
    "names": [
      "cop"
    ],
    "tags": [
      "police",
      "law"
    ]
  },
  "👷": {
    "description": "construction worker",
    "names": [
      "construction_worker"
    ],
    "tags": [
      "helmet"
    ]
  },
  "💂": {
    "description": "guardsman",
    "names": [
      "guardsman"
    ],
    "tags": []
  },
  "👶": {
    "description": "baby",
    "names": [
      "baby"
    ],
    "tags": [
      "child",
      "newborn"
    ]
  },
  "👦": {
    "description": "boy",
    "names": [
      "boy"
    ],
    "tags": [
      "child"
    ]
  },
  "👧": {
    "description": "girl",
    "names": [
      "girl"
    ],
    "tags": [
      "child"
    ]
  },
  "👨": {
    "description": "man",
    "names": [
      "man"
    ],
    "tags": [
      "mustache",
      "father",
      "dad"
    ]
  },
  "👩": {
    "description": "woman",
    "names": [
      "woman"
    ],
    "tags": [
      "girls"
    ]
  },
  "👴": {
    "description": "older man",
    "names": [
      "older_man"
    ],
    "tags": []
  },
  "👵": {
    "description": "older woman",
    "names": [
      "older_woman"
    ],
    "tags": []
  },
  "👱": {
    "description": "person with blond hair",
    "names": [
      "person_with_blond_hair"
    ],
    "tags": [
      "boy"
    ]
  },
  "👼": {
    "description": "baby angel",
    "names": [
      "angel"
    ],
    "tags": []
  },
  "👸": {
    "description": "princess",
    "names": [
      "princess"
    ],
    "tags": [
      "blonde",
      "crown",
      "royal"
    ]
  },
  "😺": {
    "description": "smiling cat face with open mouth",
    "names": [
      "smiley_cat"
    ],
    "tags": []
  },
  "😸": {
    "description": "grinning cat face with smiling eyes",
    "names": [
      "smile_cat"
    ],
    "tags": []
  },
  "😻": {
    "description": "smiling cat face with heart-shaped eyes",
    "names": [
      "heart_eyes_cat"
    ],
    "tags": []
  },
  "😽": {
    "description": "kissing cat face with closed eyes",
    "names": [
      "kissing_cat"
    ],
    "tags": []
  },
  "😼": {
    "description": "cat face with wry smile",
    "names": [
      "smirk_cat"
    ],
    "tags": []
  },
  "🙀": {
    "description": "weary cat face",
    "names": [
      "scream_cat"
    ],
    "tags": [
      "horror"
    ]
  },
  "😿": {
    "description": "crying cat face",
    "names": [
      "crying_cat_face"
    ],
    "tags": [
      "sad",
      "tear"
    ]
  },
  "😹": {
    "description": "cat face with tears of joy",
    "names": [
      "joy_cat"
    ],
    "tags": []
  },
  "😾": {
    "description": "pouting cat face",
    "names": [
      "pouting_cat"
    ],
    "tags": []
  },
  "👹": {
    "description": "japanese ogre",
    "names": [
      "japanese_ogre"
    ],
    "tags": [
      "monster"
    ]
  },
  "👺": {
    "description": "japanese goblin",
    "names": [
      "japanese_goblin"
    ],
    "tags": []
  },
  "🙈": {
    "description": "see-no-evil monkey",
    "names": [
      "see_no_evil"
    ],
    "tags": [
      "monkey",
      "blind",
      "ignore"
    ]
  },
  "🙉": {
    "description": "hear-no-evil monkey",
    "names": [
      "hear_no_evil"
    ],
    "tags": [
      "monkey",
      "deaf"
    ]
  },
  "🙊": {
    "description": "speak-no-evil monkey",
    "names": [
      "speak_no_evil"
    ],
    "tags": [
      "monkey",
      "mute",
      "hush"
    ]
  },
  "💀": {
    "description": "skull",
    "names": [
      "skull"
    ],
    "tags": [
      "dead",
      "danger",
      "poison"
    ]
  },
  "👽": {
    "description": "extraterrestrial alien",
    "names": [
      "alien"
    ],
    "tags": [
      "ufo"
    ]
  },
  "💩": {
    "description": "pile of poo",
    "names": [
      "hankey",
      "poop",
      "shit"
    ],
    "tags": [
      "crap"
    ]
  },
  "🔥": {
    "description": "fire",
    "names": [
      "fire"
    ],
    "tags": [
      "burn"
    ]
  },
  "✨": {
    "description": "sparkles",
    "names": [
      "sparkles"
    ],
    "tags": [
      "shiny"
    ]
  },
  "🌟": {
    "description": "glowing star",
    "names": [
      "star2"
    ],
    "tags": []
  },
  "💫": {
    "description": "dizzy symbol",
    "names": [
      "dizzy"
    ],
    "tags": [
      "star"
    ]
  },
  "💥": {
    "description": "collision symbol",
    "names": [
      "boom",
      "collision"
    ],
    "tags": [
      "explode"
    ]
  },
  "💢": {
    "description": "anger symbol",
    "names": [
      "anger"
    ],
    "tags": [
      "angry"
    ]
  },
  "💦": {
    "description": "splashing sweat symbol",
    "names": [
      "sweat_drops"
    ],
    "tags": [
      "water",
      "workout"
    ]
  },
  "💧": {
    "description": "droplet",
    "names": [
      "droplet"
    ],
    "tags": [
      "water"
    ]
  },
  "💤": {
    "description": "sleeping symbol",
    "names": [
      "zzz"
    ],
    "tags": [
      "sleeping"
    ]
  },
  "💨": {
    "description": "dash symbol",
    "names": [
      "dash"
    ],
    "tags": [
      "wind",
      "blow",
      "fast"
    ]
  },
  "👂": {
    "description": "ear",
    "names": [
      "ear"
    ],
    "tags": [
      "hear",
      "sound",
      "listen"
    ]
  },
  "👀": {
    "description": "eyes",
    "names": [
      "eyes"
    ],
    "tags": [
      "look",
      "see",
      "watch"
    ]
  },
  "👃": {
    "description": "nose",
    "names": [
      "nose"
    ],
    "tags": [
      "smell"
    ]
  },
  "👅": {
    "description": "tongue",
    "names": [
      "tongue"
    ],
    "tags": [
      "taste"
    ]
  },
  "👄": {
    "description": "mouth",
    "names": [
      "lips"
    ],
    "tags": [
      "kiss"
    ]
  },
  "👍": {
    "description": "thumbs up sign",
    "names": [
      "+1",
      "thumbsup"
    ],
    "tags": [
      "approve",
      "ok"
    ]
  },
  "👎": {
    "description": "thumbs down sign",
    "names": [
      "-1",
      "thumbsdown"
    ],
    "tags": [
      "disapprove",
      "bury"
    ]
  },
  "👌": {
    "description": "ok hand sign",
    "names": [
      "ok_hand"
    ],
    "tags": []
  },
  "👊": {
    "description": "fisted hand sign",
    "names": [
      "facepunch",
      "punch"
    ],
    "tags": [
      "attack"
    ]
  },
  "✊": {
    "description": "raised fist",
    "names": [
      "fist"
    ],
    "tags": [
      "power"
    ]
  },
  "✌️": {
    "description": "victory hand",
    "names": [
      "v"
    ],
    "tags": [
      "victory",
      "peace"
    ]
  },
  "👋": {
    "description": "waving hand sign",
    "names": [
      "wave"
    ],
    "tags": [
      "goodbye"
    ]
  },
  "✋": {
    "description": "raised hand",
    "names": [
      "hand",
      "raised_hand"
    ],
    "tags": [
      "highfive",
      "stop"
    ]
  },
  "👐": {
    "description": "open hands sign",
    "names": [
      "open_hands"
    ],
    "tags": []
  },
  "👆": {
    "description": "white up pointing backhand index",
    "names": [
      "point_up_2"
    ],
    "tags": []
  },
  "👇": {
    "description": "white down pointing backhand index",
    "names": [
      "point_down"
    ],
    "tags": []
  },
  "👉": {
    "description": "white right pointing backhand index",
    "names": [
      "point_right"
    ],
    "tags": []
  },
  "👈": {
    "description": "white left pointing backhand index",
    "names": [
      "point_left"
    ],
    "tags": []
  },
  "🙌": {
    "description": "person raising both hands in celebration",
    "names": [
      "raised_hands"
    ],
    "tags": [
      "hooray"
    ]
  },
  "🙏": {
    "description": "person with folded hands",
    "names": [
      "pray"
    ],
    "tags": [
      "please",
      "hope",
      "wish"
    ]
  },
  "☝️": {
    "description": "white up pointing index",
    "names": [
      "point_up"
    ],
    "tags": []
  },
  "👏": {
    "description": "clapping hands sign",
    "names": [
      "clap"
    ],
    "tags": [
      "praise",
      "applause"
    ]
  },
  "💪": {
    "description": "flexed biceps",
    "names": [
      "muscle"
    ],
    "tags": [
      "flex",
      "bicep",
      "strong",
      "workout"
    ]
  },
  "🚶": {
    "description": "pedestrian",
    "names": [
      "walking"
    ],
    "tags": []
  },
  "🏃": {
    "description": "runner",
    "names": [
      "runner",
      "running"
    ],
    "tags": [
      "exercise",
      "workout",
      "marathon"
    ]
  },
  "💃": {
    "description": "dancer",
    "names": [
      "dancer"
    ],
    "tags": [
      "dress"
    ]
  },
  "👫": {
    "description": "man and woman holding hands",
    "names": [
      "couple"
    ],
    "tags": [
      "date"
    ]
  },
  "👪": {
    "description": "family",
    "names": [
      "family"
    ],
    "tags": [
      "home",
      "parents",
      "child"
    ]
  },
  "👬": {
    "description": "two men holding hands",
    "names": [
      "two_men_holding_hands"
    ],
    "tags": [
      "couple",
      "date"
    ]
  },
  "👭": {
    "description": "two women holding hands",
    "names": [
      "two_women_holding_hands"
    ],
    "tags": [
      "couple",
      "date"
    ]
  },
  "💏": {
    "description": "kiss",
    "names": [
      "couplekiss"
    ],
    "tags": []
  },
  "💑": {
    "description": "couple with heart",
    "names": [
      "couple_with_heart"
    ],
    "tags": []
  },
  "👯": {
    "description": "woman with bunny ears",
    "names": [
      "dancers"
    ],
    "tags": [
      "bunny"
    ]
  },
  "🙆": {
    "description": "face with ok gesture",
    "names": [
      "ok_woman"
    ],
    "tags": []
  },
  "🙅": {
    "description": "face with no good gesture",
    "names": [
      "no_good",
      "ng_woman"
    ],
    "tags": [
      "stop",
      "halt"
    ]
  },
  "💁": {
    "description": "information desk person",
    "names": [
      "information_desk_person"
    ],
    "tags": []
  },
  "🙋": {
    "description": "happy person raising one hand",
    "names": [
      "raising_hand"
    ],
    "tags": []
  },
  "💆": {
    "description": "face massage",
    "names": [
      "massage"
    ],
    "tags": [
      "spa"
    ]
  },
  "💇": {
    "description": "haircut",
    "names": [
      "haircut"
    ],
    "tags": [
      "beauty"
    ]
  },
  "💅": {
    "description": "nail polish",
    "names": [
      "nail_care"
    ],
    "tags": [
      "beauty",
      "manicure"
    ]
  },
  "👰": {
    "description": "bride with veil",
    "names": [
      "bride_with_veil"
    ],
    "tags": [
      "marriage",
      "wedding"
    ]
  },
  "🙎": {
    "description": "person with pouting face",
    "names": [
      "person_with_pouting_face"
    ],
    "tags": []
  },
  "🙍": {
    "description": "person frowning",
    "names": [
      "person_frowning"
    ],
    "tags": [
      "sad"
    ]
  },
  "🙇": {
    "description": "person bowing deeply",
    "names": [
      "bow"
    ],
    "tags": [
      "respect",
      "thanks"
    ]
  },
  "🎩": {
    "description": "top hat",
    "names": [
      "tophat"
    ],
    "tags": [
      "hat",
      "classy"
    ]
  },
  "👑": {
    "description": "crown",
    "names": [
      "crown"
    ],
    "tags": [
      "king",
      "queen",
      "royal"
    ]
  },
  "👒": {
    "description": "womans hat",
    "names": [
      "womans_hat"
    ],
    "tags": []
  },
  "👟": {
    "description": "athletic shoe",
    "names": [
      "athletic_shoe"
    ],
    "tags": [
      "sneaker",
      "sport",
      "running"
    ]
  },
  "👞": {
    "description": "mans shoe",
    "names": [
      "mans_shoe",
      "shoe"
    ],
    "tags": []
  },
  "👡": {
    "description": "womans sandal",
    "names": [
      "sandal"
    ],
    "tags": [
      "shoe"
    ]
  },
  "👠": {
    "description": "high-heeled shoe",
    "names": [
      "high_heel"
    ],
    "tags": [
      "shoe"
    ]
  },
  "👢": {
    "description": "womans boots",
    "names": [
      "boot"
    ],
    "tags": []
  },
  "👕": {
    "description": "t-shirt",
    "names": [
      "shirt",
      "tshirt"
    ],
    "tags": []
  },
  "👔": {
    "description": "necktie",
    "names": [
      "necktie"
    ],
    "tags": [
      "shirt",
      "formal"
    ]
  },
  "👚": {
    "description": "womans clothes",
    "names": [
      "womans_clothes"
    ],
    "tags": []
  },
  "👗": {
    "description": "dress",
    "names": [
      "dress"
    ],
    "tags": []
  },
  "🎽": {
    "description": "running shirt with sash",
    "names": [
      "running_shirt_with_sash"
    ],
    "tags": [
      "marathon"
    ]
  },
  "👖": {
    "description": "jeans",
    "names": [
      "jeans"
    ],
    "tags": [
      "pants"
    ]
  },
  "👘": {
    "description": "kimono",
    "names": [
      "kimono"
    ],
    "tags": []
  },
  "👙": {
    "description": "bikini",
    "names": [
      "bikini"
    ],
    "tags": [
      "beach"
    ]
  },
  "💼": {
    "description": "briefcase",
    "names": [
      "briefcase"
    ],
    "tags": [
      "business"
    ]
  },
  "👜": {
    "description": "handbag",
    "names": [
      "handbag"
    ],
    "tags": [
      "bag"
    ]
  },
  "👝": {
    "description": "pouch",
    "names": [
      "pouch"
    ],
    "tags": [
      "bag"
    ]
  },
  "👛": {
    "description": "purse",
    "names": [
      "purse"
    ],
    "tags": []
  },
  "👓": {
    "description": "eyeglasses",
    "names": [
      "eyeglasses"
    ],
    "tags": [
      "glasses"
    ]
  },
  "🎀": {
    "description": "ribbon",
    "names": [
      "ribbon"
    ],
    "tags": []
  },
  "🌂": {
    "description": "closed umbrella",
    "names": [
      "closed_umbrella"
    ],
    "tags": [
      "weather",
      "rain"
    ]
  },
  "💄": {
    "description": "lipstick",
    "names": [
      "lipstick"
    ],
    "tags": [
      "makeup"
    ]
  },
  "💛": {
    "description": "yellow heart",
    "names": [
      "yellow_heart"
    ],
    "tags": []
  },
  "💙": {
    "description": "blue heart",
    "names": [
      "blue_heart"
    ],
    "tags": []
  },
  "💜": {
    "description": "purple heart",
    "names": [
      "purple_heart"
    ],
    "tags": []
  },
  "💚": {
    "description": "green heart",
    "names": [
      "green_heart"
    ],
    "tags": []
  },
  "❤️": {
    "description": "heavy black heart",
    "names": [
      "heart"
    ],
    "tags": [
      "love"
    ]
  },
  "💔": {
    "description": "broken heart",
    "names": [
      "broken_heart"
    ],
    "tags": []
  },
  "💗": {
    "description": "growing heart",
    "names": [
      "heartpulse"
    ],
    "tags": []
  },
  "💓": {
    "description": "beating heart",
    "names": [
      "heartbeat"
    ],
    "tags": []
  },
  "💕": {
    "description": "two hearts",
    "names": [
      "two_hearts"
    ],
    "tags": []
  },
  "💖": {
    "description": "sparkling heart",
    "names": [
      "sparkling_heart"
    ],
    "tags": []
  },
  "💞": {
    "description": "revolving hearts",
    "names": [
      "revolving_hearts"
    ],
    "tags": []
  },
  "💘": {
    "description": "heart with arrow",
    "names": [
      "cupid"
    ],
    "tags": [
      "love",
      "heart"
    ]
  },
  "💌": {
    "description": "love letter",
    "names": [
      "love_letter"
    ],
    "tags": [
      "email",
      "envelope"
    ]
  },
  "💋": {
    "description": "kiss mark",
    "names": [
      "kiss"
    ],
    "tags": [
      "lipstick"
    ]
  },
  "💍": {
    "description": "ring",
    "names": [
      "ring"
    ],
    "tags": [
      "wedding",
      "marriage",
      "engaged"
    ]
  },
  "💎": {
    "description": "gem stone",
    "names": [
      "gem"
    ],
    "tags": [
      "diamond"
    ]
  },
  "👤": {
    "description": "bust in silhouette",
    "names": [
      "bust_in_silhouette"
    ],
    "tags": [
      "user"
    ]
  },
  "👥": {
    "description": "busts in silhouette",
    "names": [
      "busts_in_silhouette"
    ],
    "tags": [
      "users",
      "group",
      "team"
    ]
  },
  "💬": {
    "description": "speech balloon",
    "names": [
      "speech_balloon"
    ],
    "tags": [
      "comment"
    ]
  },
  "👣": {
    "description": "footprints",
    "names": [
      "footprints"
    ],
    "tags": [
      "feet",
      "tracks"
    ]
  },
  "💭": {
    "description": "thought balloon",
    "names": [
      "thought_balloon"
    ],
    "tags": [
      "thinking"
    ]
  },
  "🐶": {
    "description": "dog face",
    "names": [
      "dog"
    ],
    "tags": [
      "pet"
    ]
  },
  "🐺": {
    "description": "wolf face",
    "names": [
      "wolf"
    ],
    "tags": []
  },
  "🐱": {
    "description": "cat face",
    "names": [
      "cat"
    ],
    "tags": [
      "pet"
    ]
  },
  "🐭": {
    "description": "mouse face",
    "names": [
      "mouse"
    ],
    "tags": []
  },
  "🐹": {
    "description": "hamster face",
    "names": [
      "hamster"
    ],
    "tags": [
      "pet"
    ]
  },
  "🐰": {
    "description": "rabbit face",
    "names": [
      "rabbit"
    ],
    "tags": [
      "bunny"
    ]
  },
  "🐸": {
    "description": "frog face",
    "names": [
      "frog"
    ],
    "tags": []
  },
  "🐯": {
    "description": "tiger face",
    "names": [
      "tiger"
    ],
    "tags": []
  },
  "🐨": {
    "description": "koala",
    "names": [
      "koala"
    ],
    "tags": []
  },
  "🐻": {
    "description": "bear face",
    "names": [
      "bear"
    ],
    "tags": []
  },
  "🐷": {
    "description": "pig face",
    "names": [
      "pig"
    ],
    "tags": []
  },
  "🐽": {
    "description": "pig nose",
    "names": [
      "pig_nose"
    ],
    "tags": []
  },
  "🐮": {
    "description": "cow face",
    "names": [
      "cow"
    ],
    "tags": []
  },
  "🐗": {
    "description": "boar",
    "names": [
      "boar"
    ],
    "tags": []
  },
  "🐵": {
    "description": "monkey face",
    "names": [
      "monkey_face"
    ],
    "tags": []
  },
  "🐒": {
    "description": "monkey",
    "names": [
      "monkey"
    ],
    "tags": []
  },
  "🐴": {
    "description": "horse face",
    "names": [
      "horse"
    ],
    "tags": []
  },
  "🐑": {
    "description": "sheep",
    "names": [
      "sheep"
    ],
    "tags": []
  },
  "🐘": {
    "description": "elephant",
    "names": [
      "elephant"
    ],
    "tags": []
  },
  "🐼": {
    "description": "panda face",
    "names": [
      "panda_face"
    ],
    "tags": []
  },
  "🐧": {
    "description": "penguin",
    "names": [
      "penguin"
    ],
    "tags": []
  },
  "🐦": {
    "description": "bird",
    "names": [
      "bird"
    ],
    "tags": []
  },
  "🐤": {
    "description": "baby chick",
    "names": [
      "baby_chick"
    ],
    "tags": []
  },
  "🐥": {
    "description": "front-facing baby chick",
    "names": [
      "hatched_chick"
    ],
    "tags": []
  },
  "🐣": {
    "description": "hatching chick",
    "names": [
      "hatching_chick"
    ],
    "tags": []
  },
  "🐔": {
    "description": "chicken",
    "names": [
      "chicken"
    ],
    "tags": []
  },
  "🐍": {
    "description": "snake",
    "names": [
      "snake"
    ],
    "tags": []
  },
  "🐢": {
    "description": "turtle",
    "names": [
      "turtle"
    ],
    "tags": [
      "slow"
    ]
  },
  "🐛": {
    "description": "bug",
    "names": [
      "bug"
    ],
    "tags": []
  },
  "🐝": {
    "description": "honeybee",
    "names": [
      "bee",
      "honeybee"
    ],
    "tags": []
  },
  "🐜": {
    "description": "ant",
    "names": [
      "ant"
    ],
    "tags": []
  },
  "🐞": {
    "description": "lady beetle",
    "names": [
      "beetle"
    ],
    "tags": [
      "bug"
    ]
  },
  "🐌": {
    "description": "snail",
    "names": [
      "snail"
    ],
    "tags": [
      "slow"
    ]
  },
  "🐙": {
    "description": "octopus",
    "names": [
      "octopus"
    ],
    "tags": []
  },
  "🐚": {
    "description": "spiral shell",
    "names": [
      "shell"
    ],
    "tags": [
      "sea",
      "beach"
    ]
  },
  "🐠": {
    "description": "tropical fish",
    "names": [
      "tropical_fish"
    ],
    "tags": []
  },
  "🐟": {
    "description": "fish",
    "names": [
      "fish"
    ],
    "tags": []
  },
  "🐬": {
    "description": "dolphin",
    "names": [
      "dolphin",
      "flipper"
    ],
    "tags": []
  },
  "🐳": {
    "description": "spouting whale",
    "names": [
      "whale"
    ],
    "tags": [
      "sea"
    ]
  },
  "🐋": {
    "description": "whale",
    "names": [
      "whale2"
    ],
    "tags": []
  },
  "🐄": {
    "description": "cow",
    "names": [
      "cow2"
    ],
    "tags": []
  },
  "🐏": {
    "description": "ram",
    "names": [
      "ram"
    ],
    "tags": []
  },
  "🐀": {
    "description": "rat",
    "names": [
      "rat"
    ],
    "tags": []
  },
  "🐃": {
    "description": "water buffalo",
    "names": [
      "water_buffalo"
    ],
    "tags": []
  },
  "🐅": {
    "description": "tiger",
    "names": [
      "tiger2"
    ],
    "tags": []
  },
  "🐇": {
    "description": "rabbit",
    "names": [
      "rabbit2"
    ],
    "tags": []
  },
  "🐉": {
    "description": "dragon",
    "names": [
      "dragon"
    ],
    "tags": []
  },
  "🐎": {
    "description": "horse",
    "names": [
      "racehorse"
    ],
    "tags": [
      "speed"
    ]
  },
  "🐐": {
    "description": "goat",
    "names": [
      "goat"
    ],
    "tags": []
  },
  "🐓": {
    "description": "rooster",
    "names": [
      "rooster"
    ],
    "tags": []
  },
  "🐕": {
    "description": "dog",
    "names": [
      "dog2"
    ],
    "tags": []
  },
  "🐖": {
    "description": "pig",
    "names": [
      "pig2"
    ],
    "tags": []
  },
  "🐁": {
    "description": "mouse",
    "names": [
      "mouse2"
    ],
    "tags": []
  },
  "🐂": {
    "description": "ox",
    "names": [
      "ox"
    ],
    "tags": []
  },
  "🐲": {
    "description": "dragon face",
    "names": [
      "dragon_face"
    ],
    "tags": []
  },
  "🐡": {
    "description": "blowfish",
    "names": [
      "blowfish"
    ],
    "tags": []
  },
  "🐊": {
    "description": "crocodile",
    "names": [
      "crocodile"
    ],
    "tags": []
  },
  "🐫": {
    "description": "bactrian camel",
    "names": [
      "camel"
    ],
    "tags": []
  },
  "🐪": {
    "description": "dromedary camel",
    "names": [
      "dromedary_camel"
    ],
    "tags": [
      "desert"
    ]
  },
  "🐆": {
    "description": "leopard",
    "names": [
      "leopard"
    ],
    "tags": []
  },
  "🐈": {
    "description": "cat",
    "names": [
      "cat2"
    ],
    "tags": []
  },
  "🐩": {
    "description": "poodle",
    "names": [
      "poodle"
    ],
    "tags": [
      "dog"
    ]
  },
  "🐾": {
    "description": "paw prints",
    "names": [
      "feet",
      "paw_prints"
    ],
    "tags": []
  },
  "💐": {
    "description": "bouquet",
    "names": [
      "bouquet"
    ],
    "tags": [
      "flowers"
    ]
  },
  "🌸": {
    "description": "cherry blossom",
    "names": [
      "cherry_blossom"
    ],
    "tags": [
      "flower",
      "spring"
    ]
  },
  "🌷": {
    "description": "tulip",
    "names": [
      "tulip"
    ],
    "tags": [
      "flower"
    ]
  },
  "🍀": {
    "description": "four leaf clover",
    "names": [
      "four_leaf_clover"
    ],
    "tags": [
      "luck"
    ]
  },
  "🌹": {
    "description": "rose",
    "names": [
      "rose"
    ],
    "tags": [
      "flower"
    ]
  },
  "🌻": {
    "description": "sunflower",
    "names": [
      "sunflower"
    ],
    "tags": []
  },
  "🌺": {
    "description": "hibiscus",
    "names": [
      "hibiscus"
    ],
    "tags": []
  },
  "🍁": {
    "description": "maple leaf",
    "names": [
      "maple_leaf"
    ],
    "tags": [
      "canada"
    ]
  },
  "🍃": {
    "description": "leaf fluttering in wind",
    "names": [
      "leaves"
    ],
    "tags": [
      "leaf"
    ]
  },
  "🍂": {
    "description": "fallen leaf",
    "names": [
      "fallen_leaf"
    ],
    "tags": [
      "autumn"
    ]
  },
  "🌿": {
    "description": "herb",
    "names": [
      "herb"
    ],
    "tags": []
  },
  "🌾": {
    "description": "ear of rice",
    "names": [
      "ear_of_rice"
    ],
    "tags": []
  },
  "🍄": {
    "description": "mushroom",
    "names": [
      "mushroom"
    ],
    "tags": []
  },
  "🌵": {
    "description": "cactus",
    "names": [
      "cactus"
    ],
    "tags": []
  },
  "🌴": {
    "description": "palm tree",
    "names": [
      "palm_tree"
    ],
    "tags": []
  },
  "🌲": {
    "description": "evergreen tree",
    "names": [
      "evergreen_tree"
    ],
    "tags": [
      "wood"
    ]
  },
  "🌳": {
    "description": "deciduous tree",
    "names": [
      "deciduous_tree"
    ],
    "tags": [
      "wood"
    ]
  },
  "🌰": {
    "description": "chestnut",
    "names": [
      "chestnut"
    ],
    "tags": []
  },
  "🌱": {
    "description": "seedling",
    "names": [
      "seedling"
    ],
    "tags": [
      "plant"
    ]
  },
  "🌼": {
    "description": "blossom",
    "names": [
      "blossom"
    ],
    "tags": []
  },
  "🌐": {
    "description": "globe with meridians",
    "names": [
      "globe_with_meridians"
    ],
    "tags": [
      "world",
      "global",
      "international"
    ]
  },
  "🌞": {
    "description": "sun with face",
    "names": [
      "sun_with_face"
    ],
    "tags": [
      "summer"
    ]
  },
  "🌝": {
    "description": "full moon with face",
    "names": [
      "full_moon_with_face"
    ],
    "tags": []
  },
  "🌚": {
    "description": "new moon with face",
    "names": [
      "new_moon_with_face"
    ],
    "tags": []
  },
  "🌑": {
    "description": "new moon symbol",
    "names": [
      "new_moon"
    ],
    "tags": []
  },
  "🌒": {
    "description": "waxing crescent moon symbol",
    "names": [
      "waxing_crescent_moon"
    ],
    "tags": []
  },
  "🌓": {
    "description": "first quarter moon symbol",
    "names": [
      "first_quarter_moon"
    ],
    "tags": []
  },
  "🌔": {
    "description": "waxing gibbous moon symbol",
    "names": [
      "moon",
      "waxing_gibbous_moon"
    ],
    "tags": []
  },
  "🌕": {
    "description": "full moon symbol",
    "names": [
      "full_moon"
    ],
    "tags": []
  },
  "🌖": {
    "description": "waning gibbous moon symbol",
    "names": [
      "waning_gibbous_moon"
    ],
    "tags": []
  },
  "🌗": {
    "description": "last quarter moon symbol",
    "names": [
      "last_quarter_moon"
    ],
    "tags": []
  },
  "🌘": {
    "description": "waning crescent moon symbol",
    "names": [
      "waning_crescent_moon"
    ],
    "tags": []
  },
  "🌜": {
    "description": "last quarter moon with face",
    "names": [
      "last_quarter_moon_with_face"
    ],
    "tags": []
  },
  "🌛": {
    "description": "first quarter moon with face",
    "names": [
      "first_quarter_moon_with_face"
    ],
    "tags": []
  },
  "🌙": {
    "description": "crescent moon",
    "names": [
      "crescent_moon"
    ],
    "tags": [
      "night"
    ]
  },
  "🌍": {
    "description": "earth globe europe-africa",
    "names": [
      "earth_africa"
    ],
    "tags": [
      "globe",
      "world",
      "international"
    ]
  },
  "🌎": {
    "description": "earth globe americas",
    "names": [
      "earth_americas"
    ],
    "tags": [
      "globe",
      "world",
      "international"
    ]
  },
  "🌏": {
    "description": "earth globe asia-australia",
    "names": [
      "earth_asia"
    ],
    "tags": [
      "globe",
      "world",
      "international"
    ]
  },
  "🌋": {
    "description": "volcano",
    "names": [
      "volcano"
    ],
    "tags": []
  },
  "🌌": {
    "description": "milky way",
    "names": [
      "milky_way"
    ],
    "tags": []
  },
  "🌠": {
    "description": "shooting star",
    "names": [
      "stars"
    ],
    "tags": []
  },
  "⭐": {
    "description": "white medium star",
    "names": [
      "star"
    ],
    "tags": []
  },
  "☀️": {
    "description": "black sun with rays",
    "names": [
      "sunny"
    ],
    "tags": [
      "weather"
    ]
  },
  "⛅": {
    "description": "sun behind cloud",
    "names": [
      "partly_sunny"
    ],
    "tags": [
      "weather",
      "cloud"
    ]
  },
  "☁️": {
    "description": "cloud",
    "names": [
      "cloud"
    ],
    "tags": []
  },
  "⚡": {
    "description": "high voltage sign",
    "names": [
      "zap"
    ],
    "tags": [
      "lightning",
      "thunder"
    ]
  },
  "☔": {
    "description": "umbrella with rain drops",
    "names": [
      "umbrella"
    ],
    "tags": [
      "rain",
      "weather"
    ]
  },
  "❄️": {
    "description": "snowflake",
    "names": [
      "snowflake"
    ],
    "tags": [
      "winter",
      "cold",
      "weather"
    ]
  },
  "⛄": {
    "description": "snowman without snow",
    "names": [
      "snowman"
    ],
    "tags": [
      "winter",
      "christmas"
    ]
  },
  "🌀": {
    "description": "cyclone",
    "names": [
      "cyclone"
    ],
    "tags": [
      "swirl"
    ]
  },
  "🌁": {
    "description": "foggy",
    "names": [
      "foggy"
    ],
    "tags": [
      "karl"
    ]
  },
  "🌈": {
    "description": "rainbow",
    "names": [
      "rainbow"
    ],
    "tags": [
      "pride"
    ]
  },
  "🌊": {
    "description": "water wave",
    "names": [
      "ocean"
    ],
    "tags": [
      "sea"
    ]
  },
  "🎍": {
    "description": "pine decoration",
    "names": [
      "bamboo"
    ],
    "tags": []
  },
  "💝": {
    "description": "heart with ribbon",
    "names": [
      "gift_heart"
    ],
    "tags": [
      "chocolates"
    ]
  },
  "🎎": {
    "description": "japanese dolls",
    "names": [
      "dolls"
    ],
    "tags": []
  },
  "🎒": {
    "description": "school satchel",
    "names": [
      "school_satchel"
    ],
    "tags": []
  },
  "🎓": {
    "description": "graduation cap",
    "names": [
      "mortar_board"
    ],
    "tags": [
      "education",
      "college",
      "university",
      "graduation"
    ]
  },
  "🎏": {
    "description": "carp streamer",
    "names": [
      "flags"
    ],
    "tags": []
  },
  "🎆": {
    "description": "fireworks",
    "names": [
      "fireworks"
    ],
    "tags": [
      "festival",
      "celebration"
    ]
  },
  "🎇": {
    "description": "firework sparkler",
    "names": [
      "sparkler"
    ],
    "tags": []
  },
  "🎐": {
    "description": "wind chime",
    "names": [
      "wind_chime"
    ],
    "tags": []
  },
  "🎑": {
    "description": "moon viewing ceremony",
    "names": [
      "rice_scene"
    ],
    "tags": []
  },
  "🎃": {
    "description": "jack-o-lantern",
    "names": [
      "jack_o_lantern"
    ],
    "tags": [
      "halloween"
    ]
  },
  "👻": {
    "description": "ghost",
    "names": [
      "ghost"
    ],
    "tags": [
      "halloween"
    ]
  },
  "🎅": {
    "description": "father christmas",
    "names": [
      "santa"
    ],
    "tags": [
      "christmas"
    ]
  },
  "🎄": {
    "description": "christmas tree",
    "names": [
      "christmas_tree"
    ],
    "tags": []
  },
  "🎁": {
    "description": "wrapped present",
    "names": [
      "gift"
    ],
    "tags": [
      "present",
      "birthday",
      "christmas"
    ]
  },
  "🎋": {
    "description": "tanabata tree",
    "names": [
      "tanabata_tree"
    ],
    "tags": []
  },
  "🎉": {
    "description": "party popper",
    "names": [
      "tada"
    ],
    "tags": [
      "party"
    ]
  },
  "🎊": {
    "description": "confetti ball",
    "names": [
      "confetti_ball"
    ],
    "tags": []
  },
  "🎈": {
    "description": "balloon",
    "names": [
      "balloon"
    ],
    "tags": [
      "party",
      "birthday"
    ]
  },
  "🎌": {
    "description": "crossed flags",
    "names": [
      "crossed_flags"
    ],
    "tags": []
  },
  "🔮": {
    "description": "crystal ball",
    "names": [
      "crystal_ball"
    ],
    "tags": [
      "fortune"
    ]
  },
  "🎥": {
    "description": "movie camera",
    "names": [
      "movie_camera"
    ],
    "tags": [
      "film",
      "video"
    ]
  },
  "📷": {
    "description": "camera",
    "names": [
      "camera"
    ],
    "tags": [
      "photo"
    ]
  },
  "📹": {
    "description": "video camera",
    "names": [
      "video_camera"
    ],
    "tags": []
  },
  "📼": {
    "description": "videocassette",
    "names": [
      "vhs"
    ],
    "tags": []
  },
  "💿": {
    "description": "optical disc",
    "names": [
      "cd"
    ],
    "tags": []
  },
  "📀": {
    "description": "dvd",
    "names": [
      "dvd"
    ],
    "tags": []
  },
  "💽": {
    "description": "minidisc",
    "names": [
      "minidisc"
    ],
    "tags": []
  },
  "💾": {
    "description": "floppy disk",
    "names": [
      "floppy_disk"
    ],
    "tags": [
      "save"
    ]
  },
  "💻": {
    "description": "personal computer",
    "names": [
      "computer"
    ],
    "tags": [
      "desktop",
      "screen"
    ]
  },
  "📱": {
    "description": "mobile phone",
    "names": [
      "iphone"
    ],
    "tags": [
      "smartphone",
      "mobile"
    ]
  },
  "☎️": {
    "description": "black telephone",
    "names": [
      "phone",
      "telephone"
    ],
    "tags": []
  },
  "📞": {
    "description": "telephone receiver",
    "names": [
      "telephone_receiver"
    ],
    "tags": [
      "phone",
      "call"
    ]
  },
  "📟": {
    "description": "pager",
    "names": [
      "pager"
    ],
    "tags": []
  },
  "📠": {
    "description": "fax machine",
    "names": [
      "fax"
    ],
    "tags": []
  },
  "📡": {
    "description": "satellite antenna",
    "names": [
      "satellite"
    ],
    "tags": [
      "signal"
    ]
  },
  "📺": {
    "description": "television",
    "names": [
      "tv"
    ],
    "tags": []
  },
  "📻": {
    "description": "radio",
    "names": [
      "radio"
    ],
    "tags": [
      "podcast"
    ]
  },
  "🔊": {
    "description": "speaker with three sound waves",
    "names": [
      "loud_sound"
    ],
    "tags": [
      "volume"
    ]
  },
  "🔉": {
    "description": "speaker with one sound wave",
    "names": [
      "sound"
    ],
    "tags": [
      "volume"
    ]
  },
  "🔈": {
    "description": "speaker",
    "names": [
      "speaker"
    ],
    "tags": []
  },
  "🔇": {
    "description": "speaker with cancellation stroke",
    "names": [
      "mute"
    ],
    "tags": [
      "sound",
      "volume"
    ]
  },
  "🔔": {
    "description": "bell",
    "names": [
      "bell"
    ],
    "tags": [
      "sound",
      "notification"
    ]
  },
  "🔕": {
    "description": "bell with cancellation stroke",
    "names": [
      "no_bell"
    ],
    "tags": [
      "volume",
      "off"
    ]
  },
  "📢": {
    "description": "public address loudspeaker",
    "names": [
      "loudspeaker"
    ],
    "tags": [
      "announcement"
    ]
  },
  "📣": {
    "description": "cheering megaphone",
    "names": [
      "mega"
    ],
    "tags": []
  },
  "⏳": {
    "description": "hourglass with flowing sand",
    "names": [
      "hourglass_flowing_sand"
    ],
    "tags": [
      "time"
    ]
  },
  "⌛": {
    "description": "hourglass",
    "names": [
      "hourglass"
    ],
    "tags": [
      "time"
    ]
  },
  "⏰": {
    "description": "alarm clock",
    "names": [
      "alarm_clock"
    ],
    "tags": [
      "morning"
    ]
  },
  "⌚": {
    "description": "watch",
    "names": [
      "watch"
    ],
    "tags": [
      "time"
    ]
  },
  "🔓": {
    "description": "open lock",
    "names": [
      "unlock"
    ],
    "tags": [
      "security"
    ]
  },
  "🔒": {
    "description": "lock",
    "names": [
      "lock"
    ],
    "tags": [
      "security",
      "private"
    ]
  },
  "🔏": {
    "description": "lock with ink pen",
    "names": [
      "lock_with_ink_pen"
    ],
    "tags": []
  },
  "🔐": {
    "description": "closed lock with key",
    "names": [
      "closed_lock_with_key"
    ],
    "tags": [
      "security"
    ]
  },
  "🔑": {
    "description": "key",
    "names": [
      "key"
    ],
    "tags": [
      "lock",
      "password"
    ]
  },
  "🔎": {
    "description": "right-pointing magnifying glass",
    "names": [
      "mag_right"
    ],
    "tags": []
  },
  "💡": {
    "description": "electric light bulb",
    "names": [
      "bulb"
    ],
    "tags": [
      "idea",
      "light"
    ]
  },
  "🔦": {
    "description": "electric torch",
    "names": [
      "flashlight"
    ],
    "tags": []
  },
  "🔆": {
    "description": "high brightness symbol",
    "names": [
      "high_brightness"
    ],
    "tags": []
  },
  "🔅": {
    "description": "low brightness symbol",
    "names": [
      "low_brightness"
    ],
    "tags": []
  },
  "🔌": {
    "description": "electric plug",
    "names": [
      "electric_plug"
    ],
    "tags": []
  },
  "🔋": {
    "description": "battery",
    "names": [
      "battery"
    ],
    "tags": [
      "power"
    ]
  },
  "🔍": {
    "description": "left-pointing magnifying glass",
    "names": [
      "mag"
    ],
    "tags": [
      "search",
      "zoom"
    ]
  },
  "🛁": {
    "description": "bathtub",
    "names": [
      "bathtub"
    ],
    "tags": []
  },
  "🛀": {
    "description": "bath",
    "names": [
      "bath"
    ],
    "tags": [
      "shower"
    ]
  },
  "🚿": {
    "description": "shower",
    "names": [
      "shower"
    ],
    "tags": [
      "bath"
    ]
  },
  "🚽": {
    "description": "toilet",
    "names": [
      "toilet"
    ],
    "tags": [
      "wc"
    ]
  },
  "🔧": {
    "description": "wrench",
    "names": [
      "wrench"
    ],
    "tags": [
      "tool"
    ]
  },
  "🔩": {
    "description": "nut and bolt",
    "names": [
      "nut_and_bolt"
    ],
    "tags": []
  },
  "🔨": {
    "description": "hammer",
    "names": [
      "hammer"
    ],
    "tags": [
      "tool"
    ]
  },
  "🚪": {
    "description": "door",
    "names": [
      "door"
    ],
    "tags": []
  },
  "🚬": {
    "description": "smoking symbol",
    "names": [
      "smoking"
    ],
    "tags": [
      "cigarette"
    ]
  },
  "💣": {
    "description": "bomb",
    "names": [
      "bomb"
    ],
    "tags": [
      "boom"
    ]
  },
  "🔫": {
    "description": "pistol",
    "names": [
      "gun"
    ],
    "tags": [
      "shoot",
      "weapon"
    ]
  },
  "🔪": {
    "description": "hocho",
    "names": [
      "hocho",
      "knife"
    ],
    "tags": [
      "cut",
      "chop"
    ]
  },
  "💊": {
    "description": "pill",
    "names": [
      "pill"
    ],
    "tags": [
      "health",
      "medicine"
    ]
  },
  "💉": {
    "description": "syringe",
    "names": [
      "syringe"
    ],
    "tags": [
      "health",
      "hospital",
      "needle"
    ]
  },
  "💰": {
    "description": "money bag",
    "names": [
      "moneybag"
    ],
    "tags": [
      "dollar",
      "cream"
    ]
  },
  "💴": {
    "description": "banknote with yen sign",
    "names": [
      "yen"
    ],
    "tags": []
  },
  "💵": {
    "description": "banknote with dollar sign",
    "names": [
      "dollar"
    ],
    "tags": [
      "money"
    ]
  },
  "💷": {
    "description": "banknote with pound sign",
    "names": [
      "pound"
    ],
    "tags": []
  },
  "💶": {
    "description": "banknote with euro sign",
    "names": [
      "euro"
    ],
    "tags": []
  },
  "💳": {
    "description": "credit card",
    "names": [
      "credit_card"
    ],
    "tags": [
      "subscription"
    ]
  },
  "💸": {
    "description": "money with wings",
    "names": [
      "money_with_wings"
    ],
    "tags": [
      "dollar"
    ]
  },
  "📲": {
    "description": "mobile phone with rightwards arrow at left",
    "names": [
      "calling"
    ],
    "tags": [
      "call",
      "incoming"
    ]
  },
  "📧": {
    "description": "e-mail symbol",
    "names": [
      "e-mail"
    ],
    "tags": []
  },
  "📥": {
    "description": "inbox tray",
    "names": [
      "inbox_tray"
    ],
    "tags": []
  },
  "📤": {
    "description": "outbox tray",
    "names": [
      "outbox_tray"
    ],
    "tags": []
  },
  "✉️": {
    "description": "envelope",
    "names": [
      "email",
      "envelope"
    ],
    "tags": [
      "letter"
    ]
  },
  "📩": {
    "description": "envelope with downwards arrow above",
    "names": [
      "envelope_with_arrow"
    ],
    "tags": []
  },
  "📨": {
    "description": "incoming envelope",
    "names": [
      "incoming_envelope"
    ],
    "tags": []
  },
  "📯": {
    "description": "postal horn",
    "names": [
      "postal_horn"
    ],
    "tags": []
  },
  "📫": {
    "description": "closed mailbox with raised flag",
    "names": [
      "mailbox"
    ],
    "tags": []
  },
  "📪": {
    "description": "closed mailbox with lowered flag",
    "names": [
      "mailbox_closed"
    ],
    "tags": []
  },
  "📬": {
    "description": "open mailbox with raised flag",
    "names": [
      "mailbox_with_mail"
    ],
    "tags": []
  },
  "📭": {
    "description": "open mailbox with lowered flag",
    "names": [
      "mailbox_with_no_mail"
    ],
    "tags": []
  },
  "📮": {
    "description": "postbox",
    "names": [
      "postbox"
    ],
    "tags": []
  },
  "📦": {
    "description": "package",
    "names": [
      "package"
    ],
    "tags": [
      "shipping"
    ]
  },
  "📝": {
    "description": "memo",
    "names": [
      "memo",
      "pencil"
    ],
    "tags": [
      "document",
      "note"
    ]
  },
  "📄": {
    "description": "page facing up",
    "names": [
      "page_facing_up"
    ],
    "tags": [
      "document"
    ]
  },
  "📃": {
    "description": "page with curl",
    "names": [
      "page_with_curl"
    ],
    "tags": []
  },
  "📑": {
    "description": "bookmark tabs",
    "names": [
      "bookmark_tabs"
    ],
    "tags": []
  },
  "📊": {
    "description": "bar chart",
    "names": [
      "bar_chart"
    ],
    "tags": [
      "stats",
      "metrics"
    ]
  },
  "📈": {
    "description": "chart with upwards trend",
    "names": [
      "chart_with_upwards_trend"
    ],
    "tags": [
      "graph",
      "metrics"
    ]
  },
  "📉": {
    "description": "chart with downwards trend",
    "names": [
      "chart_with_downwards_trend"
    ],
    "tags": [
      "graph",
      "metrics"
    ]
  },
  "📜": {
    "description": "scroll",
    "names": [
      "scroll"
    ],
    "tags": [
      "document"
    ]
  },
  "📋": {
    "description": "clipboard",
    "names": [
      "clipboard"
    ],
    "tags": []
  },
  "📅": {
    "description": "calendar",
    "names": [
      "date"
    ],
    "tags": [
      "calendar",
      "schedule"
    ]
  },
  "📆": {
    "description": "tear-off calendar",
    "names": [
      "calendar"
    ],
    "tags": [
      "schedule"
    ]
  },
  "📇": {
    "description": "card index",
    "names": [
      "card_index"
    ],
    "tags": []
  },
  "📁": {
    "description": "file folder",
    "names": [
      "file_folder"
    ],
    "tags": [
      "directory"
    ]
  },
  "📂": {
    "description": "open file folder",
    "names": [
      "open_file_folder"
    ],
    "tags": []
  },
  "✂️": {
    "description": "black scissors",
    "names": [
      "scissors"
    ],
    "tags": [
      "cut"
    ]
  },
  "📌": {
    "description": "pushpin",
    "names": [
      "pushpin"
    ],
    "tags": [
      "location"
    ]
  },
  "📎": {
    "description": "paperclip",
    "names": [
      "paperclip"
    ],
    "tags": []
  },
  "✒️": {
    "description": "black nib",
    "names": [
      "black_nib"
    ],
    "tags": []
  },
  "✏️": {
    "description": "pencil",
    "names": [
      "pencil2"
    ],
    "tags": []
  },
  "📏": {
    "description": "straight ruler",
    "names": [
      "straight_ruler"
    ],
    "tags": []
  },
  "📐": {
    "description": "triangular ruler",
    "names": [
      "triangular_ruler"
    ],
    "tags": []
  },
  "📕": {
    "description": "closed book",
    "names": [
      "closed_book"
    ],
    "tags": []
  },
  "📗": {
    "description": "green book",
    "names": [
      "green_book"
    ],
    "tags": []
  },
  "📘": {
    "description": "blue book",
    "names": [
      "blue_book"
    ],
    "tags": []
  },
  "📙": {
    "description": "orange book",
    "names": [
      "orange_book"
    ],
    "tags": []
  },
  "📓": {
    "description": "notebook",
    "names": [
      "notebook"
    ],
    "tags": []
  },
  "📔": {
    "description": "notebook with decorative cover",
    "names": [
      "notebook_with_decorative_cover"
    ],
    "tags": []
  },
  "📒": {
    "description": "ledger",
    "names": [
      "ledger"
    ],
    "tags": []
  },
  "📚": {
    "description": "books",
    "names": [
      "books"
    ],
    "tags": [
      "library"
    ]
  },
  "📖": {
    "description": "open book",
    "names": [
      "book",
      "open_book"
    ],
    "tags": []
  },
  "🔖": {
    "description": "bookmark",
    "names": [
      "bookmark"
    ],
    "tags": []
  },
  "📛": {
    "description": "name badge",
    "names": [
      "name_badge"
    ],
    "tags": []
  },
  "🔬": {
    "description": "microscope",
    "names": [
      "microscope"
    ],
    "tags": [
      "science",
      "laboratory",
      "investigate"
    ]
  },
  "🔭": {
    "description": "telescope",
    "names": [
      "telescope"
    ],
    "tags": []
  },
  "📰": {
    "description": "newspaper",
    "names": [
      "newspaper"
    ],
    "tags": [
      "press"
    ]
  },
  "🎨": {
    "description": "artist palette",
    "names": [
      "art"
    ],
    "tags": [
      "design",
      "paint"
    ]
  },
  "🎬": {
    "description": "clapper board",
    "names": [
      "clapper"
    ],
    "tags": [
      "film"
    ]
  },
  "🎤": {
    "description": "microphone",
    "names": [
      "microphone"
    ],
    "tags": [
      "sing"
    ]
  },
  "🎧": {
    "description": "headphone",
    "names": [
      "headphones"
    ],
    "tags": [
      "music",
      "earphones"
    ]
  },
  "🎼": {
    "description": "musical score",
    "names": [
      "musical_score"
    ],
    "tags": []
  },
  "🎵": {
    "description": "musical note",
    "names": [
      "musical_note"
    ],
    "tags": []
  },
  "🎶": {
    "description": "multiple musical notes",
    "names": [
      "notes"
    ],
    "tags": [
      "music"
    ]
  },
  "🎹": {
    "description": "musical keyboard",
    "names": [
      "musical_keyboard"
    ],
    "tags": [
      "piano"
    ]
  },
  "🎻": {
    "description": "violin",
    "names": [
      "violin"
    ],
    "tags": []
  },
  "🎺": {
    "description": "trumpet",
    "names": [
      "trumpet"
    ],
    "tags": []
  },
  "🎷": {
    "description": "saxophone",
    "names": [
      "saxophone"
    ],
    "tags": []
  },
  "🎸": {
    "description": "guitar",
    "names": [
      "guitar"
    ],
    "tags": [
      "rock"
    ]
  },
  "👾": {
    "description": "alien monster",
    "names": [
      "space_invader"
    ],
    "tags": [
      "game",
      "retro"
    ]
  },
  "🎮": {
    "description": "video game",
    "names": [
      "video_game"
    ],
    "tags": [
      "play",
      "controller",
      "console"
    ]
  },
  "🃏": {
    "description": "playing card black joker",
    "names": [
      "black_joker"
    ],
    "tags": []
  },
  "🎴": {
    "description": "flower playing cards",
    "names": [
      "flower_playing_cards"
    ],
    "tags": []
  },
  "🀄": {
    "description": "mahjong tile red dragon",
    "names": [
      "mahjong"
    ],
    "tags": []
  },
  "🎲": {
    "description": "game die",
    "names": [
      "game_die"
    ],
    "tags": [
      "dice",
      "gambling"
    ]
  },
  "🎯": {
    "description": "direct hit",
    "names": [
      "dart"
    ],
    "tags": [
      "target"
    ]
  },
  "🏈": {
    "description": "american football",
    "names": [
      "football"
    ],
    "tags": [
      "sports"
    ]
  },
  "🏀": {
    "description": "basketball and hoop",
    "names": [
      "basketball"
    ],
    "tags": [
      "sports"
    ]
  },
  "⚽": {
    "description": "soccer ball",
    "names": [
      "soccer"
    ],
    "tags": [
      "sports"
    ]
  },
  "⚾️": {
    "description": "baseball",
    "names": [
      "baseball"
    ],
    "tags": [
      "sports"
    ]
  },
  "🎾": {
    "description": "tennis racquet and ball",
    "names": [
      "tennis"
    ],
    "tags": [
      "sports"
    ]
  },
  "🎱": {
    "description": "billiards",
    "names": [
      "8ball"
    ],
    "tags": [
      "pool",
      "billiards"
    ]
  },
  "🏉": {
    "description": "rugby football",
    "names": [
      "rugby_football"
    ],
    "tags": []
  },
  "🎳": {
    "description": "bowling",
    "names": [
      "bowling"
    ],
    "tags": []
  },
  "⛳": {
    "description": "flag in hole",
    "names": [
      "golf"
    ],
    "tags": []
  },
  "🚵": {
    "description": "mountain bicyclist",
    "names": [
      "mountain_bicyclist"
    ],
    "tags": []
  },
  "🚴": {
    "description": "bicyclist",
    "names": [
      "bicyclist"
    ],
    "tags": []
  },
  "🏁": {
    "description": "chequered flag",
    "names": [
      "checkered_flag"
    ],
    "tags": [
      "milestone",
      "finish"
    ]
  },
  "🏇": {
    "description": "horse racing",
    "names": [
      "horse_racing"
    ],
    "tags": []
  },
  "🏆": {
    "description": "trophy",
    "names": [
      "trophy"
    ],
    "tags": [
      "award",
      "contest",
      "winner"
    ]
  },
  "🎿": {
    "description": "ski and ski boot",
    "names": [
      "ski"
    ],
    "tags": []
  },
  "🏂": {
    "description": "snowboarder",
    "names": [
      "snowboarder"
    ],
    "tags": []
  },
  "🏊": {
    "description": "swimmer",
    "names": [
      "swimmer"
    ],
    "tags": []
  },
  "🏄": {
    "description": "surfer",
    "names": [
      "surfer"
    ],
    "tags": []
  },
  "🎣": {
    "description": "fishing pole and fish",
    "names": [
      "fishing_pole_and_fish"
    ],
    "tags": []
  },
  "☕": {
    "description": "hot beverage",
    "names": [
      "coffee"
    ],
    "tags": [
      "cafe",
      "espresso"
    ]
  },
  "🍵": {
    "description": "teacup without handle",
    "names": [
      "tea"
    ],
    "tags": [
      "green",
      "breakfast"
    ]
  },
  "🍶": {
    "description": "sake bottle and cup",
    "names": [
      "sake"
    ],
    "tags": []
  },
  "🍼": {
    "description": "baby bottle",
    "names": [
      "baby_bottle"
    ],
    "tags": [
      "milk"
    ]
  },
  "🍺": {
    "description": "beer mug",
    "names": [
      "beer"
    ],
    "tags": [
      "drink"
    ]
  },
  "🍻": {
    "description": "clinking beer mugs",
    "names": [
      "beers"
    ],
    "tags": [
      "drinks"
    ]
  },
  "🍸": {
    "description": "cocktail glass",
    "names": [
      "cocktail"
    ],
    "tags": [
      "drink"
    ]
  },
  "🍹": {
    "description": "tropical drink",
    "names": [
      "tropical_drink"
    ],
    "tags": [
      "summer",
      "vacation"
    ]
  },
  "🍷": {
    "description": "wine glass",
    "names": [
      "wine_glass"
    ],
    "tags": []
  },
  "🍴": {
    "description": "fork and knife",
    "names": [
      "fork_and_knife"
    ],
    "tags": [
      "cutlery"
    ]
  },
  "🍕": {
    "description": "slice of pizza",
    "names": [
      "pizza"
    ],
    "tags": []
  },
  "🍔": {
    "description": "hamburger",
    "names": [
      "hamburger"
    ],
    "tags": [
      "burger"
    ]
  },
  "🍟": {
    "description": "french fries",
    "names": [
      "fries"
    ],
    "tags": []
  },
  "🍗": {
    "description": "poultry leg",
    "names": [
      "poultry_leg"
    ],
    "tags": [
      "meat",
      "chicken"
    ]
  },
  "🍖": {
    "description": "meat on bone",
    "names": [
      "meat_on_bone"
    ],
    "tags": []
  },
  "🍝": {
    "description": "spaghetti",
    "names": [
      "spaghetti"
    ],
    "tags": [
      "pasta"
    ]
  },
  "🍛": {
    "description": "curry and rice",
    "names": [
      "curry"
    ],
    "tags": []
  },
  "🍤": {
    "description": "fried shrimp",
    "names": [
      "fried_shrimp"
    ],
    "tags": [
      "tempura"
    ]
  },
  "🍱": {
    "description": "bento box",
    "names": [
      "bento"
    ],
    "tags": []
  },
  "🍣": {
    "description": "sushi",
    "names": [
      "sushi"
    ],
    "tags": []
  },
  "🍥": {
    "description": "fish cake with swirl design",
    "names": [
      "fish_cake"
    ],
    "tags": []
  },
  "🍙": {
    "description": "rice ball",
    "names": [
      "rice_ball"
    ],
    "tags": []
  },
  "🍘": {
    "description": "rice cracker",
    "names": [
      "rice_cracker"
    ],
    "tags": []
  },
  "🍚": {
    "description": "cooked rice",
    "names": [
      "rice"
    ],
    "tags": []
  },
  "🍜": {
    "description": "steaming bowl",
    "names": [
      "ramen"
    ],
    "tags": [
      "noodle"
    ]
  },
  "🍲": {
    "description": "pot of food",
    "names": [
      "stew"
    ],
    "tags": []
  },
  "🍢": {
    "description": "oden",
    "names": [
      "oden"
    ],
    "tags": []
  },
  "🍡": {
    "description": "dango",
    "names": [
      "dango"
    ],
    "tags": []
  },
  "🍳": {
    "description": "cooking",
    "names": [
      "egg"
    ],
    "tags": [
      "breakfast"
    ]
  },
  "🍞": {
    "description": "bread",
    "names": [
      "bread"
    ],
    "tags": [
      "toast"
    ]
  },
  "🍩": {
    "description": "doughnut",
    "names": [
      "doughnut"
    ],
    "tags": []
  },
  "🍮": {
    "description": "custard",
    "names": [
      "custard"
    ],
    "tags": []
  },
  "🍦": {
    "description": "soft ice cream",
    "names": [
      "icecream"
    ],
    "tags": []
  },
  "🍨": {
    "description": "ice cream",
    "names": [
      "ice_cream"
    ],
    "tags": []
  },
  "🍧": {
    "description": "shaved ice",
    "names": [
      "shaved_ice"
    ],
    "tags": []
  },
  "🎂": {
    "description": "birthday cake",
    "names": [
      "birthday"
    ],
    "tags": [
      "party"
    ]
  },
  "🍰": {
    "description": "shortcake",
    "names": [
      "cake"
    ],
    "tags": [
      "dessert"
    ]
  },
  "🍪": {
    "description": "cookie",
    "names": [
      "cookie"
    ],
    "tags": []
  },
  "🍫": {
    "description": "chocolate bar",
    "names": [
      "chocolate_bar"
    ],
    "tags": []
  },
  "🍬": {
    "description": "candy",
    "names": [
      "candy"
    ],
    "tags": [
      "sweet"
    ]
  },
  "🍭": {
    "description": "lollipop",
    "names": [
      "lollipop"
    ],
    "tags": []
  },
  "🍯": {
    "description": "honey pot",
    "names": [
      "honey_pot"
    ],
    "tags": []
  },
  "🍎": {
    "description": "red apple",
    "names": [
      "apple"
    ],
    "tags": []
  },
  "🍏": {
    "description": "green apple",
    "names": [
      "green_apple"
    ],
    "tags": [
      "fruit"
    ]
  },
  "🍊": {
    "description": "tangerine",
    "names": [
      "tangerine",
      "orange",
      "mandarin"
    ],
    "tags": []
  },
  "🍋": {
    "description": "lemon",
    "names": [
      "lemon"
    ],
    "tags": []
  },
  "🍒": {
    "description": "cherries",
    "names": [
      "cherries"
    ],
    "tags": [
      "fruit"
    ]
  },
  "🍇": {
    "description": "grapes",
    "names": [
      "grapes"
    ],
    "tags": []
  },
  "🍉": {
    "description": "watermelon",
    "names": [
      "watermelon"
    ],
    "tags": []
  },
  "🍓": {
    "description": "strawberry",
    "names": [
      "strawberry"
    ],
    "tags": [
      "fruit"
    ]
  },
  "🍑": {
    "description": "peach",
    "names": [
      "peach"
    ],
    "tags": []
  },
  "🍈": {
    "description": "melon",
    "names": [
      "melon"
    ],
    "tags": []
  },
  "🍌": {
    "description": "banana",
    "names": [
      "banana"
    ],
    "tags": [
      "fruit"
    ]
  },
  "🍐": {
    "description": "pear",
    "names": [
      "pear"
    ],
    "tags": []
  },
  "🍍": {
    "description": "pineapple",
    "names": [
      "pineapple"
    ],
    "tags": []
  },
  "🍠": {
    "description": "roasted sweet potato",
    "names": [
      "sweet_potato"
    ],
    "tags": []
  },
  "🍆": {
    "description": "aubergine",
    "names": [
      "eggplant"
    ],
    "tags": [
      "aubergine"
    ]
  },
  "🍅": {
    "description": "tomato",
    "names": [
      "tomato"
    ],
    "tags": []
  },
  "🌽": {
    "description": "ear of maize",
    "names": [
      "corn"
    ],
    "tags": []
  },
  "🏠": {
    "description": "house building",
    "names": [
      "house"
    ],
    "tags": []
  },
  "🏡": {
    "description": "house with garden",
    "names": [
      "house_with_garden"
    ],
    "tags": []
  },
  "🏫": {
    "description": "school",
    "names": [
      "school"
    ],
    "tags": []
  },
  "🏢": {
    "description": "office building",
    "names": [
      "office"
    ],
    "tags": []
  },
  "🏣": {
    "description": "japanese post office",
    "names": [
      "post_office"
    ],
    "tags": []
  },
  "🏥": {
    "description": "hospital",
    "names": [
      "hospital"
    ],
    "tags": []
  },
  "🏦": {
    "description": "bank",
    "names": [
      "bank"
    ],
    "tags": []
  },
  "🏪": {
    "description": "convenience store",
    "names": [
      "convenience_store"
    ],
    "tags": []
  },
  "🏩": {
    "description": "love hotel",
    "names": [
      "love_hotel"
    ],
    "tags": []
  },
  "🏨": {
    "description": "hotel",
    "names": [
      "hotel"
    ],
    "tags": []
  },
  "💒": {
    "description": "wedding",
    "names": [
      "wedding"
    ],
    "tags": [
      "marriage"
    ]
  },
  "⛪": {
    "description": "church",
    "names": [
      "church"
    ],
    "tags": []
  },
  "🏬": {
    "description": "department store",
    "names": [
      "department_store"
    ],
    "tags": []
  },
  "🏤": {
    "description": "european post office",
    "names": [
      "european_post_office"
    ],
    "tags": []
  },
  "🌇": {
    "description": "sunset over buildings",
    "names": [
      "city_sunrise"
    ],
    "tags": []
  },
  "🌆": {
    "description": "cityscape at dusk",
    "names": [
      "city_sunset"
    ],
    "tags": []
  },
  "🏯": {
    "description": "japanese castle",
    "names": [
      "japanese_castle"
    ],
    "tags": []
  },
  "🏰": {
    "description": "european castle",
    "names": [
      "european_castle"
    ],
    "tags": []
  },
  "⛺": {
    "description": "tent",
    "names": [
      "tent"
    ],
    "tags": [
      "camping"
    ]
  },
  "🏭": {
    "description": "factory",
    "names": [
      "factory"
    ],
    "tags": []
  },
  "🗼": {
    "description": "tokyo tower",
    "names": [
      "tokyo_tower"
    ],
    "tags": []
  },
  "🗾": {
    "description": "silhouette of japan",
    "names": [
      "japan"
    ],
    "tags": []
  },
  "🗻": {
    "description": "mount fuji",
    "names": [
      "mount_fuji"
    ],
    "tags": []
  },
  "🌄": {
    "description": "sunrise over mountains",
    "names": [
      "sunrise_over_mountains"
    ],
    "tags": []
  },
  "🌅": {
    "description": "sunrise",
    "names": [
      "sunrise"
    ],
    "tags": []
  },
  "🌃": {
    "description": "night with stars",
    "names": [
      "night_with_stars"
    ],
    "tags": []
  },
  "🗽": {
    "description": "statue of liberty",
    "names": [
      "statue_of_liberty"
    ],
    "tags": []
  },
  "🌉": {
    "description": "bridge at night",
    "names": [
      "bridge_at_night"
    ],
    "tags": []
  },
  "🎠": {
    "description": "carousel horse",
    "names": [
      "carousel_horse"
    ],
    "tags": []
  },
  "🎡": {
    "description": "ferris wheel",
    "names": [
      "ferris_wheel"
    ],
    "tags": []
  },
  "⛲": {
    "description": "fountain",
    "names": [
      "fountain"
    ],
    "tags": []
  },
  "🎢": {
    "description": "roller coaster",
    "names": [
      "roller_coaster"
    ],
    "tags": []
  },
  "🚢": {
    "description": "ship",
    "names": [
      "ship"
    ],
    "tags": []
  },
  "⛵": {
    "description": "sailboat",
    "names": [
      "boat",
      "sailboat"
    ],
    "tags": []
  },
  "🚤": {
    "description": "speedboat",
    "names": [
      "speedboat"
    ],
    "tags": [
      "ship"
    ]
  },
  "🚣": {
    "description": "rowboat",
    "names": [
      "rowboat"
    ],
    "tags": []
  },
  "⚓": {
    "description": "anchor",
    "names": [
      "anchor"
    ],
    "tags": [
      "ship"
    ]
  },
  "🚀": {
    "description": "rocket",
    "names": [
      "rocket"
    ],
    "tags": [
      "ship",
      "launch"
    ]
  },
  "✈️": {
    "description": "airplane",
    "names": [
      "airplane"
    ],
    "tags": [
      "flight"
    ]
  },
  "💺": {
    "description": "seat",
    "names": [
      "seat"
    ],
    "tags": []
  },
  "🚁": {
    "description": "helicopter",
    "names": [
      "helicopter"
    ],
    "tags": []
  },
  "🚂": {
    "description": "steam locomotive",
    "names": [
      "steam_locomotive"
    ],
    "tags": [
      "train"
    ]
  },
  "🚊": {
    "description": "tram",
    "names": [
      "tram"
    ],
    "tags": []
  },
  "🚉": {
    "description": "station",
    "names": [
      "station"
    ],
    "tags": []
  },
  "🚞": {
    "description": "mountain railway",
    "names": [
      "mountain_railway"
    ],
    "tags": []
  },
  "🚆": {
    "description": "train",
    "names": [
      "train2"
    ],
    "tags": []
  },
  "🚄": {
    "description": "high-speed train",
    "names": [
      "bullettrain_side"
    ],
    "tags": [
      "train"
    ]
  },
  "🚅": {
    "description": "high-speed train with bullet nose",
    "names": [
      "bullettrain_front"
    ],
    "tags": [
      "train"
    ]
  },
  "🚈": {
    "description": "light rail",
    "names": [
      "light_rail"
    ],
    "tags": []
  },
  "🚇": {
    "description": "metro",
    "names": [
      "metro"
    ],
    "tags": []
  },
  "🚝": {
    "description": "monorail",
    "names": [
      "monorail"
    ],
    "tags": []
  },
  "🚋": {
    "description": "tram car",
    "names": [
      "train"
    ],
    "tags": []
  },
  "🚃": {
    "description": "railway car",
    "names": [
      "railway_car"
    ],
    "tags": []
  },
  "🚎": {
    "description": "trolleybus",
    "names": [
      "trolleybus"
    ],
    "tags": []
  },
  "🚌": {
    "description": "bus",
    "names": [
      "bus"
    ],
    "tags": []
  },
  "🚍": {
    "description": "oncoming bus",
    "names": [
      "oncoming_bus"
    ],
    "tags": []
  },
  "🚙": {
    "description": "recreational vehicle",
    "names": [
      "blue_car"
    ],
    "tags": []
  },
  "🚘": {
    "description": "oncoming automobile",
    "names": [
      "oncoming_automobile"
    ],
    "tags": []
  },
  "🚗": {
    "description": "automobile",
    "names": [
      "car",
      "red_car"
    ],
    "tags": []
  },
  "🚕": {
    "description": "taxi",
    "names": [
      "taxi"
    ],
    "tags": []
  },
  "🚖": {
    "description": "oncoming taxi",
    "names": [
      "oncoming_taxi"
    ],
    "tags": []
  },
  "🚛": {
    "description": "articulated lorry",
    "names": [
      "articulated_lorry"
    ],
    "tags": []
  },
  "🚚": {
    "description": "delivery truck",
    "names": [
      "truck"
    ],
    "tags": []
  },
  "🚨": {
    "description": "police cars revolving light",
    "names": [
      "rotating_light"
    ],
    "tags": [
      "911",
      "emergency"
    ]
  },
  "🚓": {
    "description": "police car",
    "names": [
      "police_car"
    ],
    "tags": []
  },
  "🚔": {
    "description": "oncoming police car",
    "names": [
      "oncoming_police_car"
    ],
    "tags": []
  },
  "🚒": {
    "description": "fire engine",
    "names": [
      "fire_engine"
    ],
    "tags": []
  },
  "🚑": {
    "description": "ambulance",
    "names": [
      "ambulance"
    ],
    "tags": []
  },
  "🚐": {
    "description": "minibus",
    "names": [
      "minibus"
    ],
    "tags": []
  },
  "🚲": {
    "description": "bicycle",
    "names": [
      "bike"
    ],
    "tags": [
      "bicycle"
    ]
  },
  "🚡": {
    "description": "aerial tramway",
    "names": [
      "aerial_tramway"
    ],
    "tags": []
  },
  "🚟": {
    "description": "suspension railway",
    "names": [
      "suspension_railway"
    ],
    "tags": []
  },
  "🚠": {
    "description": "mountain cableway",
    "names": [
      "mountain_cableway"
    ],
    "tags": []
  },
  "🚜": {
    "description": "tractor",
    "names": [
      "tractor"
    ],
    "tags": []
  },
  "💈": {
    "description": "barber pole",
    "names": [
      "barber"
    ],
    "tags": []
  },
  "🚏": {
    "description": "bus stop",
    "names": [
      "busstop"
    ],
    "tags": []
  },
  "🎫": {
    "description": "ticket",
    "names": [
      "ticket"
    ],
    "tags": []
  },
  "🚦": {
    "description": "vertical traffic light",
    "names": [
      "vertical_traffic_light"
    ],
    "tags": [
      "semaphore"
    ]
  },
  "🚥": {
    "description": "horizontal traffic light",
    "names": [
      "traffic_light"
    ],
    "tags": []
  },
  "⚠️": {
    "description": "warning sign",
    "names": [
      "warning"
    ],
    "tags": [
      "wip"
    ]
  },
  "🚧": {
    "description": "construction sign",
    "names": [
      "construction"
    ],
    "tags": [
      "wip"
    ]
  },
  "🔰": {
    "description": "japanese symbol for beginner",
    "names": [
      "beginner"
    ],
    "tags": []
  },
  "⛽": {
    "description": "fuel pump",
    "names": [
      "fuelpump"
    ],
    "tags": []
  },
  "🏮": {
    "description": "izakaya lantern",
    "names": [
      "izakaya_lantern",
      "lantern"
    ],
    "tags": []
  },
  "🎰": {
    "description": "slot machine",
    "names": [
      "slot_machine"
    ],
    "tags": []
  },
  "♨️": {
    "description": "hot springs",
    "names": [
      "hotsprings"
    ],
    "tags": []
  },
  "🗿": {
    "description": "moyai",
    "names": [
      "moyai"
    ],
    "tags": [
      "stone"
    ]
  },
  "🎪": {
    "description": "circus tent",
    "names": [
      "circus_tent"
    ],
    "tags": []
  },
  "🎭": {
    "description": "performing arts",
    "names": [
      "performing_arts"
    ],
    "tags": [
      "theater",
      "drama"
    ]
  },
  "📍": {
    "description": "round pushpin",
    "names": [
      "round_pushpin"
    ],
    "tags": [
      "location"
    ]
  },
  "🚩": {
    "description": "triangular flag on post",
    "names": [
      "triangular_flag_on_post"
    ],
    "tags": []
  },
  "🇯🇵": {
    "description": "regional indicator symbol letter j + regional indicator symbol letter p",
    "names": [
      "jp"
    ],
    "tags": [
      "japan"
    ]
  },
  "🇰🇷": {
    "description": "regional indicator symbol letter k + regional indicator symbol letter r",
    "names": [
      "kr"
    ],
    "tags": [
      "korea"
    ]
  },
  "🇩🇪": {
    "description": "regional indicator symbol letter d + regional indicator symbol letter e",
    "names": [
      "de"
    ],
    "tags": [
      "flag",
      "germany"
    ]
  },
  "🇨🇳": {
    "description": "regional indicator symbol letter c + regional indicator symbol letter n",
    "names": [
      "cn"
    ],
    "tags": [
      "china"
    ]
  },
  "🇺🇸": {
    "description": "regional indicator symbol letter u + regional indicator symbol letter s",
    "names": [
      "us"
    ],
    "tags": [
      "flag",
      "united",
      "america"
    ]
  },
  "🇫🇷": {
    "description": "regional indicator symbol letter f + regional indicator symbol letter r",
    "names": [
      "fr"
    ],
    "tags": [
      "france",
      "french"
    ]
  },
  "🇪🇸": {
    "description": "regional indicator symbol letter e + regional indicator symbol letter s",
    "names": [
      "es"
    ],
    "tags": [
      "spain"
    ]
  },
  "🇮🇹": {
    "description": "regional indicator symbol letter i + regional indicator symbol letter t",
    "names": [
      "it"
    ],
    "tags": [
      "italy"
    ]
  },
  "🇷🇺": {
    "description": "regional indicator symbol letter r + regional indicator symbol letter u",
    "names": [
      "ru"
    ],
    "tags": [
      "russia"
    ]
  },
  "🇬🇧": {
    "description": "regional indicator symbol letter g + regional indicator symbol letter b",
    "names": [
      "gb",
      "uk"
    ],
    "tags": [
      "flag",
      "british"
    ]
  },
  "1️⃣": {
    "description": "digit one + combining enclosing keycap",
    "names": [
      "one"
    ],
    "tags": []
  },
  "2️⃣": {
    "description": "digit two + combining enclosing keycap",
    "names": [
      "two"
    ],
    "tags": []
  },
  "3️⃣": {
    "description": "digit three + combining enclosing keycap",
    "names": [
      "three"
    ],
    "tags": []
  },
  "4️⃣": {
    "description": "digit four + combining enclosing keycap",
    "names": [
      "four"
    ],
    "tags": []
  },
  "5️⃣": {
    "description": "digit five + combining enclosing keycap",
    "names": [
      "five"
    ],
    "tags": []
  },
  "6️⃣": {
    "description": "digit six + combining enclosing keycap",
    "names": [
      "six"
    ],
    "tags": []
  },
  "7️⃣": {
    "description": "digit seven + combining enclosing keycap",
    "names": [
      "seven"
    ],
    "tags": []
  },
  "8️⃣": {
    "description": "digit eight + combining enclosing keycap",
    "names": [
      "eight"
    ],
    "tags": []
  },
  "9️⃣": {
    "description": "digit nine + combining enclosing keycap",
    "names": [
      "nine"
    ],
    "tags": []
  },
  "0️⃣": {
    "description": "digit zero + combining enclosing keycap",
    "names": [
      "zero"
    ],
    "tags": []
  },
  "🔟": {
    "description": "keycap ten",
    "names": [
      "keycap_ten"
    ],
    "tags": []
  },
  "🔢": {
    "description": "input symbol for numbers",
    "names": [
      "1234"
    ],
    "tags": [
      "numbers"
    ]
  },
  "#️⃣": {
    "description": "number sign + combining enclosing keycap",
    "names": [
      "hash"
    ],
    "tags": [
      "number"
    ]
  },
  "🔣": {
    "description": "input symbol for symbols",
    "names": [
      "symbols"
    ],
    "tags": []
  },
  "⬆️": {
    "description": "upwards black arrow",
    "names": [
      "arrow_up"
    ],
    "tags": []
  },
  "⬇️": {
    "description": "downwards black arrow",
    "names": [
      "arrow_down"
    ],
    "tags": []
  },
  "⬅️": {
    "description": "leftwards black arrow",
    "names": [
      "arrow_left"
    ],
    "tags": []
  },
  "➡️": {
    "description": "black rightwards arrow",
    "names": [
      "arrow_right"
    ],
    "tags": []
  },
  "🔠": {
    "description": "input symbol for latin capital letters",
    "names": [
      "capital_abcd"
    ],
    "tags": [
      "letters"
    ]
  },
  "🔡": {
    "description": "input symbol for latin small letters",
    "names": [
      "abcd"
    ],
    "tags": []
  },
  "🔤": {
    "description": "input symbol for latin letters",
    "names": [
      "abc"
    ],
    "tags": [
      "alphabet"
    ]
  },
  "↗️": {
    "description": "north east arrow",
    "names": [
      "arrow_upper_right"
    ],
    "tags": []
  },
  "↖️": {
    "description": "north west arrow",
    "names": [
      "arrow_upper_left"
    ],
    "tags": []
  },
  "↘️": {
    "description": "south east arrow",
    "names": [
      "arrow_lower_right"
    ],
    "tags": []
  },
  "↙️": {
    "description": "south west arrow",
    "names": [
      "arrow_lower_left"
    ],
    "tags": []
  },
  "↔️": {
    "description": "left right arrow",
    "names": [
      "left_right_arrow"
    ],
    "tags": []
  },
  "↕️": {
    "description": "up down arrow",
    "names": [
      "arrow_up_down"
    ],
    "tags": []
  },
  "🔄": {
    "description": "anticlockwise downwards and upwards open circle arrows",
    "names": [
      "arrows_counterclockwise"
    ],
    "tags": [
      "sync"
    ]
  },
  "◀️": {
    "description": "black left-pointing triangle",
    "names": [
      "arrow_backward"
    ],
    "tags": []
  },
  "▶️": {
    "description": "black right-pointing triangle",
    "names": [
      "arrow_forward"
    ],
    "tags": []
  },
  "🔼": {
    "description": "up-pointing small red triangle",
    "names": [
      "arrow_up_small"
    ],
    "tags": []
  },
  "🔽": {
    "description": "down-pointing small red triangle",
    "names": [
      "arrow_down_small"
    ],
    "tags": []
  },
  "↩️": {
    "description": "leftwards arrow with hook",
    "names": [
      "leftwards_arrow_with_hook"
    ],
    "tags": [
      "return"
    ]
  },
  "↪️": {
    "description": "rightwards arrow with hook",
    "names": [
      "arrow_right_hook"
    ],
    "tags": []
  },
  "ℹ️": {
    "description": "information source",
    "names": [
      "information_source"
    ],
    "tags": []
  },
  "⏪": {
    "description": "black left-pointing double triangle",
    "names": [
      "rewind"
    ],
    "tags": []
  },
  "⏩": {
    "description": "black right-pointing double triangle",
    "names": [
      "fast_forward"
    ],
    "tags": []
  },
  "⏫": {
    "description": "black up-pointing double triangle",
    "names": [
      "arrow_double_up"
    ],
    "tags": []
  },
  "⏬": {
    "description": "black down-pointing double triangle",
    "names": [
      "arrow_double_down"
    ],
    "tags": []
  },
  "⤵️": {
    "description": "arrow pointing rightwards then curving downwards",
    "names": [
      "arrow_heading_down"
    ],
    "tags": []
  },
  "⤴️": {
    "description": "arrow pointing rightwards then curving upwards",
    "names": [
      "arrow_heading_up"
    ],
    "tags": []
  },
  "🆗": {
    "description": "squared ok",
    "names": [
      "ok"
    ],
    "tags": [
      "yes"
    ]
  },
  "🔀": {
    "description": "twisted rightwards arrows",
    "names": [
      "twisted_rightwards_arrows"
    ],
    "tags": [
      "shuffle"
    ]
  },
  "🔁": {
    "description": "clockwise rightwards and leftwards open circle arrows",
    "names": [
      "repeat"
    ],
    "tags": [
      "loop"
    ]
  },
  "🔂": {
    "description": "clockwise rightwards and leftwards open circle arrows with circled one overlay",
    "names": [
      "repeat_one"
    ],
    "tags": []
  },
  "🆕": {
    "description": "squared new",
    "names": [
      "new"
    ],
    "tags": [
      "fresh"
    ]
  },
  "🆙": {
    "description": "squared up with exclamation mark",
    "names": [
      "up"
    ],
    "tags": []
  },
  "🆒": {
    "description": "squared cool",
    "names": [
      "cool"
    ],
    "tags": []
  },
  "🆓": {
    "description": "squared free",
    "names": [
      "free"
    ],
    "tags": []
  },
  "🆖": {
    "description": "squared ng",
    "names": [
      "ng"
    ],
    "tags": []
  },
  "📶": {
    "description": "antenna with bars",
    "names": [
      "signal_strength"
    ],
    "tags": [
      "wifi"
    ]
  },
  "🎦": {
    "description": "cinema",
    "names": [
      "cinema"
    ],
    "tags": [
      "film",
      "movie"
    ]
  },
  "🈁": {
    "description": "squared katakana koko",
    "names": [
      "koko"
    ],
    "tags": []
  },
  "🈯": {
    "description": "squared cjk unified ideograph-6307",
    "names": [
      "u6307"
    ],
    "tags": []
  },
  "🈳": {
    "description": "squared cjk unified ideograph-7a7a",
    "names": [
      "u7a7a"
    ],
    "tags": []
  },
  "🈵": {
    "description": "squared cjk unified ideograph-6e80",
    "names": [
      "u6e80"
    ],
    "tags": []
  },
  "🈴": {
    "description": "squared cjk unified ideograph-5408",
    "names": [
      "u5408"
    ],
    "tags": []
  },
  "🈲": {
    "description": "squared cjk unified ideograph-7981",
    "names": [
      "u7981"
    ],
    "tags": []
  },
  "🉐": {
    "description": "circled ideograph advantage",
    "names": [
      "ideograph_advantage"
    ],
    "tags": []
  },
  "🈹": {
    "description": "squared cjk unified ideograph-5272",
    "names": [
      "u5272"
    ],
    "tags": []
  },
  "🈺": {
    "description": "squared cjk unified ideograph-55b6",
    "names": [
      "u55b6"
    ],
    "tags": []
  },
  "🈶": {
    "description": "squared cjk unified ideograph-6709",
    "names": [
      "u6709"
    ],
    "tags": []
  },
  "🈚": {
    "description": "squared cjk unified ideograph-7121",
    "names": [
      "u7121"
    ],
    "tags": []
  },
  "🚻": {
    "description": "restroom",
    "names": [
      "restroom"
    ],
    "tags": [
      "toilet"
    ]
  },
  "🚹": {
    "description": "mens symbol",
    "names": [
      "mens"
    ],
    "tags": []
  },
  "🚺": {
    "description": "womens symbol",
    "names": [
      "womens"
    ],
    "tags": []
  },
  "🚼": {
    "description": "baby symbol",
    "names": [
      "baby_symbol"
    ],
    "tags": []
  },
  "🚾": {
    "description": "water closet",
    "names": [
      "wc"
    ],
    "tags": [
      "toilet",
      "restroom"
    ]
  },
  "🚰": {
    "description": "potable water symbol",
    "names": [
      "potable_water"
    ],
    "tags": []
  },
  "🚮": {
    "description": "put litter in its place symbol",
    "names": [
      "put_litter_in_its_place"
    ],
    "tags": []
  },
  "🅿️": {
    "description": "negative squared latin capital letter p",
    "names": [
      "parking"
    ],
    "tags": []
  },
  "♿": {
    "description": "wheelchair symbol",
    "names": [
      "wheelchair"
    ],
    "tags": [
      "accessibility"
    ]
  },
  "🚭": {
    "description": "no smoking symbol",
    "names": [
      "no_smoking"
    ],
    "tags": []
  },
  "🈷️": {
    "description": "squared cjk unified ideograph-6708",
    "names": [
      "u6708"
    ],
    "tags": []
  },
  "🈸": {
    "description": "squared cjk unified ideograph-7533",
    "names": [
      "u7533"
    ],
    "tags": []
  },
  "🈂️": {
    "description": "squared katakana sa",
    "names": [
      "sa"
    ],
    "tags": []
  },
  "Ⓜ️": {
    "description": "circled latin capital letter m",
    "names": [
      "m"
    ],
    "tags": []
  },
  "🛂": {
    "description": "passport control",
    "names": [
      "passport_control"
    ],
    "tags": []
  },
  "🛄": {
    "description": "baggage claim",
    "names": [
      "baggage_claim"
    ],
    "tags": [
      "airport"
    ]
  },
  "🛅": {
    "description": "left luggage",
    "names": [
      "left_luggage"
    ],
    "tags": []
  },
  "🛃": {
    "description": "customs",
    "names": [
      "customs"
    ],
    "tags": []
  },
  "🉑": {
    "description": "circled ideograph accept",
    "names": [
      "accept"
    ],
    "tags": []
  },
  "㊙️": {
    "description": "circled ideograph secret",
    "names": [
      "secret"
    ],
    "tags": []
  },
  "㊗️": {
    "description": "circled ideograph congratulation",
    "names": [
      "congratulations"
    ],
    "tags": []
  },
  "🆑": {
    "description": "squared cl",
    "names": [
      "cl"
    ],
    "tags": []
  },
  "🆘": {
    "description": "squared sos",
    "names": [
      "sos"
    ],
    "tags": [
      "help",
      "emergency"
    ]
  },
  "🆔": {
    "description": "squared id",
    "names": [
      "id"
    ],
    "tags": []
  },
  "🚫": {
    "description": "no entry sign",
    "names": [
      "no_entry_sign"
    ],
    "tags": [
      "block",
      "forbidden"
    ]
  },
  "🔞": {
    "description": "no one under eighteen symbol",
    "names": [
      "underage"
    ],
    "tags": []
  },
  "📵": {
    "description": "no mobile phones",
    "names": [
      "no_mobile_phones"
    ],
    "tags": []
  },
  "🚯": {
    "description": "do not litter symbol",
    "names": [
      "do_not_litter"
    ],
    "tags": []
  },
  "🚱": {
    "description": "non-potable water symbol",
    "names": [
      "non-potable_water"
    ],
    "tags": []
  },
  "🚳": {
    "description": "no bicycles",
    "names": [
      "no_bicycles"
    ],
    "tags": []
  },
  "🚷": {
    "description": "no pedestrians",
    "names": [
      "no_pedestrians"
    ],
    "tags": []
  },
  "🚸": {
    "description": "children crossing",
    "names": [
      "children_crossing"
    ],
    "tags": []
  },
  "⛔": {
    "description": "no entry",
    "names": [
      "no_entry"
    ],
    "tags": [
      "limit"
    ]
  },
  "✳️": {
    "description": "eight spoked asterisk",
    "names": [
      "eight_spoked_asterisk"
    ],
    "tags": []
  },
  "❇️": {
    "description": "sparkle",
    "names": [
      "sparkle"
    ],
    "tags": []
  },
  "❎": {
    "description": "negative squared cross mark",
    "names": [
      "negative_squared_cross_mark"
    ],
    "tags": []
  },
  "✅": {
    "description": "white heavy check mark",
    "names": [
      "white_check_mark"
    ],
    "tags": []
  },
  "✴️": {
    "description": "eight pointed black star",
    "names": [
      "eight_pointed_black_star"
    ],
    "tags": []
  },
  "💟": {
    "description": "heart decoration",
    "names": [
      "heart_decoration"
    ],
    "tags": []
  },
  "🆚": {
    "description": "squared vs",
    "names": [
      "vs"
    ],
    "tags": []
  },
  "📳": {
    "description": "vibration mode",
    "names": [
      "vibration_mode"
    ],
    "tags": []
  },
  "📴": {
    "description": "mobile phone off",
    "names": [
      "mobile_phone_off"
    ],
    "tags": [
      "mute",
      "off"
    ]
  },
  "🅰️": {
    "description": "negative squared latin capital letter a",
    "names": [
      "a"
    ],
    "tags": []
  },
  "🅱️": {
    "description": "negative squared latin capital letter b",
    "names": [
      "b"
    ],
    "tags": []
  },
  "🆎": {
    "description": "negative squared ab",
    "names": [
      "ab"
    ],
    "tags": []
  },
  "🅾️": {
    "description": "negative squared latin capital letter o",
    "names": [
      "o2"
    ],
    "tags": []
  },
  "💠": {
    "description": "diamond shape with a dot inside",
    "names": [
      "diamond_shape_with_a_dot_inside"
    ],
    "tags": []
  },
  "➿": {
    "description": "double curly loop",
    "names": [
      "loop"
    ],
    "tags": []
  },
  "♻️": {
    "description": "black universal recycling symbol",
    "names": [
      "recycle"
    ],
    "tags": [
      "environment",
      "green"
    ]
  },
  "♈": {
    "description": "aries",
    "names": [
      "aries"
    ],
    "tags": []
  },
  "♉": {
    "description": "taurus",
    "names": [
      "taurus"
    ],
    "tags": []
  },
  "♊": {
    "description": "gemini",
    "names": [
      "gemini"
    ],
    "tags": []
  },
  "♋": {
    "description": "cancer",
    "names": [
      "cancer"
    ],
    "tags": []
  },
  "♌": {
    "description": "leo",
    "names": [
      "leo"
    ],
    "tags": []
  },
  "♍": {
    "description": "virgo",
    "names": [
      "virgo"
    ],
    "tags": []
  },
  "♎": {
    "description": "libra",
    "names": [
      "libra"
    ],
    "tags": []
  },
  "♏": {
    "description": "scorpius",
    "names": [
      "scorpius"
    ],
    "tags": []
  },
  "♐": {
    "description": "sagittarius",
    "names": [
      "sagittarius"
    ],
    "tags": []
  },
  "♑": {
    "description": "capricorn",
    "names": [
      "capricorn"
    ],
    "tags": []
  },
  "♒": {
    "description": "aquarius",
    "names": [
      "aquarius"
    ],
    "tags": []
  },
  "♓": {
    "description": "pisces",
    "names": [
      "pisces"
    ],
    "tags": []
  },
  "⛎": {
    "description": "ophiuchus",
    "names": [
      "ophiuchus"
    ],
    "tags": []
  },
  "🔯": {
    "description": "six pointed star with middle dot",
    "names": [
      "six_pointed_star"
    ],
    "tags": []
  },
  "🏧": {
    "description": "automated teller machine",
    "names": [
      "atm"
    ],
    "tags": []
  },
  "💹": {
    "description": "chart with upwards trend and yen sign",
    "names": [
      "chart"
    ],
    "tags": []
  },
  "💲": {
    "description": "heavy dollar sign",
    "names": [
      "heavy_dollar_sign"
    ],
    "tags": []
  },
  "💱": {
    "description": "currency exchange",
    "names": [
      "currency_exchange"
    ],
    "tags": []
  },
  "©️": {
    "description": "copyright sign",
    "names": [
      "copyright"
    ],
    "tags": []
  },
  "®️": {
    "description": "registered sign",
    "names": [
      "registered"
    ],
    "tags": []
  },
  "™️": {
    "description": "trade mark sign",
    "names": [
      "tm"
    ],
    "tags": [
      "trademark"
    ]
  },
  "❌": {
    "description": "cross mark",
    "names": [
      "x"
    ],
    "tags": []
  },
  "‼️": {
    "description": "double exclamation mark",
    "names": [
      "bangbang"
    ],
    "tags": []
  },
  "⁉️": {
    "description": "exclamation question mark",
    "names": [
      "interrobang"
    ],
    "tags": []
  },
  "❗": {
    "description": "heavy exclamation mark symbol",
    "names": [
      "exclamation",
      "heavy_exclamation_mark"
    ],
    "tags": [
      "bang"
    ]
  },
  "❓": {
    "description": "black question mark ornament",
    "names": [
      "question"
    ],
    "tags": [
      "confused"
    ]
  },
  "❕": {
    "description": "white exclamation mark ornament",
    "names": [
      "grey_exclamation"
    ],
    "tags": []
  },
  "❔": {
    "description": "white question mark ornament",
    "names": [
      "grey_question"
    ],
    "tags": []
  },
  "⭕": {
    "description": "heavy large circle",
    "names": [
      "o"
    ],
    "tags": []
  },
  "🔝": {
    "description": "top with upwards arrow above",
    "names": [
      "top"
    ],
    "tags": []
  },
  "🔚": {
    "description": "end with leftwards arrow above",
    "names": [
      "end"
    ],
    "tags": []
  },
  "🔙": {
    "description": "back with leftwards arrow above",
    "names": [
      "back"
    ],
    "tags": []
  },
  "🔛": {
    "description": "on with exclamation mark with left right arrow above",
    "names": [
      "on"
    ],
    "tags": []
  },
  "🔜": {
    "description": "soon with rightwards arrow above",
    "names": [
      "soon"
    ],
    "tags": []
  },
  "🔃": {
    "description": "clockwise downwards and upwards open circle arrows",
    "names": [
      "arrows_clockwise"
    ],
    "tags": []
  },
  "🕛": {
    "description": "clock face twelve oclock",
    "names": [
      "clock12"
    ],
    "tags": []
  },
  "🕧": {
    "description": "clock face twelve-thirty",
    "names": [
      "clock1230"
    ],
    "tags": []
  },
  "🕐": {
    "description": "clock face one oclock",
    "names": [
      "clock1"
    ],
    "tags": []
  },
  "🕜": {
    "description": "clock face one-thirty",
    "names": [
      "clock130"
    ],
    "tags": []
  },
  "🕑": {
    "description": "clock face two oclock",
    "names": [
      "clock2"
    ],
    "tags": []
  },
  "🕝": {
    "description": "clock face two-thirty",
    "names": [
      "clock230"
    ],
    "tags": []
  },
  "🕒": {
    "description": "clock face three oclock",
    "names": [
      "clock3"
    ],
    "tags": []
  },
  "🕞": {
    "description": "clock face three-thirty",
    "names": [
      "clock330"
    ],
    "tags": []
  },
  "🕓": {
    "description": "clock face four oclock",
    "names": [
      "clock4"
    ],
    "tags": []
  },
  "🕟": {
    "description": "clock face four-thirty",
    "names": [
      "clock430"
    ],
    "tags": []
  },
  "🕔": {
    "description": "clock face five oclock",
    "names": [
      "clock5"
    ],
    "tags": []
  },
  "🕠": {
    "description": "clock face five-thirty",
    "names": [
      "clock530"
    ],
    "tags": []
  },
  "🕕": {
    "description": "clock face six oclock",
    "names": [
      "clock6"
    ],
    "tags": []
  },
  "🕖": {
    "description": "clock face seven oclock",
    "names": [
      "clock7"
    ],
    "tags": []
  },
  "🕗": {
    "description": "clock face eight oclock",
    "names": [
      "clock8"
    ],
    "tags": []
  },
  "🕘": {
    "description": "clock face nine oclock",
    "names": [
      "clock9"
    ],
    "tags": []
  },
  "🕙": {
    "description": "clock face ten oclock",
    "names": [
      "clock10"
    ],
    "tags": []
  },
  "🕚": {
    "description": "clock face eleven oclock",
    "names": [
      "clock11"
    ],
    "tags": []
  },
  "🕡": {
    "description": "clock face six-thirty",
    "names": [
      "clock630"
    ],
    "tags": []
  },
  "🕢": {
    "description": "clock face seven-thirty",
    "names": [
      "clock730"
    ],
    "tags": []
  },
  "🕣": {
    "description": "clock face eight-thirty",
    "names": [
      "clock830"
    ],
    "tags": []
  },
  "🕤": {
    "description": "clock face nine-thirty",
    "names": [
      "clock930"
    ],
    "tags": []
  },
  "🕥": {
    "description": "clock face ten-thirty",
    "names": [
      "clock1030"
    ],
    "tags": []
  },
  "🕦": {
    "description": "clock face eleven-thirty",
    "names": [
      "clock1130"
    ],
    "tags": []
  },
  "✖️": {
    "description": "heavy multiplication x",
    "names": [
      "heavy_multiplication_x"
    ],
    "tags": []
  },
  "➕": {
    "description": "heavy plus sign",
    "names": [
      "heavy_plus_sign"
    ],
    "tags": []
  },
  "➖": {
    "description": "heavy minus sign",
    "names": [
      "heavy_minus_sign"
    ],
    "tags": []
  },
  "➗": {
    "description": "heavy division sign",
    "names": [
      "heavy_division_sign"
    ],
    "tags": []
  },
  "♠️": {
    "description": "black spade suit",
    "names": [
      "spades"
    ],
    "tags": []
  },
  "♥️": {
    "description": "black heart suit",
    "names": [
      "hearts"
    ],
    "tags": []
  },
  "♣️": {
    "description": "black club suit",
    "names": [
      "clubs"
    ],
    "tags": []
  },
  "♦️": {
    "description": "black diamond suit",
    "names": [
      "diamonds"
    ],
    "tags": []
  },
  "💮": {
    "description": "white flower",
    "names": [
      "white_flower"
    ],
    "tags": []
  },
  "💯": {
    "description": "hundred points symbol",
    "names": [
      "100"
    ],
    "tags": [
      "score",
      "perfect"
    ]
  },
  "✔️": {
    "description": "heavy check mark",
    "names": [
      "heavy_check_mark"
    ],
    "tags": []
  },
  "☑️": {
    "description": "ballot box with check",
    "names": [
      "ballot_box_with_check"
    ],
    "tags": []
  },
  "🔘": {
    "description": "radio button",
    "names": [
      "radio_button"
    ],
    "tags": []
  },
  "🔗": {
    "description": "link symbol",
    "names": [
      "link"
    ],
    "tags": []
  },
  "➰": {
    "description": "curly loop",
    "names": [
      "curly_loop"
    ],
    "tags": []
  },
  "〰️": {
    "description": "wavy dash",
    "names": [
      "wavy_dash"
    ],
    "tags": []
  },
  "〽️": {
    "description": "part alternation mark",
    "names": [
      "part_alternation_mark"
    ],
    "tags": []
  },
  "🔱": {
    "description": "trident emblem",
    "names": [
      "trident"
    ],
    "tags": []
  },
  "◼️": {
    "description": "black medium square",
    "names": [
      "black_medium_square"
    ],
    "tags": []
  },
  "◻️": {
    "description": "white medium square",
    "names": [
      "white_medium_square"
    ],
    "tags": []
  },
  "◾": {
    "description": "black medium small square",
    "names": [
      "black_medium_small_square"
    ],
    "tags": []
  },
  "◽": {
    "description": "white medium small square",
    "names": [
      "white_medium_small_square"
    ],
    "tags": []
  },
  "▪️": {
    "description": "black small square",
    "names": [
      "black_small_square"
    ],
    "tags": []
  },
  "▫️": {
    "description": "white small square",
    "names": [
      "white_small_square"
    ],
    "tags": []
  },
  "🔺": {
    "description": "up-pointing red triangle",
    "names": [
      "small_red_triangle"
    ],
    "tags": []
  },
  "🔲": {
    "description": "black square button",
    "names": [
      "black_square_button"
    ],
    "tags": []
  },
  "🔳": {
    "description": "white square button",
    "names": [
      "white_square_button"
    ],
    "tags": []
  },
  "⚫": {
    "description": "medium black circle",
    "names": [
      "black_circle"
    ],
    "tags": []
  },
  "⚪": {
    "description": "medium white circle",
    "names": [
      "white_circle"
    ],
    "tags": []
  },
  "🔴": {
    "description": "large red circle",
    "names": [
      "red_circle"
    ],
    "tags": []
  },
  "🔵": {
    "description": "large blue circle",
    "names": [
      "large_blue_circle"
    ],
    "tags": []
  },
  "🔻": {
    "description": "down-pointing red triangle",
    "names": [
      "small_red_triangle_down"
    ],
    "tags": []
  },
  "⬜": {
    "description": "white large square",
    "names": [
      "white_large_square"
    ],
    "tags": []
  },
  "⬛": {
    "description": "black large square",
    "names": [
      "black_large_square"
    ],
    "tags": []
  },
  "🔶": {
    "description": "large orange diamond",
    "names": [
      "large_orange_diamond"
    ],
    "tags": []
  },
  "🔷": {
    "description": "large blue diamond",
    "names": [
      "large_blue_diamond"
    ],
    "tags": []
  },
  "🔸": {
    "description": "small orange diamond",
    "names": [
      "small_orange_diamond"
    ],
    "tags": []
  },
  "🔹": {
    "description": "small blue diamond",
    "names": [
      "small_blue_diamond"
    ],
    "tags": []
  }
}

},{}],7:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module gemoji
 * @fileoverview GitHub emoji: gemoji.
 */

'use strict';

/* Dependencies. */
var data = require('./data/gemoji.json');

/* Expose. */
exports.unicode = data;
exports.name = {};

/* Transform all emoji. */
var emoji;

for (emoji in data) {
  enhance(emoji);
}

/**
 * Transform an emoji.
 *
 * @param {string} character - Unicode emoji to extend.
 */
function enhance(character) {
  var information = data[character];
  var names = information.names;
  var length = names.length;
  var index = 0; /* first must be skipped. */

  /* Add the main `name` and the emoji. */
  information.name = names[0];
  information.emoji = character;

  /* Add names. */
  exports.name[names[0]] = information;

  while (++index < length) {
    exports.name[names[index]] = information;
  }
}

},{"./data/gemoji.json":6}],8:[function(require,module,exports){
var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":5}],9:[function(require,module,exports){
'use strict';

/* Dependencies. */
var modifier = require('unist-util-modify-children');

/* Expose. */
module.exports = modifier(mergeAffixEmoticon);

/* Constants: node types. */
var EMOTICON_NODE = 'EmoticonNode';

/* Merge emoticons into an `EmoticonNode`. */
function mergeAffixEmoticon(child, index, parent) {
  var children = child.children;
  var position;
  var node;
  var prev;

  if (children && children.length !== 0 && index !== 0) {
    position = -1;

    while (children[++position]) {
      node = children[position];

      if (node.type === EMOTICON_NODE) {
        prev = parent.children[index - 1];

        prev.children = prev.children.concat(
          children.slice(0, position + 1)
        );

        child.children = children.slice(position + 1);

        if (node.position && child.position && prev.position) {
          prev.position.end = child.position.start = node.position.end;
        }

        /* Next, iterate over the node again. */
        return index;
      }

      if (node.type !== 'WhiteSpaceNode') {
        break;
      }
    }
  }
}

},{"unist-util-modify-children":13}],10:[function(require,module,exports){
'use strict';

/* Dependencies. */
var has = require('has');
var toString = require('nlcst-to-string');
var modifier = require('unist-util-modify-children');
var gemoji = require('gemoji');

/* Expose. */
module.exports = modifier(mergeEmoji);

/* Node types. */
var EMOTICON_NODE = 'EmoticonNode';

/* Magic numbers.
 *
 * Gemoji's are treated by a parser as multiple nodes.
 * Because this modifier walks backwards, the first colon
 * never matches a gemoji it would normaly walk back to
 * the beginning (the first node). However, because the
 * longest gemoji is tokenized as `Punctuation` (`:`),
 * `Punctuation` (`+`), `Word` (`1`), and `Punctuation`
 * (`:`), we can safely break when the modifier walked
 * back more than 4 times. */
var MAX_GEMOJI_PART_COUNT = 12;

/* Constants. */
var shortcodes = [];
var unicodes = gemoji.unicode;
var byName = gemoji.name;
var key;

for (key in byName) {
  shortcodes.push(':' + key + ':');
}

/* Merge emoji and github-emoji (punctuation marks,
 * symbols, and words) into an `EmoticonNode`. */
function mergeEmoji(child, index, parent) {
  var siblings = parent.children;
  var siblingIndex;
  var node;
  var nodes;
  var value;
  var subvalue;
  var left;
  var right;
  var leftMatch;
  var rightMatch;
  var start;
  var pos;
  var end;
  var replace;

  if (child.type === 'WordNode') {
    value = toString(child);

    /* Sometimes a unicode emoji is marked as a
     * word. Mark it as an `EmoticonNode`. */
    if (has(unicodes, value)) {
      node = {type: EMOTICON_NODE, value: value};

      if (child.position) {
        node.position = child.position;
      }

      siblings[index] = node;
    } else {
      /* Sometimes a unicode emoji is split in two.
       * Remove the last and add its value to
       * the first. */
      node = siblings[index - 1];

      if (node && has(unicodes, toString(node) + value)) {
        node.type = EMOTICON_NODE;
        node.value = toString(node) + value;

        if (child.position && node.position) {
          node.position.end = child.position.end;
        }

        siblings.splice(index, 1);

        return index;
      }
    }
  } else if (has(unicodes, toString(child))) {
    child.type = EMOTICON_NODE;
  } else if (toString(child).charAt(0) === ':') {
    nodes = [];
    siblingIndex = index;
    subvalue = toString(child);
    left = right = leftMatch = rightMatch = null;

    if (subvalue.length === 1) {
      rightMatch = child;
    } else {
      end = child.position && child.position.end;
      start = end && child.position.start;
      pos = end && {
        line: start.line,
        column: start.column + 1,
        offset: start.offset + 1
      };

      rightMatch = {
        type: 'PunctuationNode',
        value: ':'
      };

      right = {
        type: 'PunctuationNode',
        value: subvalue.slice(1)
      };

      if (end) {
        rightMatch.position = {start: start, end: pos};
        right.position = {start: pos, end: end};
      }
    }

    while (siblingIndex--) {
      if ((index - siblingIndex) > MAX_GEMOJI_PART_COUNT) {
        return;
      }

      node = siblings[siblingIndex];

      subvalue = toString(node);

      if (subvalue.charAt(subvalue.length - 1) === ':') {
        leftMatch = node;
        break;
      }

      if (node.children) {
        nodes = nodes.concat(node.children.concat().reverse());
      } else {
        nodes.push(node);
      }

      if (siblingIndex === 0) {
        return;
      }
    }

    if (!leftMatch) {
      return;
    }

    subvalue = toString(leftMatch);

    if (subvalue.length !== 1) {
      end = leftMatch.position && leftMatch.position.end;
      start = end && leftMatch.position.start;
      pos = end && {
        line: end.line,
        column: end.column - 1,
        offset: end.offset - 1
      };

      left = {
        type: 'PunctuationNode',
        value: subvalue.slice(0, -1)
      };

      leftMatch = {
        type: 'PunctuationNode',
        value: ':'
      };

      if (end) {
        left.position = {start: start, end: pos};
        leftMatch.position = {start: pos, end: end};
      }
    }

    nodes.push(leftMatch);
    nodes.reverse().push(rightMatch);

    value = toString(nodes);

    if (shortcodes.indexOf(value) === -1) {
      return;
    }

    replace = [
      siblingIndex,
      index - siblingIndex + 1
    ];

    if (left) {
      replace.push(left);
    }

    child.type = EMOTICON_NODE;
    child.value = value;

    if (child.position && leftMatch.position) {
      child.position.start = leftMatch.position.start;
    }

    if (child.position && rightMatch.position) {
      child.position.end = rightMatch.position.end;
    }

    replace.push(child);

    if (right) {
      replace.push(right);
    }

    [].splice.apply(siblings, replace);

    return siblingIndex + 3;
  }
}

},{"gemoji":7,"has":8,"nlcst-to-string":12,"unist-util-modify-children":13}],11:[function(require,module,exports){
'use strict';

/* Dependencies. */
var toString = require('nlcst-to-string');
var modifier = require('unist-util-modify-children');
var raw = require('emoticon');

/* Expose. */
module.exports = modifier(mergeEmoticons);

/* Node types. */
var EMOTICON_NODE = 'EmoticonNode';

/* Magic numbers.
 *
 * Emoticons are treated by a parser as multiple nodes.
 * Because this modifier walks forwards, when a non-
 * emoticon matches it would normaly walk to the end
 * (the last node). However, because the longest emoticon
 * is tokenized as `Punctuation` (eyes), `Punctuation`
 * (a tear), `Punctuation` (another tear), `Punctuation`
 * (a nose), and `Punctuation` (a frowning mouth), we can
 * safely break when the modifier has walked 5 characters. */
var MAX_EMOTICON_LENGTH = 5;

/* Unpack. */
var emoticons = [];
var start = [];
var end = [];

unpack();

/* Merge emoticons into an `EmoticonNode`. */
function mergeEmoticons(child, index, parent) {
  var siblings;
  var value;
  var siblingIndex;
  var node;
  var emoticon;
  var subvalue;

  /* Check if `child`s first character could be used
   * to start an emoticon. */
  if (start.indexOf(toString(child).charAt(0)) !== -1) {
    siblings = parent.children;
    siblingIndex = index;
    node = child;
    value = '';

    while (node) {
      if (value.length >= MAX_EMOTICON_LENGTH) {
        return;
      }

      subvalue = toString(node);

      value += subvalue;

      /* The second test, if the last character of
       * the current node is superfluous but
       * improves performance by 30%. */
      if (
        node.type !== EMOTICON_NODE &&
        end.indexOf(subvalue.charAt(subvalue.length - 1)) !== -1 &&
        emoticons.indexOf(value) !== -1
      ) {
        emoticon = {type: EMOTICON_NODE, value: value};

        if (child.position && node.position) {
          emoticon.position = {
            start: child.position.start,
            end: node.position.end
          };
        }

        siblings.splice(index, siblingIndex - index + 1, emoticon);

        /* Some emoticons, like `:-`, can be followed by
         * more characters to form other emoticons. */
        return index - 1;
      }

      node = siblings[++siblingIndex];
    }
  }
}

function unpack() {
  var length = raw.length;
  var index = -1;
  var subset;
  var offset;
  var count;
  var subvalue;
  var char;

  while (++index < length) {
    subset = raw[index].emoticons;
    count = subset.length;
    offset = -1;

    while (++offset < count) {
      subvalue = subset[offset];

      emoticons.push(subvalue);

      char = subvalue.charAt(0);
      if (start.indexOf(char) === -1) {
        start.push(char);
      }

      char = subvalue.charAt(subvalue.length - 1);
      if (end.indexOf(char) === -1) {
        end.push(char);
      }
    }
  }
}

},{"emoticon":3,"nlcst-to-string":12,"unist-util-modify-children":13}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"array-iterate":2}],14:[function(require,module,exports){
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