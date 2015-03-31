var express = require('express');
var net = require('net');
var router = express.Router();
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
var config = require('../config')
    , mongoUrl = config.mongoUrl;
var Promise = require('es6-promise').Promise;
var models = require('../models');

var db;
var listeners = {};

// add connection to available connections or timeout
// *****attach to mongoose schema, on changed listener*****
function addSocketConnection(url, port) {
	var name = url + ':' + port;
	if(name in listeners) return Promise.resolve(null);
	var test = new Promise(function(resolve, reject) {
		var sock = net.connect(port, url);
		sock.name = name;
	  sock.once('connect', function(e) {
			sock.write('success');
		  resolve(sock);
		});
		sock.on('error', function(e) {
			resolve(null);
			sock.destroy();
		});
		sock.on('close', function(e) {
			var index = listeners.indexOf(sock.name);
			if(index > -1) listeners.splice(index, 1);
		})
	});

	// timeout after 1000ms if connection not established
	var timeout = new Promise(function(resolve, reject) {
		setTimeout(resolve, 1000, null);
	})
	return Promise.race([test, timeout]).then(function(socket) {
		if(socket !== null) listeners[socket.name] = socket;
		return true;
	});
}

router.use(function(req, res, next) {
	// verify that connection to the database is valid/available
	var db = db || mongoose.connection;
	if(db._listening) next();
	else {
		mongoose.connect(mongoUrl, function(err) {
			if(err) return next(new Error('database error'));
			console.log('Connected at %s', mongoUrl);
		  db = mongoose.connection;
			next();
		});
	}
})

router.all('/', function(req, res, next) {
	res.json("hi");
})

// check for request for socket connection for message stream, future events
// in this region will be passed
router.get('*', function(req, res, next) {
	// return details of new connection or, if invalid, do next()
	var port = req.query.port;
	var ip = req.query.address || // get specified ip
	     req.headers['x-forwarded-for'] ||  // get request ip
	     req.connection.remoteAddress || 
	     req.socket.remoteAddress ||
	     req.connection.socket.remoteAddress;
	if(port === undefined || !net.isIP(ip)) return next();
	addSocketConnection(ip, port).then(function(result) {
		res.json(result)
	}).catch(function(err) {
		next(new Error(err));
	});
});

router.route('/region')
.get(function(req, res, next) {
	res.json(req.method);
})
.post(function(req, res, next) {
	res.json(req.method);
	
})
.put(function(req, res, next) {
	res.json(req.method);

})
.all(function(req, res, next) {
	res.json(req.method);

});


module.exports = router;
