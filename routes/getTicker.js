var express = require('express');
var router = express.Router();

//Variables
var LEVELDATA = "";

//NANO
var DBHOST = "192.168.178.2";
var DBPORT = "5984";
var DESIGNNAME = "tickerviews";
var VIEWNAME = "";
var nano = require('nano')('http://' + DBHOST + ":" + DBPORT);
var cryptoviewdb = nano.db.use('cryptodb');

/**
 * last ticker entry from db
 */
router.get('/latest', function(req, res) {

  //console logging
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('original URL:', fullUrl);
  console.log('query:',req.query);

  VIEWNAME = req.query.view;

  //check input
  if (VIEWNAME == ""){
    res.send('Error: (part of) input qeury empty');
    res.end();
    return;

  } else {

    cryptoviewdb.view(DESIGNNAME, VIEWNAME, {
      'group_level': 6,
      'descending': true,
      'limit': 1
    }, function(err, body){
      if (!err) {
        console.log('latest res: ', body);
        res.send(body);
        res.end();
      } else {
        console.log(err);
      }
    });
  }
});


/* GET Ticker data from db */
router.get('/', function(req, res) {

  //console logging
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('original URL:', fullUrl);
  console.log('query:',req.query);

  VIEWNAME = req.query.view;
  LEVELDATA = req.query.level;


  //check input
  if (VIEWNAME == "" || LEVELDATA == "" ){
    res.send('Error: (part of) input qeury empty');
    res.end();
    return;
  }

else {

    cryptoviewdb.view(DESIGNNAME, VIEWNAME, {
      'group_level': LEVELDATA
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
