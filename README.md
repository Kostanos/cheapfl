# Cheap flight search

## Features
* Search flights by source/destination location
  ex:

        from: Sydney, Australia
        to: New York, United States

* Multiple airports in source location is supported
  ex:

        from: Milan, Italy
        to: Sydney, Australia
        will check in MXP and LIN airports

* Parallel (async) search in all available airlines and in all location airports
* Search for multiple dates. Current date is taken into account
* Location autocomplete
* Date picker

## TODO

* Add more orders and filters - _js/flightsResult.js:40_
* Cache locations, as in general locations will not be changed so often, I recommend to cache it for at least 6 hours - _models/locations.js:5_
* return multiple missing fields at a time (Error handle) - _routes/api.js:40_
* cache airlines for at least 6 hours, will help a lot in performance, even cache for 10 min will help - _routes/api.js:51_
* support for multiple "destination airports" as there are many cities with multiple airports - _providers/flight.js:26_
* error handle for flight_search api endpoint - _providers/flight.js:48_

* fix form validation
* validate date if it is in the past
* validate if source and destination locations are not equal
* improve design
