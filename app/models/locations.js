var _ = require('underscore');

module.exports = {
  // Will get locations from list of airports
  // TODO: Cache locations, as in general locations will not be changed so often, I recommend to cache it for at least 6 hours
  fromAirports: function(airports){
    return _.values(airports.reduce(function(acc, val){
      var key = val.cityName + ', ' + val.countryName;
      if (key in acc){
        acc[key].data.push(val.airportCode);
      } else {
        acc[key] = {
          data: [val.airportCode],
          text: key
        }
      }
      acc[key].id = JSON.stringify(acc[key].data);
      // {id: '["AAL"]', data: ['AAL'], text: 'Aalborg, Denmark'}
      return acc;
    }, {}));
  }
}