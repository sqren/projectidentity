// Generated by CoffeeScript 1.3.1
(function() {
  var $, Curl, Recipe, querystring,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Recipe = require("../Recipe.js");

  Curl = require("../utils/Curl.js");

  $ = require("jquery");

  querystring = require("querystring");

  this.Lebara = (function(_super) {

    __extends(Lebara, _super);

    Lebara.name = 'Lebara';

    function Lebara(inputData, socket) {
      this.counter = 0;
      this.inputData = inputData;
      this.socket = socket;
      this.domTarget = "";
      this.req = {
        data: {
          cprok: "on",
          email: "test@ofir.dk",
          password1: "test1234",
          password2: "test1234",
          navn: inputData["firstName"] + " " + inputData["lastName"],
          cpr: inputData["dob"] + "-" + inputData["cprList"][0]
        },
        options: {
          url: "http://dummyrep.konscript.net/testNumberBig.php",
          method: "POST",
          encoding: "UTF-8"
        }
      };
    }

    Lebara.prototype.updateCPR = function() {
      return this.req.data.cpr = this.inputData["dob"] + "-" + this.inputData["cprList"][this.counter];
    };

    Lebara.prototype.getResponse = function(req, res, err, callback) {
      var cpr, html;
      html = res.body;
      cpr = querystring.parse(req.data).cpr;
      if (html.indexOf("NOVBetal") > -1) {
        return callback(cpr, "success", html);
      } else {
        return callback(cpr, "error", html);
      }
    };

    return Lebara;

  })(Recipe.Recipe);

}).call(this);
