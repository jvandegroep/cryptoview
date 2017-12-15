const request = require('request');
var DBHOST = "192.168.178.2";
var DBPORT = "5984";
var nano = require('nano')('http://' + DBHOST + ":" + DBPORT);
var cryptoviewdb = nano.db.use('cryptodb');


var URLs = [
  "https://api.cryptonator.com/api/ticker/doge-eur",
  "https://api.cryptonator.com/api/ticker/btc-eur",
  "https://api.cryptonator.com/api/ticker/xrp-eur",
  "https://api.cryptonator.com/api/ticker/cloak-eur",
  "https://api.cryptonator.com/api/ticker/RDD-eur",
  "https://api.cryptonator.com/api/ticker/NLG-eur",
  "https://api.cryptonator.com/api/ticker/DGB-eur",
  "https://api.cryptonator.com/api/ticker/STRAT-eur"
];


function getSourceData(URL){

  request(URL, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); } else {

      if (body.ticker) {
        if (body.ticker.base !== "") {
          createDoc(body);
        }
      }

    }
  });
}

function createDoc(data){

  //create doc
  var doc = {
    coin: data.ticker.base + "-" + data.ticker.target,
    price: data.ticker.price,
    volume: data.ticker.volume,
    timestamp: data.timestamp
  };

  //send to database
  cryptoviewdb.insert(doc, function(err, res) {
    if (err) {
      console.log(err);
    } else {
      var date = (new Date()).toLocaleString();
      console.log("doc created on ",date + " :\n", doc, "\n");
    }
  });
}

function getTickers() {

  URLs.forEach(function(URL) {
    getSourceData(URL, createDoc);
  });
}

// run every 30 seconds
setInterval(getTickers, 30000);
