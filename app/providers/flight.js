var baseHost = 'node.locomote.com';
var basePath = '/code-task/';
var baseProtocol = 'http:';
var http = require('http');
var Exception = require('../models/exception');
var url = require('url');

var getJson = function(url, callback){
  req = http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
      body += chunk;
    });

    res.on('end', function(){
      var response = JSON.parse(body);
      callback(response);
    });
  }).on('error', function(e){
    throw new Exception(e.message);
  });
}

module.exports = {
  // TODO: support for multiple "destination airports" as there are many cities with multiple airports
  flightSearch: function(airlineCode, date, fromAirports, toAirport, callback){
    var flights = [];
    var promises = fromAirports.map(function (fromAirport) {
      return new Promise(function(resolve, reject){
        getJson(url.format({
          hostname: baseHost,
          protocol: baseProtocol,
          pathname: basePath + 'flight_search/' + airlineCode,
          query: {date: date, from: fromAirport, to: toAirport}
        }),
        function(data){
          Array.prototype.push.apply(flights, data);
          resolve();
        });
      });
    });
    Promise.all(promises)
    .then(function() {
      callback(flights);
    })
    // TODO: error handle for flight_search api endpoint
    .catch(console.error);
  },

  airlines: function(callback){
    getJson(url.format({
      hostname: baseHost,
      protocol: baseProtocol,
      pathname: basePath + 'airlines',
    }), callback);
  },

  airports: function(query, callback){
    getJson(url.format({
      hostname: baseHost,
      protocol: baseProtocol,
      pathname: basePath + 'airports',
      query: {q: query},
    }), callback);
  }
};
