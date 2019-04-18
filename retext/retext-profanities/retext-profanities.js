(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.retextProfanities = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var keys = require('object-keys');
var difference = require('lodash.difference');
var intersection = require('lodash.intersection');
var pluralize = require('pluralize');
var nlcstToString = require('nlcst-to-string');
var quotation = require('quotation');
var search = require('nlcst-search');
var cuss = require('cuss');

/* Misclassified singulars and plurals. */
var skip = [
  'dy', /* Singular of `dies`. */
  'pro', /* Singular of `pros`. */
  'so', /* Singular of `sos`. */
  'dice', /* Plural of `die`. */
  'fus' /* Plural of `fu`. */
];

module.exports = profanities;

var words = unpack(cuss);

/* List of values not to normalize. */
var APOSTROPHES = ['hell'];

/* Map of `cuss` ratings to prefixes. */
var PREFIX = [
  'Be careful with',
  'Reconsider using',
  'Don’t use'
];

/* Map of `cuss` ratings to suffixes. */
var SUFFIX = [
  'it’s profane in some cases',
  'it may be profane',
  'it’s profane'
];

function profanities(options) {
  var ignore = (options || {}).ignore || [];
  var phrases = difference(keys(words), ignore);
  var apostrophes = difference(phrases, APOSTROPHES);
  var noApostrophes = intersection(APOSTROPHES, phrases);

  return transformer;

  /* Search for violations. */
  function transformer(tree, file) {
    search(tree, apostrophes, handle);
    search(tree, noApostrophes, handle, true);

    /* Handle a match. */
    function handle(match, position, parent, phrase) {
      var rating = words[phrase];
      var value = nlcstToString(match);

      var message = file.warn([
        PREFIX[rating],
        quotation(value, '“', '”') + ',',
        SUFFIX[rating]
      ].join(' '), {
        start: match[0].position.start,
        end: match[match.length - 1].position.end
      });

      message.ruleId = phrase.replace(/\W+/g, '-');
      message.profanitySeverity = rating;
      message.source = 'retext-profanities';
      message.actual = value;
      message.expected = null;
    }
  }
}

function unpack(map) {
  var result = {};
  var key;
  var rating;

  for (key in map) {
    rating = map[key];
    add(key, rating);
    add(pluralize.singular(key), rating);
    add(pluralize.plural(key), rating);
  }

  function add(key, value) {
    if (skip.indexOf(key) === -1) {
      result[key] = value;
    }
  }

  return result;
}

},{"cuss":2,"lodash.difference":3,"lodash.intersection":4,"nlcst-search":7,"nlcst-to-string":8,"object-keys":9,"pluralize":11,"quotation":12}],2:[function(require,module,exports){
module.exports={
  "abbo": 1,
  "abeed": 2,
  "abid": 1,
  "abo": 1,
  "abortion": 1,
  "abuse": 1,
  "addict": 1,
  "addicts": 1,
  "adult": 0,
  "africa": 0,
  "african": 0,
  "africoon": 2,
  "alla": 1,
  "allah": 0,
  "alligator bait": 2,
  "alligatorbait": 2,
  "amateur": 0,
  "american": 0,
  "anal": 1,
  "analannie": 2,
  "analsex": 1,
  "angie": 0,
  "angry": 0,
  "anus": 1,
  "arab": 0,
  "arabs": 0,
  "arabush": 2,
  "arabushs": 2,
  "areola": 1,
  "argie": 2,
  "armo": 2,
  "armos": 2,
  "aroused": 0,
  "arse": 2,
  "arsehole": 2,
  "asian": 0,
  "ass": 2,
  "assassin": 0,
  "assassinate": 0,
  "assassination": 0,
  "assault": 0,
  "assbagger": 2,
  "assblaster": 2,
  "assclown": 2,
  "asscowboy": 2,
  "asses": 2,
  "assfuck": 2,
  "assfucker": 2,
  "asshat": 2,
  "asshole": 2,
  "assholes": 2,
  "asshore": 2,
  "assjockey": 2,
  "asskiss": 2,
  "asskisser": 2,
  "assklown": 2,
  "asslick": 2,
  "asslicker": 2,
  "asslover": 2,
  "assman": 2,
  "assmonkey": 2,
  "assmunch": 2,
  "assmuncher": 2,
  "asspacker": 2,
  "asspirate": 2,
  "asspuppies": 2,
  "assranger": 2,
  "asswhore": 2,
  "asswipe": 2,
  "athletesfoot": 1,
  "attack": 0,
  "australian": 0,
  "babe": 1,
  "babies": 0,
  "backdoor": 0,
  "backdoorman": 2,
  "backseat": 0,
  "badfuck": 2,
  "balllicker": 2,
  "balls": 1,
  "ballsack": 1,
  "banana": 0,
  "bananas": 0,
  "banging": 1,
  "baptist": 0,
  "barelylegal": 2,
  "barf": 2,
  "barface": 2,
  "barfface": 2,
  "bast": 0,
  "bastard": 1,
  "bazongas": 2,
  "bazooms": 2,
  "beanbag": 2,
  "beanbags": 2,
  "beaner": 2,
  "beaners": 2,
  "beaney": 2,
  "beaneys": 2,
  "beast": 0,
  "beastality": 1,
  "beastial": 1,
  "beastiality": 1,
  "beatoff": 2,
  "beatyourmeat": 2,
  "beaver": 0,
  "bestial": 1,
  "bestiality": 1,
  "bi": 0,
  "biatch": 2,
  "bible": 0,
  "bicurious": 1,
  "bigass": 2,
  "bigbastard": 2,
  "bigbutt": 2,
  "bigger": 0,
  "bisexual": 0,
  "bitch": 1,
  "bitcher": 2,
  "bitches": 1,
  "bitchez": 2,
  "bitchin": 2,
  "bitching": 2,
  "bitchslap": 2,
  "bitchy": 2,
  "biteme": 2,
  "black": 0,
  "blackman": 1,
  "blackout": 0,
  "blacks": 1,
  "blind": 0,
  "blow": 0,
  "blowjob": 2,
  "bluegum": 2,
  "bluegums": 2,
  "boang": 2,
  "boche": 2,
  "boches": 2,
  "bogan": 2,
  "bohunk": 2,
  "bollick": 2,
  "bollock": 2,
  "bomb": 0,
  "bombers": 0,
  "bombing": 0,
  "bombs": 0,
  "bomd": 0,
  "bondage": 1,
  "boner": 2,
  "bong": 2,
  "boob": 1,
  "boobies": 2,
  "boobs": 1,
  "booby": 2,
  "boody": 2,
  "boom": 0,
  "boong": 2,
  "boonga": 2,
  "boongas": 2,
  "boongs": 2,
  "boonie": 2,
  "boonies": 2,
  "bootlip": 2,
  "bootlips": 2,
  "booty": 2,
  "bootycall": 2,
  "bosch": 0,
  "bosche": 2,
  "bosches": 2,
  "boschs": 2,
  "bounty bar": 1,
  "bounty bars": 1,
  "bountybar": 1,
  "bra": 0,
  "brea5t": 2,
  "breast": 0,
  "breastjob": 2,
  "breastlover": 2,
  "breastman": 2,
  "brothel": 1,
  "brownie": 0,
  "brownies": 0,
  "buddhahead": 2,
  "buddhaheads": 2,
  "buffies": 2,
  "buffy": 0,
  "bugger": 2,
  "buggered": 2,
  "buggery": 2,
  "bule": 2,
  "bules": 2,
  "bullcrap": 2,
  "bulldike": 2,
  "bulldyke": 2,
  "bullshit": 2,
  "bumblefuck": 2,
  "bumfuck": 2,
  "bung": 2,
  "bunga": 2,
  "bungas": 2,
  "bunghole": 2,
  "buried": 0,
  "burn": 0,
  "burr head": 2,
  "burr heads": 2,
  "burrhead": 2,
  "burrheads": 2,
  "butchbabes": 2,
  "butchdike": 2,
  "butchdyke": 2,
  "butt": 0,
  "buttbang": 2,
  "buttface": 2,
  "buttfuck": 2,
  "buttfucker": 2,
  "buttfuckers": 2,
  "butthead": 2,
  "buttman": 2,
  "buttmunch": 2,
  "buttmuncher": 2,
  "buttpirate": 2,
  "buttplug": 1,
  "buttstain": 2,
  "byatch": 2,
  "cacker": 2,
  "camel jockey": 2,
  "camel jockeys": 2,
  "cameljockey": 2,
  "cameltoe": 2,
  "canadian": 0,
  "cancer": 0,
  "carpetmuncher": 2,
  "carruth": 2,
  "catholic": 0,
  "catholics": 0,
  "cemetery": 0,
  "chav": 2,
  "cheese eating surrender monkey": 2,
  "cheese eating surrender monkies": 2,
  "cheeseeating surrender monkey": 2,
  "cheeseeating surrender monkies": 2,
  "cheesehead": 2,
  "cheeseheads": 2,
  "cherrypopper": 2,
  "chickslick": 2,
  "childrens": 0,
  "chin": 0,
  "china swede": 2,
  "china swedes": 2,
  "chinaman": 2,
  "chinamen": 2,
  "chinaswede": 2,
  "chinaswedes": 2,
  "chinese": 0,
  "chingchong": 2,
  "chingchongs": 2,
  "ching chong": 2,
  "ching chongs": 2,
  "chink": 2,
  "chinks": 2,
  "chinky": 2,
  "choad": 2,
  "chode": 2,
  "chonkies": 2,
  "chonky": 2,
  "chonkys": 2,
  "christ": 0,
  "christ killer": 2,
  "christ killers": 2,
  "christian": 0,
  "chug": 2,
  "chugs": 2,
  "chunger": 2,
  "chungers": 2,
  "chunkies": 2,
  "chunky": 2,
  "chunkys": 2,
  "church": 0,
  "cigarette": 0,
  "cigs": 0,
  "clamdigger": 2,
  "clamdiver": 2,
  "clansman": 2,
  "clansmen": 2,
  "clanswoman": 2,
  "clanswomen": 2,
  "clit": 1,
  "clitoris": 1,
  "clogwog": 2,
  "cocaine": 1,
  "cock": 1,
  "cockblock": 2,
  "cockblocker": 2,
  "cockcowboy": 2,
  "cockfight": 2,
  "cockhead": 2,
  "cockknob": 2,
  "cocklicker": 2,
  "cocklover": 2,
  "cocknob": 2,
  "cockqueen": 2,
  "cockrider": 2,
  "cocksman": 2,
  "cocksmith": 2,
  "cocksmoker": 2,
  "cocksucer": 2,
  "cocksuck": 2,
  "cocksucked": 2,
  "cocksucker": 2,
  "cocksucking": 2,
  "cocktail": 0,
  "cocktease": 2,
  "cocky": 2,
  "coconut": 0,
  "coconuts": 0,
  "cohee": 2,
  "coitus": 1,
  "color": 0,
  "colored": 0,
  "coloured": 0,
  "commie": 2,
  "communist": 0,
  "condom": 1,
  "conservative": 0,
  "conspiracy": 0,
  "coolie": 2,
  "coolies": 2,
  "cooly": 2,
  "coon": 2,
  "coon ass": 2,
  "coon asses": 2,
  "coonass": 2,
  "coonasses": 2,
  "coondog": 2,
  "coons": 2,
  "copulate": 1,
  "cornhole": 2,
  "corruption": 0,
  "cra5h": 1,
  "crabs": 0,
  "crack": 1,
  "crackpipe": 1,
  "crackwhore": 2,
  "crap": 2,
  "crapola": 2,
  "crapper": 2,
  "crappy": 2,
  "crash": 0,
  "creamy": 0,
  "crime": 0,
  "crimes": 0,
  "criminal": 0,
  "criminals": 0,
  "crotch": 1,
  "crotchjockey": 2,
  "crotchmonkey": 2,
  "crotchrot": 2,
  "cum": 2,
  "cumbubble": 2,
  "cumfest": 2,
  "cumjockey": 2,
  "cumm": 2,
  "cummer": 2,
  "cumming": 2,
  "cumquat": 2,
  "cumqueen": 2,
  "cumshot": 2,
  "cunilingus": 1,
  "cunillingus": 1,
  "cunn": 2,
  "cunnilingus": 1,
  "cunntt": 2,
  "cunt": 2,
  "cunteyed": 2,
  "cuntfuck": 2,
  "cuntfucker": 2,
  "cuntlick": 2,
  "cuntlicker": 2,
  "cuntlicking": 2,
  "cuntsucker": 2,
  "curry muncher": 2,
  "curry munchers": 2,
  "currymuncher": 2,
  "currymunchers": 2,
  "cushi": 2,
  "cushis": 2,
  "cybersex": 1,
  "cyberslimer": 2,
  "dago": 2,
  "dagos": 2,
  "dahmer": 2,
  "dammit": 2,
  "damn": 1,
  "damnation": 1,
  "damnit": 2,
  "darkey": 2,
  "darkeys": 2,
  "darkie": 2,
  "darkies": 2,
  "darky": 2,
  "datnigga": 2,
  "dead": 0,
  "deapthroat": 2,
  "death": 0,
  "deepthroat": 2,
  "defecate": 1,
  "dego": 2,
  "degos": 2,
  "demon": 1,
  "deposit": 0,
  "desire": 0,
  "destroy": 0,
  "deth": 0,
  "devil": 1,
  "devilworshipper": 1,
  "diaperhead": 2,
  "diaperheads": 2,
  "diaper head": 2,
  "diaper heads": 2,
  "dick": 1,
  "dickbrain": 2,
  "dickforbrains": 2,
  "dickhead": 2,
  "dickless": 2,
  "dicklick": 2,
  "dicklicker": 2,
  "dickman": 2,
  "dickwad": 2,
  "dickweed": 2,
  "diddle": 2,
  "die": 0,
  "died": 0,
  "dies": 0,
  "dike": 1,
  "dildo": 1,
  "dingleberry": 2,
  "dink": 2,
  "dinks": 2,
  "dipshit": 2,
  "dipstick": 2,
  "dirty": 0,
  "disease": 0,
  "diseases": 0,
  "disturbed": 0,
  "dive": 0,
  "dix": 2,
  "dixiedike": 2,
  "dixiedyke": 2,
  "doggiestyle": 2,
  "doggystyle": 2,
  "dong": 2,
  "doodoo": 2,
  "doom": 0,
  "dope": 2,
  "dot head": 2,
  "dot heads": 2,
  "dothead": 2,
  "dotheads": 2,
  "dragqueen": 2,
  "dragqween": 2,
  "dripdick": 2,
  "drug": 1,
  "drunk": 1,
  "drunken": 1,
  "dumb": 2,
  "dumbass": 2,
  "dumbbitch": 2,
  "dumbfuck": 2,
  "dune coon": 2,
  "dune coons": 2,
  "dyefly": 2,
  "dyke": 1,
  "easyslut": 2,
  "eatballs": 2,
  "eatme": 2,
  "eatpussy": 2,
  "ecstacy": 0,
  "eight ball": 2,
  "eight balls": 2,
  "ejaculate": 1,
  "ejaculated": 1,
  "ejaculating": 1,
  "ejaculation": 1,
  "enema": 1,
  "enemy": 0,
  "erect": 0,
  "erection": 1,
  "ero": 2,
  "escort": 0,
  "esqua": 2,
  "ethiopian": 0,
  "ethnic": 0,
  "european": 0,
  "evl": 2,
  "excrement": 1,
  "execute": 0,
  "executed": 0,
  "execution": 0,
  "executioner": 0,
  "exkwew": 2,
  "explosion": 0,
  "facefucker": 2,
  "faeces": 2,
  "fag": 1,
  "fagging": 2,
  "faggot": 2,
  "fagot": 2,
  "failed": 0,
  "failure": 0,
  "fairies": 0,
  "fairy": 0,
  "faith": 0,
  "fannyfucker": 2,
  "fart": 1,
  "farted": 1,
  "farting": 1,
  "farty": 2,
  "fastfuck": 2,
  "fat": 0,
  "fatah": 2,
  "fatass": 2,
  "fatfuck": 2,
  "fatfucker": 2,
  "fatso": 2,
  "fckcum": 2,
  "fear": 0,
  "feces": 1,
  "felatio": 1,
  "felch": 2,
  "felcher": 2,
  "felching": 2,
  "fellatio": 2,
  "feltch": 2,
  "feltcher": 2,
  "feltching": 2,
  "fetish": 1,
  "fight": 0,
  "filipina": 0,
  "filipino": 0,
  "fingerfood": 1,
  "fingerfuck": 2,
  "fingerfucked": 2,
  "fingerfucker": 2,
  "fingerfuckers": 2,
  "fingerfucking": 2,
  "fire": 0,
  "firing": 0,
  "fister": 2,
  "fistfuck": 2,
  "fistfucked": 2,
  "fistfucker": 2,
  "fistfucking": 2,
  "fisting": 2,
  "flange": 2,
  "flasher": 1,
  "flatulence": 1,
  "floo": 2,
  "flydie": 2,
  "flydye": 2,
  "fok": 2,
  "fondle": 1,
  "footaction": 1,
  "footfuck": 2,
  "footfucker": 2,
  "footlicker": 2,
  "footstar": 2,
  "fore": 0,
  "foreskin": 1,
  "forni": 2,
  "fornicate": 1,
  "foursome": 1,
  "fourtwenty": 1,
  "fraud": 0,
  "freakfuck": 2,
  "freakyfucker": 2,
  "freefuck": 2,
  "fruitcake": 1,
  "fu": 2,
  "fubar": 2,
  "fuc": 2,
  "fucck": 2,
  "fuck": 2,
  "fucka": 2,
  "fuckable": 2,
  "fuckbag": 2,
  "fuckbook": 2,
  "fuckbuddy": 2,
  "fucked": 2,
  "fuckedup": 2,
  "fucker": 2,
  "fuckers": 2,
  "fuckface": 2,
  "fuckfest": 2,
  "fuckfreak": 2,
  "fuckfriend": 2,
  "fuckhead": 2,
  "fuckher": 2,
  "fuckin": 2,
  "fuckina": 2,
  "fucking": 2,
  "fuckingbitch": 2,
  "fuckinnuts": 2,
  "fuckinright": 2,
  "fuckit": 2,
  "fuckknob": 2,
  "fuckme": 2,
  "fuckmehard": 2,
  "fuckmonkey": 2,
  "fuckoff": 2,
  "fuckpig": 2,
  "fucks": 2,
  "fucktard": 2,
  "fuckwhore": 2,
  "fuckyou": 2,
  "fudgepacker": 2,
  "fugly": 2,
  "fuk": 2,
  "fuks": 2,
  "funeral": 0,
  "funfuck": 2,
  "fungus": 0,
  "fuuck": 2,
  "gable": 1,
  "gables": 2,
  "gangbang": 2,
  "gangbanged": 2,
  "gangbanger": 2,
  "gangsta": 2,
  "gator bait": 2,
  "gatorbait": 2,
  "gay": 0,
  "gaymuthafuckinwhore": 2,
  "gaysex": 2,
  "geez": 2,
  "geezer": 2,
  "geni": 2,
  "genital": 1,
  "german": 0,
  "getiton": 2,
  "gin": 0,
  "ginzo": 2,
  "ginzos": 2,
  "gipp": 2,
  "gippo": 2,
  "gippos": 2,
  "gipps": 2,
  "girls": 0,
  "givehead": 2,
  "glazeddonut": 2,
  "gob": 1,
  "god": 1,
  "godammit": 2,
  "goddamit": 2,
  "goddammit": 2,
  "goddamn": 2,
  "goddamned": 2,
  "goddamnes": 2,
  "goddamnit": 2,
  "goddamnmuthafucker": 2,
  "goldenshower": 2,
  "golliwog": 2,
  "golliwogs": 2,
  "gonorrehea": 2,
  "gonzagas": 1,
  "gook": 2,
  "gook eye": 2,
  "gook eyes": 2,
  "gookeye": 2,
  "gookeyes": 2,
  "gookies": 2,
  "gooks": 2,
  "gooky": 2,
  "gora": 2,
  "goras": 2,
  "gotohell": 2,
  "goy": 1,
  "goyim": 1,
  "greaseball": 2,
  "greaseballs": 2,
  "greaser": 2,
  "greasers": 2,
  "gringo": 2,
  "gringos": 2,
  "groe": 1,
  "groid": 2,
  "groids": 2,
  "gross": 1,
  "grostulation": 1,
  "gub": 1,
  "gubba": 2,
  "gubbas": 2,
  "gubs": 2,
  "guinea": 1,
  "guineas": 1,
  "guizi": 1,
  "gummer": 2,
  "gun": 0,
  "gwailo": 2,
  "gwailos": 2,
  "gweilo": 2,
  "gweilos": 2,
  "gyopo": 2,
  "gyopos": 2,
  "gyp": 2,
  "gyped": 2,
  "gypo": 2,
  "gypos": 2,
  "gypp": 2,
  "gypped": 2,
  "gyppie": 2,
  "gyppies": 2,
  "gyppo": 2,
  "gyppos": 2,
  "gyppy": 2,
  "gyppys": 2,
  "gypsies": 2,
  "gypsy": 2,
  "gypsys": 2,
  "hadji": 2,
  "hadjis": 2,
  "hairyback": 2,
  "hairybacks": 2,
  "haji": 2,
  "hajis": 2,
  "hajji": 2,
  "hajjis": 2,
  "halfbreed": 2,
  "half breed": 2,
  "halfcaste": 2,
  "half caste": 2,
  "hamas": 1,
  "handjob": 2,
  "haole": 2,
  "haoles": 2,
  "hapa": 2,
  "harder": 0,
  "hardon": 2,
  "harem": 0,
  "headfuck": 2,
  "headlights": 0,
  "hebe": 2,
  "hebes": 2,
  "hebephila": 1,
  "hebephile": 1,
  "hebephiles": 1,
  "hebephilia": 1,
  "hebephilic": 1,
  "heeb": 2,
  "heebs": 2,
  "hell": 0,
  "henhouse": 0,
  "heroin": 1,
  "herpes": 1,
  "heterosexual": 0,
  "hijack": 0,
  "hijacker": 0,
  "hijacking": 0,
  "hillbillies": 2,
  "hillbilly": 2,
  "hindoo": 2,
  "hiscock": 2,
  "hitler": 1,
  "hitlerism": 2,
  "hitlerist": 2,
  "hiv": 1,
  "ho": 2,
  "hobo": 2,
  "hodgie": 2,
  "hoes": 2,
  "hole": 0,
  "holestuffer": 2,
  "homicide": 1,
  "homo": 2,
  "homobangers": 2,
  "homosexual": 1,
  "honger": 2,
  "honk": 0,
  "honkers": 2,
  "honkey": 2,
  "honkeys": 2,
  "honkie": 2,
  "honkies": 2,
  "honky": 2,
  "hook": 0,
  "hooker": 2,
  "hookers": 2,
  "hooters": 2,
  "hore": 2,
  "hori": 2,
  "horis": 2,
  "hork": 2,
  "horn": 0,
  "horney": 2,
  "horniest": 2,
  "horny": 1,
  "horseshit": 2,
  "hosejob": 2,
  "hoser": 2,
  "hostage": 0,
  "hotdamn": 2,
  "hotpussy": 2,
  "hottotrot": 2,
  "hummer": 0,
  "hun": 0,
  "huns": 0,
  "husky": 0,
  "hussy": 2,
  "hustler": 0,
  "hymen": 1,
  "hymie": 2,
  "hymies": 2,
  "iblowu": 2,
  "idiot": 2,
  "ike": 1,
  "ikes": 1,
  "ikey": 1,
  "ikeymo": 2,
  "ikeymos": 2,
  "ikwe": 2,
  "illegal": 0,
  "illegals": 1,
  "incest": 1,
  "indon": 2,
  "indons": 2,
  "injun": 2,
  "injuns": 2,
  "insest": 2,
  "intercourse": 1,
  "interracial": 1,
  "intheass": 2,
  "inthebuff": 2,
  "israel": 0,
  "israeli": 0,
  "israels": 0,
  "italiano": 1,
  "itch": 0,
  "jackass": 2,
  "jackoff": 2,
  "jackshit": 2,
  "jacktheripper": 2,
  "jade": 0,
  "jap": 2,
  "japanese": 0,
  "japcrap": 2,
  "japie": 2,
  "japies": 2,
  "japs": 2,
  "jebus": 2,
  "jeez": 2,
  "jerkoff": 2,
  "jerries": 1,
  "jerry": 0,
  "jesus": 1,
  "jesuschrist": 1,
  "jew": 0,
  "jewed": 2,
  "jewess": 2,
  "jewish": 0,
  "jig": 2,
  "jiga": 2,
  "jigaboo": 2,
  "jigaboos": 2,
  "jigarooni": 2,
  "jigaroonis": 2,
  "jigg": 2,
  "jigga": 2,
  "jiggabo": 2,
  "jiggabos": 2,
  "jiggas": 2,
  "jigger": 2,
  "jiggers": 2,
  "jiggs": 2,
  "jiggy": 2,
  "jigs": 2,
  "jihad": 1,
  "jijjiboo": 2,
  "jijjiboos": 2,
  "jimfish": 2,
  "jism": 2,
  "jiz": 2,
  "jizim": 2,
  "jizjuice": 2,
  "jizm": 2,
  "jizz": 2,
  "jizzim": 2,
  "jizzum": 2,
  "joint": 0,
  "juggalo": 2,
  "jugs": 0,
  "jungle bunnies": 2,
  "jungle bunny": 2,
  "junglebunny": 2,
  "kacap": 2,
  "kacapas": 2,
  "kacaps": 2,
  "kaffer": 2,
  "kaffir": 2,
  "kaffre": 2,
  "kafir": 2,
  "kanake": 2,
  "katsap": 2,
  "katsaps": 2,
  "khokhol": 2,
  "khokhols": 2,
  "kid": 0,
  "kigger": 2,
  "kike": 2,
  "kikes": 2,
  "kill": 0,
  "killed": 0,
  "killer": 0,
  "killing": 0,
  "kills": 0,
  "kimchi": 0,
  "kimchis": 2,
  "kink": 1,
  "kinky": 1,
  "kissass": 2,
  "kkk": 2,
  "klansman": 2,
  "klansmen": 2,
  "klanswoman": 2,
  "klanswomen": 2,
  "knife": 0,
  "knockers": 1,
  "kock": 1,
  "kondum": 2,
  "koon": 2,
  "kotex": 1,
  "krap": 2,
  "krappy": 2,
  "kraut": 1,
  "krauts": 2,
  "kuffar": 2,
  "kum": 2,
  "kumbubble": 2,
  "kumbullbe": 2,
  "kummer": 2,
  "kumming": 2,
  "kumquat": 2,
  "kums": 2,
  "kunilingus": 2,
  "kunnilingus": 2,
  "kunt": 2,
  "kushi": 2,
  "kushis": 2,
  "kwa": 2,
  "kwai lo": 2,
  "kwai los": 2,
  "ky": 1,
  "kyke": 2,
  "kykes": 2,
  "kyopo": 2,
  "kyopos": 2,
  "lactate": 1,
  "laid": 0,
  "lapdance": 1,
  "latin": 0,
  "lebo": 2,
  "lebos": 2,
  "lesbain": 2,
  "lesbayn": 2,
  "lesbian": 0,
  "lesbin": 2,
  "lesbo": 2,
  "lez": 2,
  "lezbe": 2,
  "lezbefriends": 2,
  "lezbo": 2,
  "lezz": 2,
  "lezzo": 2,
  "liberal": 0,
  "libido": 1,
  "licker": 1,
  "lickme": 2,
  "lies": 0,
  "limey": 2,
  "limpdick": 2,
  "limy": 2,
  "lingerie": 0,
  "liquor": 1,
  "livesex": 2,
  "loadedgun": 2,
  "lolita": 1,
  "looser": 2,
  "loser": 2,
  "lotion": 0,
  "lovebone": 2,
  "lovegoo": 2,
  "lovegun": 2,
  "lovejuice": 2,
  "lovemuscle": 2,
  "lovepistol": 2,
  "loverocket": 2,
  "lowlife": 2,
  "lsd": 1,
  "lubejob": 2,
  "lubra": 2,
  "lucifer": 0,
  "luckycammeltoe": 2,
  "lugan": 2,
  "lugans": 2,
  "lynch": 1,
  "mabuno": 2,
  "mabunos": 2,
  "macaca": 2,
  "macacas": 2,
  "mad": 0,
  "mafia": 1,
  "magicwand": 2,
  "mahbuno": 2,
  "mahbunos": 2,
  "mams": 2,
  "manhater": 2,
  "manpaste": 2,
  "marijuana": 1,
  "mastabate": 2,
  "mastabater": 2,
  "masterbate": 2,
  "masterblaster": 2,
  "mastrabator": 2,
  "masturbate": 2,
  "masturbating": 2,
  "mattressprincess": 2,
  "mau mau": 2,
  "mau maus": 2,
  "maumau": 2,
  "maumaus": 2,
  "meatbeatter": 2,
  "meatrack": 2,
  "meth": 1,
  "mexican": 0,
  "mgger": 2,
  "mggor": 2,
  "mick": 1,
  "mickeyfinn": 2,
  "mideast": 0,
  "milf": 2,
  "minority": 0,
  "mockey": 2,
  "mockie": 2,
  "mocky": 2,
  "mofo": 2,
  "moky": 2,
  "moles": 0,
  "molest": 1,
  "molestation": 1,
  "molester": 1,
  "molestor": 1,
  "moneyshot": 2,
  "moon cricket": 2,
  "moon crickets": 2,
  "mooncricket": 2,
  "mooncrickets": 2,
  "mormon": 0,
  "moron": 2,
  "moskal": 2,
  "moskals": 2,
  "moslem": 2,
  "mosshead": 2,
  "mothafuck": 2,
  "mothafucka": 2,
  "mothafuckaz": 2,
  "mothafucked": 2,
  "mothafucker": 2,
  "mothafuckin": 2,
  "mothafucking": 2,
  "mothafuckings": 2,
  "motherfuck": 2,
  "motherfucked": 2,
  "motherfucker": 2,
  "motherfuckin": 2,
  "motherfucking": 2,
  "motherfuckings": 2,
  "motherlovebone": 2,
  "muff": 2,
  "muffdive": 2,
  "muffdiver": 2,
  "muffindiver": 2,
  "mufflikcer": 2,
  "mulatto": 2,
  "muncher": 2,
  "munt": 2,
  "murder": 1,
  "murderer": 1,
  "muslim": 0,
  "mzungu": 2,
  "mzungus": 2,
  "naked": 0,
  "narcotic": 1,
  "nasty": 0,
  "nastybitch": 2,
  "nastyho": 2,
  "nastyslut": 2,
  "nastywhore": 2,
  "nazi": 1,
  "necro": 1,
  "negres": 2,
  "negress": 2,
  "negro": 2,
  "negroes": 2,
  "negroid": 2,
  "negros": 2,
  "nig": 2,
  "nigar": 2,
  "nigars": 2,
  "niger": 2,
  "nigerian": 1,
  "nigerians": 1,
  "nigers": 2,
  "nigette": 2,
  "nigettes": 2,
  "nigg": 2,
  "nigga": 2,
  "niggah": 2,
  "niggahs": 2,
  "niggar": 2,
  "niggaracci": 2,
  "niggard": 2,
  "niggarded": 2,
  "niggarding": 2,
  "niggardliness": 2,
  "niggardlinesss": 2,
  "niggardly": 0,
  "niggards": 2,
  "niggars": 2,
  "niggas": 2,
  "niggaz": 2,
  "nigger": 2,
  "niggerhead": 2,
  "niggerhole": 2,
  "niggers": 2,
  "niggle": 2,
  "niggled": 2,
  "niggles": 2,
  "niggling": 2,
  "nigglings": 2,
  "niggor": 2,
  "niggress": 2,
  "niggresses": 2,
  "nigguh": 2,
  "nigguhs": 2,
  "niggur": 2,
  "niggurs": 2,
  "niglet": 2,
  "nignog": 2,
  "nigor": 2,
  "nigors": 2,
  "nigr": 2,
  "nigra": 2,
  "nigras": 2,
  "nigre": 2,
  "nigres": 2,
  "nigress": 2,
  "nigs": 2,
  "nip": 2,
  "nipple": 1,
  "nipplering": 1,
  "nittit": 2,
  "nlgger": 2,
  "nlggor": 2,
  "nofuckingway": 2,
  "nook": 1,
  "nookey": 2,
  "nookie": 2,
  "noonan": 2,
  "nooner": 1,
  "nude": 1,
  "nudger": 2,
  "nuke": 1,
  "nutfucker": 2,
  "nymph": 1,
  "ontherag": 2,
  "oral": 1,
  "oreo": 0,
  "oreos": 0,
  "orga": 2,
  "orgasim": 2,
  "orgasm": 1,
  "orgies": 1,
  "orgy": 1,
  "osama": 0,
  "paddy": 1,
  "paederastic": 1,
  "paederasts": 1,
  "paederasty": 1,
  "paki": 2,
  "pakis": 2,
  "palesimian": 2,
  "palestinian": 0,
  "pancake face": 2,
  "pancake faces": 2,
  "pansies": 2,
  "pansy": 2,
  "panti": 2,
  "panties": 0,
  "payo": 2,
  "pearlnecklace": 1,
  "peck": 1,
  "pecker": 1,
  "peckerwood": 2,
  "pederastic": 1,
  "pederasts": 1,
  "pederasty": 1,
  "pedo": 2,
  "pedophile": 1,
  "pedophiles": 1,
  "pedophilia": 1,
  "pedophilic": 1,
  "pee": 1,
  "peehole": 2,
  "peepee": 2,
  "peepshow": 1,
  "peepshpw": 2,
  "pendy": 1,
  "penetration": 1,
  "peni5": 2,
  "penile": 2,
  "penis": 2,
  "penises": 2,
  "penthouse": 0,
  "period": 0,
  "perv": 2,
  "phonesex": 1,
  "phuk": 2,
  "phuked": 2,
  "phuking": 2,
  "phukked": 2,
  "phukking": 2,
  "phungky": 2,
  "phuq": 2,
  "pi55": 2,
  "picaninny": 2,
  "piccaninny": 2,
  "pickaninnies": 2,
  "pickaninny": 2,
  "piefke": 2,
  "piefkes": 2,
  "piker": 2,
  "pikey": 2,
  "piky": 2,
  "pimp": 2,
  "pimped": 2,
  "pimper": 2,
  "pimpjuic": 2,
  "pimpjuice": 2,
  "pimpsimp": 2,
  "pindick": 2,
  "piss": 2,
  "pissed": 2,
  "pisser": 2,
  "pisses": 2,
  "pisshead": 2,
  "pissin": 2,
  "pissing": 2,
  "pissoff": 2,
  "pistol": 1,
  "pixie": 1,
  "pixy": 1,
  "playboy": 1,
  "playgirl": 1,
  "pocha": 2,
  "pochas": 2,
  "pocho": 2,
  "pochos": 2,
  "pocketpool": 2,
  "pohm": 2,
  "pohms": 2,
  "polack": 2,
  "polacks": 2,
  "pollock": 2,
  "pollocks": 2,
  "pom": 2,
  "pommie": 2,
  "pommie grant": 2,
  "pommie grants": 2,
  "pommies": 2,
  "pommy": 2,
  "poms": 2,
  "poo": 2,
  "poon": 2,
  "poontang": 2,
  "poop": 2,
  "pooper": 2,
  "pooperscooper": 2,
  "pooping": 2,
  "poorwhitetrash": 2,
  "popimp": 2,
  "porch monkey": 2,
  "porch monkies": 2,
  "porchmonkey": 2,
  "porn": 1,
  "pornflick": 1,
  "pornking": 2,
  "porno": 1,
  "pornography": 1,
  "pornprincess": 2,
  "pot": 0,
  "poverty": 0,
  "prairie nigger": 2,
  "prairie niggers": 2,
  "premature": 0,
  "pric": 2,
  "prick": 2,
  "prickhead": 2,
  "primetime": 0,
  "propaganda": 0,
  "pros": 0,
  "prostitute": 1,
  "protestant": 1,
  "pu55i": 2,
  "pu55y": 2,
  "pube": 1,
  "pubic": 1,
  "pubiclice": 2,
  "pud": 2,
  "pudboy": 2,
  "pudd": 2,
  "puddboy": 2,
  "puke": 2,
  "puntang": 2,
  "purinapricness": 2,
  "puss": 2,
  "pussie": 2,
  "pussies": 2,
  "pussy": 1,
  "pussycat": 1,
  "pussyeater": 2,
  "pussyfucker": 2,
  "pussylicker": 2,
  "pussylips": 2,
  "pussylover": 2,
  "pussypounder": 2,
  "pusy": 2,
  "quashie": 2,
  "que": 0,
  "queef": 2,
  "queer": 1,
  "quickie": 2,
  "quim": 2,
  "ra8s": 2,
  "rabbi": 0,
  "racial": 0,
  "racist": 1,
  "radical": 1,
  "radicals": 1,
  "raghead": 2,
  "ragheads": 2,
  "randy": 1,
  "rape": 1,
  "raped": 1,
  "raper": 2,
  "rapist": 1,
  "rearend": 2,
  "rearentry": 2,
  "rectum": 1,
  "redleg": 2,
  "redlegs": 2,
  "redlight": 0,
  "redneck": 2,
  "rednecks": 2,
  "redskin": 2,
  "redskins": 2,
  "reefer": 2,
  "reestie": 2,
  "refugee": 0,
  "reject": 0,
  "remains": 0,
  "rentafuck": 2,
  "republican": 0,
  "rere": 2,
  "retard": 2,
  "retarded": 2,
  "ribbed": 1,
  "rigger": 2,
  "rimjob": 2,
  "rimming": 2,
  "roach": 0,
  "robber": 0,
  "round eyes": 2,
  "roundeye": 2,
  "rump": 0,
  "russki": 2,
  "russkie": 2,
  "sadis": 2,
  "sadom": 2,
  "sambo": 2,
  "sambos": 2,
  "samckdaddy": 2,
  "sand nigger": 2,
  "sand niggers": 2,
  "sandm": 2,
  "sandnigger": 2,
  "satan": 1,
  "scag": 1,
  "scallywag": 2,
  "scat": 1,
  "schlong": 2,
  "schvartse": 2,
  "schvartsen": 2,
  "schwartze": 2,
  "schwartzen": 2,
  "screw": 1,
  "screwyou": 2,
  "scrotum": 1,
  "scum": 1,
  "semen": 1,
  "seppo": 2,
  "seppos": 2,
  "septic": 1,
  "septics": 1,
  "servant": 0,
  "sex": 1,
  "sexed": 2,
  "sexfarm": 2,
  "sexhound": 2,
  "sexhouse": 1,
  "sexing": 2,
  "sexkitten": 2,
  "sexpot": 2,
  "sexslave": 2,
  "sextogo": 2,
  "sextoy": 1,
  "sextoys": 1,
  "sexual": 1,
  "sexually": 1,
  "sexwhore": 2,
  "sexy": 1,
  "sexymoma": 2,
  "sexyslim": 2,
  "shag": 1,
  "shaggin": 2,
  "shagging": 2,
  "shat": 2,
  "shav": 2,
  "shawtypimp": 2,
  "sheeney": 2,
  "shhit": 2,
  "shinola": 1,
  "shit": 1,
  "shitcan": 2,
  "shitdick": 2,
  "shite": 2,
  "shiteater": 2,
  "shited": 2,
  "shitface": 2,
  "shitfaced": 2,
  "shitfit": 2,
  "shitforbrains": 2,
  "shitfuck": 2,
  "shitfucker": 2,
  "shitfull": 2,
  "shithapens": 2,
  "shithappens": 2,
  "shithead": 2,
  "shithouse": 2,
  "shiting": 2,
  "shitlist": 2,
  "shitola": 2,
  "shitoutofluck": 2,
  "shits": 2,
  "shitstain": 2,
  "shitted": 2,
  "shitter": 2,
  "shitting": 2,
  "shitty": 2,
  "shoot": 0,
  "shooting": 0,
  "shortfuck": 2,
  "showtime": 0,
  "shylock": 2,
  "shylocks": 2,
  "sick": 0,
  "sissy": 2,
  "sixsixsix": 2,
  "sixtynine": 2,
  "sixtyniner": 2,
  "skank": 2,
  "skankbitch": 2,
  "skankfuck": 2,
  "skankwhore": 2,
  "skanky": 2,
  "skankybitch": 2,
  "skankywhore": 2,
  "skinflute": 2,
  "skum": 2,
  "skumbag": 2,
  "skwa": 2,
  "skwe": 2,
  "slant": 0,
  "slanty": 2,
  "slanteye": 2,
  "slapper": 2,
  "slaughter": 1,
  "slav": 2,
  "slave": 2,
  "slavedriver": 2,
  "sleezebag": 2,
  "sleezeball": 2,
  "slideitin": 2,
  "slime": 0,
  "slimeball": 2,
  "slimebucket": 2,
  "slope": 0,
  "slopehead": 2,
  "slopeheads": 2,
  "sloper": 2,
  "slopers": 2,
  "slopes": 0,
  "slopey": 2,
  "slopeys": 2,
  "slopies": 2,
  "slopy": 2,
  "slut": 2,
  "sluts": 2,
  "slutt": 2,
  "slutting": 2,
  "slutty": 2,
  "slutwear": 2,
  "slutwhore": 2,
  "smack": 1,
  "smackthemonkey": 2,
  "smut": 2,
  "snatch": 1,
  "snatchpatch": 2,
  "snigger": 0,
  "sniggered": 0,
  "sniggering": 0,
  "sniggers": 1,
  "sniper": 0,
  "snot": 0,
  "snowback": 2,
  "snownigger": 2,
  "sob": 0,
  "sodom": 1,
  "sodomise": 2,
  "sodomite": 1,
  "sodomize": 2,
  "sodomy": 2,
  "sonofabitch": 2,
  "sonofbitch": 2,
  "sooties": 2,
  "sooty": 2,
  "sos": 0,
  "soviet": 0,
  "spa": 0,
  "spade": 1,
  "spades": 1,
  "spaghettibender": 2,
  "spaghettinigger": 2,
  "spank": 1,
  "spankthemonkey": 2,
  "spearchucker": 2,
  "spearchuckers": 2,
  "sperm": 1,
  "spermacide": 2,
  "spermbag": 2,
  "spermhearder": 2,
  "spermherder": 2,
  "spic": 2,
  "spics": 2,
  "spick": 2,
  "spicks": 2,
  "spig": 2,
  "spigotty": 2,
  "spik": 2,
  "spit": 2,
  "spitter": 2,
  "splittail": 2,
  "spooge": 2,
  "spreadeagle": 2,
  "spunk": 2,
  "spunky": 2,
  "sqeh": 2,
  "squa": 2,
  "squarehead": 2,
  "squareheads": 2,
  "squaw": 2,
  "squinty": 2,
  "stagg": 1,
  "stiffy": 1,
  "strapon": 1,
  "stringer": 2,
  "stripclub": 2,
  "stroke": 0,
  "stroking": 1,
  "stuinties": 2,
  "stupid": 2,
  "stupidfuck": 2,
  "stupidfucker": 2,
  "suck": 1,
  "suckdick": 2,
  "sucker": 2,
  "suckme": 2,
  "suckmyass": 2,
  "suckmydick": 2,
  "suckmytit": 2,
  "suckoff": 2,
  "suicide": 1,
  "swallow": 1,
  "swallower": 2,
  "swalow": 2,
  "swamp guinea": 2,
  "swamp guineas": 2,
  "swastika": 1,
  "sweetness": 0,
  "syphilis": 1,
  "taboo": 0,
  "tacohead": 2,
  "tacoheads": 2,
  "taff": 2,
  "tampon": 0,
  "tang": 2,
  "tantra": 1,
  "tar babies": 2,
  "tar baby": 2,
  "tarbaby": 2,
  "tard": 2,
  "teat": 1,
  "terror": 0,
  "terrorist": 1,
  "teste": 2,
  "testicle": 1,
  "testicles": 1,
  "thicklip": 2,
  "thicklips": 2,
  "thirdeye": 2,
  "thirdleg": 2,
  "threesome": 1,
  "threeway": 2,
  "timber nigger": 2,
  "timber niggers": 2,
  "timbernigger": 2,
  "tinkle": 1,
  "tit": 1,
  "titbitnipply": 2,
  "titfuck": 2,
  "titfucker": 2,
  "titfuckin": 2,
  "titjob": 2,
  "titlicker": 2,
  "titlover": 2,
  "tits": 1,
  "tittie": 2,
  "titties": 2,
  "titty": 2,
  "tnt": 1,
  "toilet": 0,
  "tongethruster": 2,
  "tongue": 0,
  "tonguethrust": 2,
  "tonguetramp": 2,
  "tortur": 2,
  "torture": 1,
  "tosser": 2,
  "towel head": 2,
  "towel heads": 2,
  "towelhead": 2,
  "trailertrash": 2,
  "tramp": 1,
  "trannie": 2,
  "tranny": 2,
  "transexual": 0,
  "transsexual": 0,
  "transvestite": 2,
  "triplex": 2,
  "trisexual": 1,
  "trojan": 0,
  "trots": 1,
  "tuckahoe": 2,
  "tunneloflove": 2,
  "turd": 1,
  "turnon": 2,
  "twat": 2,
  "twink": 2,
  "twinkie": 2,
  "twobitwhore": 2,
  "uck": 2,
  "uk": 0,
  "ukrop": 2,
  "uncle tom": 2,
  "unfuckable": 2,
  "upskirt": 2,
  "uptheass": 2,
  "upthebutt": 2,
  "urinary": 0,
  "urinate": 0,
  "urine": 0,
  "usama": 2,
  "uterus": 1,
  "vagina": 1,
  "vaginal": 1,
  "vatican": 0,
  "vibr": 2,
  "vibrater": 2,
  "vibrator": 1,
  "vietcong": 0,
  "violence": 0,
  "virgin": 0,
  "virginbreaker": 2,
  "vomit": 2,
  "vulva": 1,
  "wab": 2,
  "wank": 2,
  "wanker": 2,
  "wanking": 2,
  "waysted": 2,
  "weapon": 0,
  "weenie": 2,
  "weewee": 2,
  "welcher": 2,
  "welfare": 2,
  "wetb": 2,
  "wetback": 2,
  "wetbacks": 2,
  "wetspot": 2,
  "whacker": 2,
  "whash": 2,
  "whigger": 2,
  "whiggers": 2,
  "whiskey": 0,
  "whiskeydick": 2,
  "whiskydick": 2,
  "whit": 1,
  "white trash": 2,
  "whitenigger": 2,
  "whites": 1,
  "whitetrash": 2,
  "whitey": 2,
  "whiteys": 2,
  "whities": 2,
  "whiz": 2,
  "whop": 2,
  "whore": 2,
  "whorefucker": 2,
  "whorehouse": 2,
  "wigga": 2,
  "wiggas": 2,
  "wigger": 2,
  "wiggers": 2,
  "willie": 2,
  "williewanker": 2,
  "willy": 1,
  "wn": 2,
  "wog": 2,
  "wogs": 2,
  "womens": 0,
  "wop": 2,
  "wtf": 2,
  "wuss": 2,
  "wuzzie": 2,
  "xkwe": 2,
  "xtc": 1,
  "xxx": 1,
  "yank": 2,
  "yankee": 1,
  "yankees": 1,
  "yanks": 2,
  "yarpie": 2,
  "yarpies": 2,
  "yellowman": 2,
  "yid": 2,
  "yids": 2,
  "zigabo": 2,
  "zigabos": 2,
  "zipperhead": 2,
  "zipperheads": 2
}

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
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
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
var splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

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
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap(array, baseUnary(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
      ? new SetCache(othIndex && array)
      : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer:
  while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (!(seen
          ? cacheHas(seen, computed)
          : includes(result, computed, comparator)
        )) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache
              ? cacheHas(cache, computed)
              : includes(arrays[othIndex], computed, comparator))
            ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
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
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
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
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order of result values is determined by the
 * order they occur in the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */
var intersection = baseRest(function(arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped)
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

module.exports = intersection;

},{}],5:[function(require,module,exports){
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

},{"nlcst-to-string":8}],6:[function(require,module,exports){
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

},{"nlcst-to-string":8}],7:[function(require,module,exports){
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

},{"nlcst-is-literal":5,"nlcst-normalize":6,"unist-util-visit":13}],8:[function(require,module,exports){
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

},{"./isArguments":10}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
/* global define */

(function (root, pluralize) {
  /* istanbul ignore else */
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    // Node.
    module.exports = pluralize();
  } else if (typeof define === 'function' && define.amd) {
    // AMD, registers as an anonymous module.
    define(function () {
      return pluralize();
    });
  } else {
    // Browser global.
    root.pluralize = pluralize();
  }
})(this, function () {
  // Rule storage - pluralize and singularize need to be run sequentially,
  // while other rules can be optimized using an object for instant lookups.
  var pluralRules = [];
  var singularRules = [];
  var uncountables = {};
  var irregularPlurals = {};
  var irregularSingles = {};

  /**
   * Title case a string.
   *
   * @param  {string} str
   * @return {string}
   */
  function toTitleCase (str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  }

  /**
   * Sanitize a pluralization rule to a usable regular expression.
   *
   * @param  {(RegExp|string)} rule
   * @return {RegExp}
   */
  function sanitizeRule (rule) {
    if (typeof rule === 'string') {
      return new RegExp('^' + rule + '$', 'i');
    }

    return rule;
  }

  /**
   * Pass in a word token to produce a function that can replicate the case on
   * another word.
   *
   * @param  {string}   word
   * @param  {string}   token
   * @return {Function}
   */
  function restoreCase (word, token) {
    // Tokens are an exact match.
    if (word === token) {
      return token;
    }

    // Upper cased words. E.g. "HELLO".
    if (word === word.toUpperCase()) {
      return token.toUpperCase();
    }

    // Title cased words. E.g. "Title".
    if (word[0] === word[0].toUpperCase()) {
      return toTitleCase(token);
    }

    // Lower cased words. E.g. "test".
    return token.toLowerCase();
  }

  /**
   * Interpolate a regexp string.
   *
   * @param  {string} str
   * @param  {Array}  args
   * @return {string}
   */
  function interpolate (str, args) {
    return str.replace(/\$(\d{1,2})/g, function (match, index) {
      return args[index] || '';
    });
  }

  /**
   * Sanitize a word by passing in the word and sanitization rules.
   *
   * @param  {string}   token
   * @param  {string}   word
   * @param  {Array}    collection
   * @return {string}
   */
  function sanitizeWord (token, word, collection) {
    // Empty string or doesn't need fixing.
    if (!token.length || uncountables.hasOwnProperty(token)) {
      return word;
    }

    var len = collection.length;

    // Iterate over the sanitization rules and use the first one to match.
    while (len--) {
      var rule = collection[len];

      // If the rule passes, return the replacement.
      if (rule[0].test(word)) {
        return word.replace(rule[0], function (match, index, word) {
          var result = interpolate(rule[1], arguments);

          if (match === '') {
            return restoreCase(word[index - 1], result);
          }

          return restoreCase(match, result);
        });
      }
    }

    return word;
  }

  /**
   * Replace a word with the updated word.
   *
   * @param  {Object}   replaceMap
   * @param  {Object}   keepMap
   * @param  {Array}    rules
   * @return {Function}
   */
  function replaceWord (replaceMap, keepMap, rules) {
    return function (word) {
      // Get the correct token and case restoration functions.
      var token = word.toLowerCase();

      // Check against the keep object map.
      if (keepMap.hasOwnProperty(token)) {
        return restoreCase(word, token);
      }

      // Check against the replacement map for a direct word replacement.
      if (replaceMap.hasOwnProperty(token)) {
        return restoreCase(word, replaceMap[token]);
      }

      // Run all the rules against the word.
      return sanitizeWord(token, word, rules);
    };
  }

  /**
   * Pluralize or singularize a word based on the passed in count.
   *
   * @param  {string}  word
   * @param  {number}  count
   * @param  {boolean} inclusive
   * @return {string}
   */
  function pluralize (word, count, inclusive) {
    var pluralized = count === 1
      ? pluralize.singular(word) : pluralize.plural(word);

    return (inclusive ? count + ' ' : '') + pluralized;
  }

  /**
   * Pluralize a word.
   *
   * @type {Function}
   */
  pluralize.plural = replaceWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Singularize a word.
   *
   * @type {Function}
   */
  pluralize.singular = replaceWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Add a pluralization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addPluralRule = function (rule, replacement) {
    pluralRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add a singularization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addSingularRule = function (rule, replacement) {
    singularRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add an uncountable word rule.
   *
   * @param {(string|RegExp)} word
   */
  pluralize.addUncountableRule = function (word) {
    if (typeof word === 'string') {
      uncountables[word.toLowerCase()] = true;
      return;
    }

    // Set singular and plural references for the word.
    pluralize.addPluralRule(word, '$0');
    pluralize.addSingularRule(word, '$0');
  };

  /**
   * Add an irregular word definition.
   *
   * @param {string} single
   * @param {string} plural
   */
  pluralize.addIrregularRule = function (single, plural) {
    plural = plural.toLowerCase();
    single = single.toLowerCase();

    irregularSingles[single] = plural;
    irregularPlurals[plural] = single;
  };

  /**
   * Irregular rules.
   */
  [
    // Pronouns.
    ['I', 'we'],
    ['me', 'us'],
    ['he', 'they'],
    ['she', 'they'],
    ['them', 'them'],
    ['myself', 'ourselves'],
    ['yourself', 'yourselves'],
    ['itself', 'themselves'],
    ['herself', 'themselves'],
    ['himself', 'themselves'],
    ['themself', 'themselves'],
    ['is', 'are'],
    ['was', 'were'],
    ['has', 'have'],
    ['this', 'these'],
    ['that', 'those'],
    // Words ending in with a consonant and `o`.
    ['echo', 'echoes'],
    ['dingo', 'dingoes'],
    ['volcano', 'volcanoes'],
    ['tornado', 'tornadoes'],
    ['torpedo', 'torpedoes'],
    // Ends with `us`.
    ['genus', 'genera'],
    ['viscus', 'viscera'],
    // Ends with `ma`.
    ['stigma', 'stigmata'],
    ['stoma', 'stomata'],
    ['dogma', 'dogmata'],
    ['lemma', 'lemmata'],
    ['schema', 'schemata'],
    ['anathema', 'anathemata'],
    // Other irregular rules.
    ['ox', 'oxen'],
    ['axe', 'axes'],
    ['die', 'dice'],
    ['yes', 'yeses'],
    ['foot', 'feet'],
    ['eave', 'eaves'],
    ['goose', 'geese'],
    ['tooth', 'teeth'],
    ['quiz', 'quizzes'],
    ['human', 'humans'],
    ['proof', 'proofs'],
    ['carve', 'carves'],
    ['valve', 'valves'],
    ['looey', 'looies'],
    ['thief', 'thieves'],
    ['groove', 'grooves'],
    ['pickaxe', 'pickaxes'],
    ['whiskey', 'whiskies']
  ].forEach(function (rule) {
    return pluralize.addIrregularRule(rule[0], rule[1]);
  });

  /**
   * Pluralization rules.
   */
  [
    [/s?$/i, 's'],
    [/[^\u0000-\u007F]$/i, '$0'],
    [/([^aeiou]ese)$/i, '$1'],
    [/(ax|test)is$/i, '$1es'],
    [/(alias|[^aou]us|tlas|gas|ris)$/i, '$1es'],
    [/(e[mn]u)s?$/i, '$1s'],
    [/([^l]ias|[aeiou]las|[emjzr]as|[iu]am)$/i, '$1'],
    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
    [/(seraph|cherub)(?:im)?$/i, '$1im'],
    [/(her|at|gr)o$/i, '$1oes'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
    [/sis$/i, 'ses'],
    [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
    [/([^aeiouy]|qu)y$/i, '$1ies'],
    [/([^ch][ieo][ln])ey$/i, '$1ies'],
    [/(x|ch|ss|sh|zz)$/i, '$1es'],
    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
    [/(m|l)(?:ice|ouse)$/i, '$1ice'],
    [/(pe)(?:rson|ople)$/i, '$1ople'],
    [/(child)(?:ren)?$/i, '$1ren'],
    [/eaux$/i, '$0'],
    [/m[ae]n$/i, 'men'],
    ['thou', 'you']
  ].forEach(function (rule) {
    return pluralize.addPluralRule(rule[0], rule[1]);
  });

  /**
   * Singularization rules.
   */
  [
    [/s$/i, ''],
    [/(ss)$/i, '$1'],
    [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(?:sis|ses)$/i, '$1sis'],
    [/(^analy)(?:sis|ses)$/i, '$1sis'],
    [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
    [/ies$/i, 'y'],
    [/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i, '$1ie'],
    [/\b(mon|smil)ies$/i, '$1ey'],
    [/(m|l)ice$/i, '$1ouse'],
    [/(seraph|cherub)im$/i, '$1'],
    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|tlas|gas|(?:her|at|gr)o|ris)(?:es)?$/i, '$1'],
    [/(e[mn]u)s?$/i, '$1'],
    [/(movie|twelve)s$/i, '$1'],
    [/(cris|test|diagnos)(?:is|es)$/i, '$1is'],
    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
    [/(alumn|alg|vertebr)ae$/i, '$1a'],
    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
    [/(matr|append)ices$/i, '$1ix'],
    [/(pe)(rson|ople)$/i, '$1rson'],
    [/(child)ren$/i, '$1'],
    [/(eau)x?$/i, '$1'],
    [/men$/i, 'man']
  ].forEach(function (rule) {
    return pluralize.addSingularRule(rule[0], rule[1]);
  });

  /**
   * Uncountable rules.
   */
  [
    // Singular words with no plurals.
    'advice',
    'adulthood',
    'agenda',
    'aid',
    'alcohol',
    'ammo',
    'athletics',
    'bison',
    'blood',
    'bream',
    'buffalo',
    'butter',
    'carp',
    'cash',
    'chassis',
    'chess',
    'clothing',
    'commerce',
    'cod',
    'cooperation',
    'corps',
    'digestion',
    'debris',
    'diabetes',
    'energy',
    'equipment',
    'elk',
    'excretion',
    'expertise',
    'flounder',
    'fun',
    'gallows',
    'garbage',
    'graffiti',
    'headquarters',
    'health',
    'herpes',
    'highjinks',
    'homework',
    'housework',
    'information',
    'jeans',
    'justice',
    'kudos',
    'labour',
    'literature',
    'machinery',
    'mackerel',
    'mail',
    'media',
    'mews',
    'moose',
    'music',
    'news',
    'pike',
    'plankton',
    'pliers',
    'pollution',
    'premises',
    'rain',
    'research',
    'rice',
    'salmon',
    'scissors',
    'series',
    'sewage',
    'shambles',
    'shrimp',
    'species',
    'staff',
    'swine',
    'tennis',
    'trout',
    'traffic',
    'transporation',
    'tuna',
    'wealth',
    'welfare',
    'whiting',
    'wildebeest',
    'wildlife',
    'you',
    // Regexes.
    /pox$/i, // "chickpox", "smallpox"
    /ois$/i,
    /deer$/i, // "deer", "reindeer"
    /fish$/i, // "fish", "blowfish", "angelfish"
    /sheep$/i,
    /measles$/i,
    /[^aeiou]ese$/i // "chinese", "japanese"
  ].forEach(pluralize.addUncountableRule);

  return pluralize;
});

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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