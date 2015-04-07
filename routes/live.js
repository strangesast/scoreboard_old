var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('../config');
var mongoUrl = config.mongoUrl;
var url = require('url');
var Promise = require('es6-promise').Promise;
var WebSocketServer = require('ws').Server,
	  wss = new WebSocketServer({port : 3030});
var models = require('../models');
var net = require('net');
var JsonSocket = require('json-socket');


var port = 8083;
var server = net.createServer();
server.on('connection', function(socket) {
	console.log('socket connected');
	socket = new JsonSocket(socket);
	socket.sendMessage({message: 'toast!'}, function(err, obj) {
		if(err) console.log(err);
		else console.log('socket message sent')
	})

	socket.on('message', function(message) {
		console.log(message);
	})
	
}).listen(port, function(err, obj) {
	console.log('listening on on %s', port);
});


var default_limit = 50;

var db;

var verifyDb;
(verifyDb = function() {
	// verify that connection to the database is valid/available
	return new Promise(function(resolve, reject) {
		var db = db || mongoose.connection;
	  if(db._listening) resolve();
	  else {
	  	mongoose.connect(mongoUrl, function(err) {
	  		if(err) reject(err);
	  		console.log('Connected at %s', mongoUrl);
	  	  db = mongoose.connection;
				resolve();
	  	});
	  }
	});
})();

router.use(function(req, res, next) {
	verifyDb().then(
		function() {next(); },
		function(err) {next(new Error(err))}
  );
});

router.get('/', function(req, res, next) {
	var Model = models.Models['action'];
	// return the last 50 actions, or limit as specified
  Model.find({}).limit(req.query.limit || default_limit).exec(function(err, docs) {
  	if(err) return next(new Error(err));
  	res.json(docs);
  });

})

var tcp_listeners = {};
var ws_listeners = {};

// websocket server (probably a bad place for this)
wss.on('connection', function(ws) {
	ws.on('message', function(message) {

	});

	ws.send('cool');
})

// listen for new actions
models.events.on('action', function(action) {
	console.log(action);
  // if action matches any of the listeners, "join" it and send
})



module.exports = router;
