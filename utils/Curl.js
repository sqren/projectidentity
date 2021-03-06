// Generated by CoffeeScript 1.3.1
(function() {
  var $, Curl, Utils, curlrequest;

  curlrequest = require("curlrequest");

  Utils = require("./Utils.js");

  $ = require("jquery");

  Curl = {
    scrape: function(req_specific, callback, settings) {
      var curl_request, req;
      if (settings == null) {
        settings = {};
      }
      console.log("Scraping: " + req_specific.url);
      req = {
        headers: [],
        include: true,
        timeout: 10,
        'retries': 3,
        location: false
      };
      $.extend(req, req_specific);
      if (req.data != null) {
        if (settings.urlencoding != null) {
          req.data = Utils.dataUrlEncode(req.data, settings.urlencoding);
        } else {
          req.data = Utils.dataUrlEncode(req.data, "utf8");
        }
      }
      return curl_request = curlrequest.request(req, function(err, res_raw) {
        var res;
        if (err != null) {
          console.log("ERROR: ");
          console.log(err);
        }
        if (res_raw != null) {
          res = Utils.splitResponse(res_raw);
        }
        return callback(req, res, err);
      });
    },
    getCookie: function(url, callback) {
      var curl_request, options;
      options = {
        url: url,
        include: true
      };
      return curl_request = curlrequest.request(options, function(err, res) {
        var cookie, head, regex, result;
        if (err == null) {
          console.log("ERROR: ");
          console.log(err);
        }
        res = res.split("\r\n\r\n");
        head = res.shift();
        regex = /^Set-Cookie: (.*?);/m;
        result = head.match(regex);
        cookie = ((result != null) ? result[1] : "");
        console.log("Cookie: " + cookie);
        return callback(cookie);
      });
    }
  };

  module.exports = Curl;

}).call(this);
