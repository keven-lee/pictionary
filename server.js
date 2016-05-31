process.env.NODE_ENV = process.env.NODE_ENV || "development";
var port = process.env.PORT || 8080;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var socketEvents = require('./socketEvents');

app.use(express.static('public'));

io.on('connection', socketEvents);

server.listen(port);

