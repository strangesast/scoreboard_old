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
	'region' : [],
	'player' : ['region', 'name'],
	'game' : ['region'],
	'server': ['region', 'address']
};

var reqPropForType = {
	'region' : [],
	'player' : [],
	'game' : [],
	'server': []
}

function validateProperties(_type, _document) {
	var _doc = {};
	for(var key in _document) {
		//
		if(propForType[_type].indexOf(key) > -1 || standard.indexOf(key) > -1) {
			_doc[key] = _document[key];
		}
		// return false if required key missing
		if(reqPropForType[_type].indexOf(key) < 0) {
			return false;
		}
	}
	return _doc;
}


function handleError(_res, _error) {
	if(_error.hasOwnProperty('status')) _res.status(_error.status);
	_res.json(_error.message);
}


// validation for all types and locations
router.all('/*', function(req, res, next) {
	console.log(1);
	var method = req.method;
	if(['GET', 'POST', 'DELETE', 'PUT'].indexOf(method) < 0) {
		res.status(405).json('method not implemented');
	} else next();
});


// for adding new regions
// case sensitive (should fix this)
router.route('/')
.post(function(req, res, next) {
  console.log(2);
	var body = req.body;
	if(!('type' in body && 'name' in body)) next(new Error('type and name required'));
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

			var _doc = validateProperties(body.type, body); // validate keys
			console.log(_doc);
			return insertByDoc(_doc);

		}).then(function(_docAdded) {
			res.json(_docAdded);

		}).catch(function(err) {
			console.log(err);
			res.json(err);
		});
	}
})
.get(function(req, res, next) {
  next('route');
}).all(function(req, res, next) {
  next(new Error('method not supported at ' + req.path));
})


// validate region
router.route('/:region*')
.all(function(req, res, next) {
// regionName --> unique string defined (or generated) by the user on creation
	console.log(2);
	var body = req.body;
	var region = req.params.region;
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


router.all('/:regionId/:objectType/:objectId?', function(req, res, next) {
	console.log(3)
	var obj = {};
	obj.type = req.params.objectType;
	obj.region = req.region._id;
	var _id = req.params.id;
	if(_id !== undefined) obj.id = _id;
	req.object = obj;

	next();
});


router.post('/:regionId/:objectType/:objectId?', function(req, res, next) {
	var body = req.body || {};
	console.log(4);
	console.log(body);
	for(var key in req.object) {
		body[key] = req.object[key];
	}
	var doc = validateProperties(req.object.type, body);

	res.json(doc);
});


router.get('/:regionId/:objectType/:objectId?', function(req, res, next) {
	console.log('looking for:');
	var _qu = req.object;
	_qu.region = req.region._id;
	console.log(_qu);
	//_qu.region = req.region.id
	findByQu(req.object).then(function(docs) {
		res.json(docs);
	}).catch(function(err) {
		res.status(err.status || 500).json(err);
	});
});

//router.get('/:region/:objectType/:objectId', function(req, res, next) {
//  res.json(req.region);
//});

// return general data regarding region
router.route('/:regionId')
.get(function(req, res, next) {
	res.json(req.region);
})
// HERE.  the following needs to be extended for list of docs
.post(function(req, res, next) {
	var doc = req.object || {};
	if(req.body.type == undefined) next(new Error('no type specifed')); return;

	doc.region = req.region._id;
	doc = validateProperties(req.body.type, doc); 

	insertByDoc(doc).then(function(docs) {
		res.json(docs);
	});

});


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
