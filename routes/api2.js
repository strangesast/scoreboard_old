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
var connecting = false; // prevent issues from two quick calls to getDbConnection

function getDbConnection() {
	// return connection promise
	return new Promise(function(resolve, reject) {
		var wait = connecting ? 1000 : 0;
		connecting = true;
		setTimeout(function() {
		  if(Db === undefined) {
		    mongoClient.connect(mongoUrl, function(err, db) {
		      if(err) {
		      	console.log('failed to connect to ' + mongoUrl);
		      	reject(err);
		      } else {
	          console.log('mongo connection to ' + mongoUrl);
		      	Db = db;
		        resolve(db);
		      }
			    connecting = false;
	      });
		  } else {
		  	resolve(Db);
			  connecting = false;
		  }
		}, wait);
	});
}


function findById(id) {
	if(typeof id === 'string') id = ObjectID(id);
	return new Promise(function(resolve, reject) {
		getDbConnection().then(function(db) {
			db.collection('history').find({'_id': id}).toArray(function(err, docs) {
		  	if(err) reject(err);
				resolve(docs.slice(0, 1)[0]);
			});
		})
	});
}


function findByQu(qu) {
	return new Promise(function(resolve, reject) {
		getDbConnection().then(function(db) {
		  db.collection('history').find(qu).toArray(function(err, docs) {
		  	if(err) reject(err);
		  	resolve(docs);
			});
		});
	});
}


function insertByDoc(doc) {
	return new Promise(function(resolve, reject) {
		getDbConnection().then(function(db) {
		  db.collection('history').insert(doc, function(err, docs) {
		  	if(err) reject(err);
		  	resolve(docs);
		  });
			resolve(doc);
		});
	});
}

// allowed properites
var standard = ['name', 'type'];
var propForType = {
	'region' : []
};

function allowedProperties(_type, _document) {
	var _doc = {};
	for(var key in _document) {
		if(propForType[_type].indexOf(key) > -1 || standard.indexOf(key) > -1) {
			_doc[key] = _document[key];
		}
	}
	return _doc;
}


function handleError(_res, _error) {
	if(_error.hasOwnProperty('status')) _res.status(_error.status);
	_res.json(_error.message);
}


// validation for all types and locations
router.all('/', function(req, res, next) {
	var method = req.method;
	if(['GET', 'POST', 'DELETE', 'PUT'].indexOf(method) < 0) {
		res.status(405).json('method not implemented');
	} else next();
});


// for adding new regions
// case sensitive (should fix this)
router.post('/', function(req, res, next) {
	var body = req.body;
	if(!('type' in body && 'name' in body)) next();
	else if(body.type != 'region') next(new Error('root only for new regions'));
	else {
		var _qu = {
			'type' : 'region',
			'name' : body.name
		};
	  findByQu(_qu).then(function(_found) {
			// region name already exists
			if(_found.length > 0)
			return Promise.reject({'message':'region name already exists', 'status': 409});

			var _doc = allowedProperties(body.type, body); // validate keys
			console.log(_doc);
			return insertByDoc(_doc);

		}).then(function(_docAdded) {
			res.json(_docAdded);

		}).catch(function(err) {
			console.log(err);
			res.json(err);
		});
	}
});


// validate region
router.all('/:regionIdOrName*', function(req, res, next) {
// regionName --> unique string defined (or generated) by the user on creation
	console.log(1);
	var body = req.body;
	var region = req.params.regionIdOrName;
	var valid = ObjectID.isValid(region);
	new Promise(function(resolve, reject) {
		if(!valid) {
		  var _qu = {
		  	'type' : 'region',
		  	'name' : region
		  };
	    findByQu(_qu).then(function(_found) {
		  	if(_found.length > 0) {
		  		region = _found[0]; // region set to id of first response
					resolve(region);
		  	} 
	      reject({'error' : 'invalid region id'});
		  });
		} else {
  	  resolve(findById(region));
		}
	}).then(function(val) {
		req.region = val;

		next();

	}).catch(function(err) {
		if(err.hasOwnProperty('status')) res.status(err.status);
		else if(err.hasOwnProperty('message')) res.json(err.message);
		else res.json(err);
	});

});


router.get('/*/:objectName/:objectValue', function(req, res, next) {
	console.log(2);
	next();
});

// validation for object ids, GET
router.get('/:regionId/:objectName/:objectValue?', function(req, res, next) {
	console.log('3');
	var region = req.params.regionId;
	var type = req.params.objectName;
	var val = req.params.objectValue;

	next();
});

// return general data regarding region
router.get('/:regionId', function(req, res, next) {
	res.json(req.region);
})


// list all regions (only for testing)
router.get('/', function(req, res) {
	var _qu = {'type' : 'region'};
	findByQu(_qu).then(function(_found) {
		res.json(_found);
	}).catch(function(err) {
		console.log(err);
		res.json(err);
	});
	
});


module.exports = router;
