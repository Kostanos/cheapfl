var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var main = require('./app/routes/main');
var api = require('./app/routes/api');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(main);
app.use(api);
app.use(express.static('public'));
// Error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  console.log(err);
  res.set('Content-Type', 'application/json');
  res.status(500).send(err);
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
})
