var express = require('express');
var net = require('net');
var router = express.Router();
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
var config = require('../config');
var mongoUrl = config.mongoUrl;
var Promise = require('es6-promise').Promise;

var db;
var tcpListeners = [];

var regionSchema = Schema({
	name : String
});

var Region = mongoose.model('Region', regionSchema);

function addSocketConnection(url, port) {
	return new Promise(function(resolve, reject) {
		var con = net.createConnection(port, url);
		con.on('error', function(err) {
			console.log('err');
			console.log(err);
		})
		con.on('data', function(data) {
			console.log(data);
		})
		resolve(url + ':' + port);
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
	var ip = req.query.address || req.ip;
	addSocketConnection(ip, port).then(function(result) {
		res.json(result)
	}).catch(function(err) {
		next(new Error(err));
	});

});

router.route('/region')
.get(function(req, res, next) {
})
.post(function(req, res, next) {
	res.json('toast');
	
})
.put(function(req, res, next) {
	res.json('toast');

})
.all(function(req, res, next) {
	res.json('toast');
	
});


module.exports = router;
