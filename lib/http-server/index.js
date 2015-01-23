var http = require('http');
var app = require('./app');
var config = require('../config');

http.createServer(app).listen(config.httpServer.port);
