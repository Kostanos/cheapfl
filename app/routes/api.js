var path = require('path');
var express = require('express');
var router = express.Router();
var flightProvider = require('../providers/flight');
var Exception = require('../models/exception');
var Locations = require('../models/locations');

router.get('/locations', function (req, res) {
  res.set('Content-Type', 'application/json');
  if (!('q' in req.query)){
    throw new Exception('Missing query parameter "q"', 'Missing parameter');
  }
  console.log('query: ', req.query.q);
  flightProvider.airports(
    req.query.q,
    function(data){
      var locations = Locations.fromAirports(data);
      res.send(JSON.stringify(locations));
    }
  );
});

router.get('/airlines', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify(flightProvider.airlines()));
});

router.get('/airports', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify(flightProvider.airports()));
});

// Expecting: {travelDate: '2018-05-05', airportsFrom: '["AAA", "AAB"]', airportsTo: '["BBB"]'}
// Currently only one toAirport supported, if multiple sent, the first one will be used
router.post('/search', function (req, res) {
  var date = 'travelDate' in req.body ? req.body.travelDate : null;
  var airportsFrom = 'airportsFrom' in req.body ? JSON.parse(req.body.airportsFrom) : null;
  var airportsTo = 'airportsTo' in req.body ? JSON.parse(req.body.airportsTo) : null;
  // TODO: return multiple missing fields at a time
  if (!date){
    throw new Exception('Missing travel date', 'Missing value');
  }
  if (!airportsFrom){
    throw new Exception('Missing from airport', 'Missing value');
  }
  if (!airportsTo){
    throw new Exception('Missing to airport', 'Missing value');
  }

  // TODO: cache airlines for at least 6 hours, will help a lot in performance, even cache for 10 min will help
  // Search in parallel in all airlines
  flightProvider.airlines(function(airlines){
    var flights = [];
    var promises = airlines.map(function(airline){
      var airlineCode = airline.code;
      return new Promise(function(resolve, reject){
        flightProvider.flightSearch(airlineCode, date, airportsFrom, airportsTo[0], function(data){
          Array.prototype.push.apply(flights, data);
          resolve();
        });
      });
    });
    Promise.all(promises)
    .then(function() {
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(flights));
    })
    .catch(console.error);
  });
});

module.exports = router;