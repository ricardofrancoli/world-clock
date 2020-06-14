(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.flag = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={
  "AD": ["Andorra", "Andorran"],
  "AE": ["United Arab Emirates", "UAE", "Emirati"],
  "AF": ["Afghanistan", "Afghan"],
  "AG": ["Antigua and Barbuda", "Antiguan, Barbudan"],
  "AI": ["Anguilla", "Anguillian"],
  "AL": ["Albania", "Albanian"],
  "AM": ["Armenia", "Armenian"],
  "AN": "Netherlands Antilles",
  "AO": ["Angola", "Angolan"],
  "AQ": ["Antarctica", "Antarctican"],
  "AR": ["Argentina", "Argentine"],
  "AS": ["American Samoa", "American Samoan"],
  "AT": ["Austria", "Austrian"],
  "AU": ["Australia", "Australian"],
  "AW": ["Aruba", "Aruban"],
  "AX": ["Åland Islands", "Ålandish"],
  "AZ": ["Azerbaijan", "Azerbaijani"],
  "BA": ["Bosnia and Herzegovina", "Bosnian, Herzegovinian"],
  "BB": ["Barbados", "Barbadian"],
  "BD": ["Bangladesh", "Bangladeshi"],
  "BE": ["Belgium", "Belgian"],
  "BF": ["Burkina Faso", "Burkinabe"],
  "BG": ["Bulgaria", "Bulgarian"],
  "BH": ["Bahrain", "Bahraini"],
  "BI": ["Burundi", "Burundian"],
  "BJ": ["Benin", "Beninese"],
  "BM": ["Bermuda", "Bermudian"],
  "BN": ["Brunei Darussalam", "Bruneian"],
  "BO": ["Bolivia", "Bolivian"],
  "BR": ["Brazil", "Brazilian"],
  "BS": ["Bahamas", "Bahamian"],
  "BT": ["Bhutan", "Bhutanese"],
  "BV": "Bouvet Island",
  "BW": ["Botswana", "Motswana"],
  "BY": ["Belarus", "Belarusian"],
  "BZ": ["Belize", "Belizean"],
  "CA": ["Canada", "Canadian"],
  "CC": ["Cocos (Keeling) Islands", "Cocos Islander"],
  "CD": ["Congo, The Democratic Republic of the"],
  "CF": ["Central African Republic", "Central African"],
  "CG": ["Congo"],
  "CH": ["Switzerland", "Swiss"],
  "CI": ["Cote D'Ivoire", "Ivorian"],
  "CK": ["Cook Islands", "Cook Islander"],
  "CL": ["Chile", "Chilean"],
  "CM": ["Cameroon", "Cameroonian"],
  "CN": ["China", "Chinese"],
  "CO": ["Colombia", "Colombian"],
  "CR": ["Costa Rica", "Costa Rican"],
  "CU": ["Cuba", "Cuban"],
  "CV": ["Cape Verde", "Cape Verdian"],
  "CX": ["Christmas Island", "Christmas Islander"],
  "CY": ["Cyprus", "Cypriot"],
  "CZ": ["Czechia", "Czech Republic", "Czech"],
  "DE": ["Germany", "German"],
  "DJ": ["Djibouti"],
  "DK": ["Denmark", "Danish"],
  "DM": ["Dominica"],
  "DO": ["Dominican Republic"],
  "DZ": ["Algeria", "Algerian"],
  "EC": ["Ecuador", "Ecuadorean"],
  "EE": ["Estonia", "Estonian"],
  "EG": ["Egypt", "Egyptian"],
  "EH": ["Western Sahara", "Sahrawi"],
  "ER": ["Eritrea", "Eritrean"],
  "ES": ["Spain", "Spanish"],
  "ET": ["Ethiopia", "Ethiopian"],
  "EU": "European Union",
  "FI": ["Finland", "Finnish"],
  "FJ": ["Fiji", "Fijian"],
  "FK": ["Falkland Islands (Malvinas)", "Falkland Islander"],
  "FM": ["Micronesia, Federated States of", "Micronesian"],
  "FO": ["Faroe Islands", "Faroese"],
  "FR": ["France", "French"],
  "GA": ["Gabon", "Gabonese"],
  "GB": ["United Kingdom", "UK", "British"],
  "GD": ["Grenada", "Grenadian"],
  "GE": ["Georgia", "Georgian"],
  "GF": ["French Guiana", "Guianan"],
  "GG": ["Guernsey"],
  "GH": ["Ghana", "Ghanaian"],
  "GI": ["Gibraltar"],
  "GL": ["Greenland", "Greenlandic"],
  "GM": ["Gambia", "Gambian"],
  "GN": ["Guinea", "Guinean"],
  "GP": ["Guadeloupe", "Guadeloupian"],
  "GQ": ["Equatorial Guinea", "Equatorial Guinean"],
  "GR": ["Greece", "Greek"],
  "GS": ["South Georgia and the South Sandwich Islands", "South Georgian South Sandwich Islander"],
  "GT": ["Guatemala", "Guatemalan"],
  "GU": ["Guam", "Guamanian"],
  "GW": ["Guinea-Bissau", "Guinea-Bissauan"],
  "GY": ["Guyana", "Guyanese"],
  "HK": ["Hong Kong", "Hong Konger"],
  "HM": ["Heard Island and Mcdonald Islands", "Heard and McDonald Islander"],
  "HN": ["Honduras", "Honduran"],
  "HR": ["Croatia", "Croatian"],
  "HT": ["Haiti", "Haitian"],
  "HU": ["Hungary", "Hungarian"],
  "ID": ["Indonesia", "Indonesian"],
  "IE": ["Ireland", "Irish"],
  "IL": ["Israel", "Israeli"],
  "IM": ["Isle of Man", "Manx"],
  "IN": ["India", "Indian"],
  "IO": ["British Indian Ocean Territory"],
  "IQ": ["Iraq", "Iraqi"],
  "IR": ["Iran, Islamic Republic Of", "Iranian"],
  "IS": ["Iceland", "Icelander"],
  "IT": ["Italy", "Italian"],
  "JE": ["Jersey"],
  "JM": ["Jamaica", "Jamaican"],
  "JO": ["Jordan", "Jordanian"],
  "JP": ["Japan", "Japanese"],
  "KE": ["Kenya", "Kenyan"],
  "KG": ["Kyrgyzstan", "Kirghiz"],
  "KH": ["Cambodia", "Cambodian"],
  "KI": ["Kiribati", "I-Kiribati"],
  "KM": ["Comoros", "Comoran"],
  "KN": ["Saint Kitts and Nevis", "Kittitian or Nevisian"],
  "KP": ["Korea, Democratic People's Republic of", "North Korea", "North Korean", "DPRK"],
  "KR": ["Korea, Republic of", "South Korea", "South Korean"],
  "KW": ["Kuwait", "Kuwaiti"],
  "KY": ["Cayman Islands", "Caymanian"],
  "KZ": ["Kazakhstan", "Kazakhstani"],
  "LA": ["Lao People's Democratic Republic", "Laotian"],
  "LB": ["Lebanon", "Lebanese"],
  "LC": ["Saint Lucia", "Saint Lucian"],
  "LI": ["Liechtenstein", "Liechtensteiner"],
  "LK": ["Sri Lanka", "Sri Lankan"],
  "LR": ["Liberia", "Liberian"],
  "LS": ["Lesotho", "Mosotho"],
  "LT": ["Lithuania", "Lithuanian"],
  "LU": ["Luxembourg", "Luxembourger"],
  "LV": ["Latvia", "Latvian"],
  "LY": ["Libyan Arab Jamahiriya", "Libyan"],
  "MA": ["Morocco", "Moroccan"],
  "MC": ["Monaco", "Monegasque"],
  "MD": ["Moldova, Republic of", "Moldovan"],
  "ME": ["Montenegro", "Montenegrin"],
  "MG": ["Madagascar", "Malagasy"],
  "MH": ["Marshall Islands", "Marshallese"],
  "MK": ["Macedonia, The Former Yugoslav Republic of", "Macedonian"],
  "ML": ["Mali", "Malian"],
  "MM": ["Myanmar", "Burma", "Burmese"],
  "MN": ["Mongolia", "Mongolian"],
  "MO": ["Macao", "Macau", "Macanese"],
  "MP": ["Northern Mariana Islands"],
  "MQ": ["Martinique"],
  "MR": ["Mauritania", "Mauritanian"],
  "MS": ["Montserrat", "Montserratian"],
  "MT": ["Malta", "Maltese"],
  "MU": ["Mauritius", "Mauritian"],
  "MV": ["Maldives", "Maldivan"],
  "MW": ["Malawi", "Malawian"],"MX": ["Mexico", "Mexican"],
  "MY": ["Malaysia", "Malaysian"],
  "MZ": ["Mozambique", "Mozambican"],
  "NA": ["Namibia", "Namibian"],
  "NC": ["New Caledonia", "New Caledonian"],
  "NE": ["Niger", "Nigerien"],
  "NF": ["Norfolk Island", "Norfolk Islander"],
  "NG": ["Nigeria", "Nigerian"],
  "NI": ["Nicaragua", "Nicaraguan"],
  "NL": ["Netherlands", "Dutch"],
  "NO": ["Norway", "Norwegian"],
  "NP": ["Nepal", "Nepalese"],
  "NR": ["Nauru", "Nauruan"],
  "NU": ["Niue", "Niuean"],
  "NZ": ["New Zealand", "New Zealander"],
  "OM": ["Oman", "Omani"],
  "PA": ["Panama", "Panamanian"],
  "PE": ["Peru", "Peruvian"],
  "PF": ["French Polynesia", "French Polynesian"],
  "PG": ["Papua New Guinea", "Papua New Guinean"],
  "PH": ["Philippines", "Filipino"],
  "PK": ["Pakistan", "Pakistani"],
  "PL": ["Poland", "Polish"],
  "PM": ["Saint Pierre and Miquelon"],
  "PN": ["Pitcairn", "Pitcairn Islander"],
  "PR": ["Puerto Rico", "Puerto Rican"],
  "PS": ["Palestinian Territory, Occupied", "Palestine", "Palestinian"],
  "PT": ["Portugal", "Portuguese"],
  "PW": ["Palau", "Palauan"],
  "PY": ["Paraguay", "Paraguayan"],
  "QA": ["Qatar", "Qatari"],
  "RE": ["Reunion"],
  "RO": ["Romania", "Romanian"],
  "RS": ["Serbia", "Serbian"],
  "RU": ["Russian Federation", "Russian"],
  "RW": ["Rwanda", "Rwandan"],
  "SA": ["Saudi Arabia", "Saudi Arabian"],
  "SB": ["Solomon Islands", "Solomon Islander"],
  "SC": ["Seychelles", "Seychellois"],
  "SD": ["Sudan", "Sudanese"],
  "SE": ["Sweden", "Swedish"],
  "SG": ["Singapore", "Singaporean"],
  "SH": ["Saint Helena", "Saint Helenian"],
  "SI": ["Slovenia", "Slovene"],
  "SJ": ["Svalbard and Jan Mayen"],
  "SK": ["Slovakia", "Slovak"],
  "SL": ["Sierra Leone", "Sierra Leonean"],
  "SM": ["San Marino", "Sammarinese"],
  "SN": ["Senegal", "Senegalese"],
  "SO": ["Somalia", "Somali"],
  "SR": ["Suriname", "Surinamer"],
  "ST": ["Sao Tome and Principe", "Sao Tomean"],
  "SV": ["El Salvador", "Salvadoran"],
  "SY": ["Syrian Arab Republic", "Syrian"],
  "SZ": ["Swaziland", "Swazi"],
  "TC": ["Turks and Caicos Islands", "Turks and Caicos Islander"],
  "TD": ["Chad", "Chadian"],
  "TF": ["French Southern Territories"],
  "TG": ["Togo", "Togolese"],
  "TH": ["Thailand", "Thai"],
  "TJ": ["Tajikistan", "Tadzhik"],
  "TK": ["Tokelau", "Tokelauan"],
  "TL": ["Timor-Leste", "East Timorese"],
  "TM": ["Turkmenistan", "Turkmen"],
  "TN": ["Tunisia", "Tunisian"],
  "TO": ["Tonga", "Tongan"],
  "TR": ["Turkey", "Turkish"],
  "TT": ["Trinidad and Tobago", "Trinidadian"],
  "TV": ["Tuvalu", "Tuvaluan"],
  "TW": ["Taiwan", "Taiwanese"],
  "TZ": ["Tanzania, United Republic of", "Tanzanian"],
  "UA": ["Ukraine", "Ukrainian"],
  "UG": ["Uganda", "Ugandan"],
  "UM": ["United States Minor Outlying Islands"],
  "US": ["United States", "USA", "American"],
  "UY": ["Uruguay", "Uruguayan"],
  "UZ": ["Uzbekistan", "Uzbekistani"],
  "VA": ["Holy See (Vatican City State)", "Vatican"],
  "VC": ["Saint Vincent and the Grenadines", "Saint Vincentian"],
  "VE": ["Venezuela", "Venezuelan"],
  "VG": ["Virgin Islands, British"],
  "VI": ["Virgin Islands, U.S."],
  "VN": ["Vietnam", "Viet Nam", "Vietnamese"],
  "VU": ["Vanuatu", "Ni-Vanuatu"],
  "WF": ["Wallis and Futuna", "Wallis and Futuna Islander"],
  "WS": ["Samoa", "Samoan"],
  "XK": ["Kosovo", "Kosovar"],
  "YE": ["Yemen", "Yemeni"],
  "YT": ["Mayotte", "Mahoran"],
  "ZA": ["South Africa", "South African"],
  "ZM": ["Zambia", "Zambian"],
  "ZW": ["Zimbabwe", "Zimbabwean"]
}

},{}],2:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var countries = require('../countries.json');

