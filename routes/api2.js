var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var mongoClient = mongodb.MongoClient;
var config = require('../config');
var mongoUrl = config.mongoUrl;
var url = require('url');


// all 'api' calls use db 'scoreboard-data' (live events use 'scoreboard-live')

var Db; // db object to make all calls through

function getDbConnection(_address) {
	// return connection promise
	return new Promise(function(resolve, reject) {
		if(Db === undefined) {
		  mongoClient.connect(_address, function(err, db) {
		    if(err) {
		    	console.log('failed to connect to ' + mongoUrl);
		    	reject(err);
		    } else {
	        console.log('mongo connection to ' + mongoUrl);
		    	Db = db;
		      resolve(db);
		    }
	    });
		} else {
			resolve(Db);
		}
	});
}


// validation for all types and locations
router.all('/', function(req, res, next) {
	var method = req.method;
	if(['GET', 'POST', 'DELETE', 'PUT'].indexOf(method) < 0) {
		res.status(405).send({'error': 'method not implemented'});
	} else {
		next();
	}
});

// validate region
router.all('/:regionId', function(req, res, next) {
	var region = req.params.regionId;
	var valid = ObjectID.isValid(region);
	if(valid) next();
	else res.json({'error' : 'invalid region id'});
});


// return general data regarding region
router.get('/:regionId', function(req, res, next) {
	res.json("region " + req.params.regionId.slice(0, 3) + "... general data");
})

// validation for object ids, GET
router.get('/:regionId/:objectName/:objectValue?', function(req, res, next) {
	var region = req.params.regionId;
	var type = req.params.objectName;
	var val = req.params.objectValue;

	var dbconn = getDbConnection(mongoUrl);
	if(typeof val === 'undefined') {
		// fetch all in region of type 'type'
		dbconn.then(function() {})
		res.json([type]);

	} else {
		// fetch in region matching 'type' and 'val'
	  res.json([type, val]);
	}

	// probably a better place for this
	dbconn.catch(function(error) {
		res.status(500).json({'error' : 'db connection error'});
	});

});

router.get('/', function(req, res) {
	res.json('not cool');
});

module.exports = router;
