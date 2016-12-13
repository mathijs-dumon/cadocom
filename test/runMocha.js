process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.TEST_ENV = process.env.TEST_ENV || 'test';

var exit = process.exit;
process.exit = function (code) {
  setTimeout(function () {
      exit();
  }, 200);
};

// Launch api server on localhost:8081:
var app = require('../app');
var http = require('http');
app.set('port', '8081');
var server = http.createServer(app);
server.listen('8081');

require('../node_modules/mocha/bin/_mocha');