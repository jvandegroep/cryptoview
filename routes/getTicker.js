var express = require('express');
var router = express.Router();

//Variables
var VIEW = "";
var levelData = "";

//NANO
var DBHOST = "192.168.178.2";
var DBPORT = "5984";
var DESIGNNAME = "tickerviews";
var VIEWNAME = "";
var nano = require('nano')('http://' + DBHOST + ":" + DBPORT);
var cryptoviewdb = nano.db.use('cryptodb');

/* GET getTicker page */
router.get('/', function(req, res) {

  //console logging
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('original URL:', fullUrl);
  console.log('query:',req.query);

  VIEWNAME = req.query.view;
  levelData = req.query.level;


  //check input
  if (VIEWNAME == "" || levelData == "" ){
    res.send('Error: (part of) input qeury empty');
    res.end();
    return;
  }

else {

    cryptoviewdb.view(DESIGNNAME, VIEWNAME, {
      'group_level': levelData
    }, function(err, body) {
      if (!err) {
        res.send(body);
        res.end();
      } else {
        console.log(err);
      }
    });
  }
});

module.exports = router;
