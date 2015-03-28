var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var mongoClient = mongodb.MongoClient;
var config = require('../config');
var mongoUrl = config.mongoUrl;
var url = require('url');
var Promise = require('es6-promise').Promise;

// "event" list is stored for an entire region.  adding to message queue
// notified clients and client-servers of change as well as adding to actual
// relevant objects in /api/

router.post('*', function(req, res, next) {
	// general verifications
	next();
})

router.route('/')
.all(function(req, res, next) {
  // list all available "live" objects, probably
	res.json('ok');
})


router.route('/region/:regionIdentifier?')
.get(function(req, res, next) {
// if !regionIdentifier, list available live regions
  var regionIdentifier = req.params.regionIdentifier;
	if(regionIdentifier === undefined) {
		// return list of live regions 
		res.json('live regions:');
	} else {
// else ask to listen for changes in that region
	  res.json(regionIdentifier);
	}
})
// require that a region is provided
.all(function(req, res, next) {
  var body = req.body;
	if(!('region' in body) || !ObjectID.isValid(body.region)) {
		next(new Error('you done fucked up'));
	} else return next();
})
.post(function(req, res, next) {
// add to live stack, send corresponding messages
	res.json(req.params.regionIdentifier);
});


module.exports = router;