var MAGIC_NUMBER = 127462 - 65;
var CODE_RE = /^[a-z]{2}$/i;
var NAME_RE = /^.{2,}$/;
var FLAG_RE = /\uD83C[\uDDE6-\uDDFF]/;

function fuzzyCompare(input, name) {
  name = name.toLowerCase(); // Cases like:
  //    "Vatican" <-> "Holy See (Vatican City State)"
  //    "Russia"  <-> "Russian Federation"

  if (name.includes(input) || input.includes(name)) {
    return true;
  } // Cases like:
  // "British Virgin Islands" <-> "Virgin Islands, British"
  // "Republic of Moldova"    <-> "Moldova, Republic of"


  if (name.includes(',')) {
    var reversedName = name.split(', ').reverse().join(' ');

    if (reversedName.includes(input) || input.includes(reversedName)) {
      return true;
    }
  }

  return false;
}

function isCode(code) {
  code = code.toUpperCase();
  return countries[code] ? code : undefined;
}

function nameToCode(name) {
  if (!name || !NAME_RE.test(name)) {
    return;
  }

  name = name.trim().toLowerCase(); // Look for exact match
  // NOTE: normal loop to terminate ASAP

  for (var _code in countries) {
    if ({}.hasOwnProperty.call(countries, _code)) {
      var names = countries[_code];

      if (!Array.isArray(names)) {
        names = [names];
      }

      var _iterator = _createForOfIteratorHelper(names),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var n = _step.value;

          if (n.toLowerCase() === name) {
            return _code;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  } // Look for inexact match
  // NOTE: .filter() to aggregate all matches


  var matches = Object.keys(countries).filter(function (code) {
    var names = countries[code];

    if (!Array.isArray(names)) {
      names = [names];
    }

    var _iterator2 = _createForOfIteratorHelper(names),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _n = _step2.value;

        if (fuzzyCompare(name, _n)) {
          return true;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return false;
  }); // Return only when exactly one match was found
  //   prevents cases like "United"

  if (matches.length === 1) {
    return matches[0];
  }
}

function codeToName(code) {
  if (!code || !CODE_RE.test(code)) {
    return;
  }

  var names = countries[code.toUpperCase()];

  if (Array.isArray(names)) {
    return names[0];
  }

  return names;
}

function codeToFlag(code) {
  if (!code || !CODE_RE.test(code)) {
    return;
  }

  code = isCode(code);

  if (!code) {
    return;
  }

  if (String && String.fromCodePoint) {
    return String.fromCodePoint.apply(String, _toConsumableArray(_toConsumableArray(code).map(function (c) {
      return MAGIC_NUMBER + c.charCodeAt();
    })));
  }
}

function flagToCode(flag) {
  if (!flag || !FLAG_RE.test(flag)) {
    return;
  }

  return isCode(_toConsumableArray(flag).map(function (c) {
    return c.codePointAt(0) - MAGIC_NUMBER;
  }).map(function (c) {
    return String.fromCharCode(c);
  }).join(''));
} // Takes either emoji or full name


function code(input) {
  return flagToCode(input) || nameToCode(input);
} // Takes either code or full name


function flag(input) {
  if (!CODE_RE.test(input) || input === 'UK') {
    input = nameToCode(input);
  }

  return codeToFlag(input);
} // Takes either emoji or code


function name(input) {
  if (FLAG_RE.test(input)) {
    input = flagToCode(input);
  }

  return codeToName(input);
}

module.exports = {
  MAGIC_NUMBER: MAGIC_NUMBER,
  CODE_RE: CODE_RE,
  NAME_RE: NAME_RE,
  FLAG_RE: FLAG_RE,
  code: code,
  flag: flag,
  name: name,
  countries: countries,
  isCode: isCode,
  fuzzyCompare: fuzzyCompare,
  codeToName: codeToName,
  codeToFlag: codeToFlag,
  nameToCode: nameToCode,
  flagToCode: flagToCode
};
},{"../countries.json":1}],3:[function(require,module,exports){
'use strict';

var _require = require('./lib.js'),
    flag = _require.flag,
    name = _require.name,
    code = _require.code,
    countries = _require.countries;

module.exports = {
  flag: flag,
  name: name,
  code: code,
  countries: countries
};
},{"./lib.js":2}],4:[function(require,module,exports){
const {flag} = require('country-emoji');
// const ipLocation = require("/node_modules/ip-location");

module.exports = flag;
// module.exports = ipLocation;

console.log(flag('Guatemala'));
},{"country-emoji":3}]},{},[4])(4)
});
