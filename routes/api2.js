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


function findByQu(qu, lm) {
	var lm = lm || {};
	return new Promise(function(resolve, reject) {
		getDbConnection().then(function(db) {
		  db.collection('history').find(qu, lm).toArray(function(err, docs) {
		  	if(err) reject(err);
		  	resolve(docs);
			});
		});
	});
}


function insertByDoc(doc) {
	var _doc = validateProperties(doc);
	if(_doc==false) return Promise.reject(new Error('required property missing'));
	return new Promise(function(resolve, reject) {
		getDbConnection().then(function(db) {
		  db.collection('history').insert(_doc, function(err, docs) {
		  	if(err) reject(err);
		  	resolve(docs);
		  });
		});
	});
}

function insertByManyDocs(docs) {
	var _docs = [];
	for(var i in docs) _docs[i] = validateProperties(docs[i], true);
	return new Promise(function(resolve, reject) {
		getDbConnection().then(function(db) {
		  db.collection('history').insert(_docs, function(err, records) {
		  	if(err) reject(err);
		  	else resolve(records);
		  });
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
	'region' : ['type'],
	'player' : ['type', 'name'],
	'game' : ['type'],
	'server': ['type']
}

function validateProperties(_document, _safe) {
	// if _safe is false, unallowed prop will be stripped
	var _fail = false;
	var _doc = {};
	if(typeof _document !== 'object') return false;
	if(!('type' in _document)) return false;

	for(var i in reqPropForType[_document.type]) {
    if(!(reqPropForType[_document.type][i] in _document)) return false;
	}
	for(var key in _document) {
		if(propForType[_document.type].indexOf(key) > -1 || standard.indexOf(key) > -1) {
			_doc[key] = _document[key];
		} else {
			_fail = true;
		}
	}
	if(_safe && _fail) return false;

	return _doc;
}


function handleError(_res, _error) {
	if(_error.hasOwnProperty('status')) _res.status(_error.status);
	_res.json(_error.message);
}


// validation for all types and locations
router.all('*', function(req, res, next) {
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
	if(!('type' in body && 'name' in body)) {
	console.log(body);
		var _err = new Error('type and name required');
		_err.status = 400;
		next(_err);
	}
	else if(body.type != 'region') next(new Error('root only for new regions'));
	else {
		var _qu = {
			'type' : 'region',
			'name' : body.name
		};
	  findByQu(_qu).then(function(_found) {
			// region name already exists
			if(_found.length > 0) {
				var _err = new Error('region name already exists');
				_err.status = 409;
			  return Promise.reject(_err);
			}

			
			return insertByDoc(body);

		}).then(function(_docAdded) {
			res.json(_docAdded);

		}).catch(function(err) {
			next(err);
		});
	}
})
.get(function(req, res, next) {
  next('route');
}).all(function(req, res, next) {
  var _err = new Error('method not supported at ' + req.path);
	_err.status = 400;
	next(_err);
})


router.param('region', function(req, res, next, id) {
	req.params.region = ObjectID.isValid(id) ? id.toLowerCase() : id;
	next();
});


// validate region
router.route('/:region*')
.all(function(req, res, next) {
	var region = req.params.region;
	var _prom = new Promise(function(resolve, reject) {
		if(ObjectID.isValid(region)) {
			console.log('1');
		  // valid id, check if id exists in db
			resolve(findById(region));

		} else {
		  var _qu = {};
		 	_qu.type = 'region';
		 	_qu.name = region;
	    var _search = findByQu(_qu).then(function(_found) {
		  	if(_found.length > 0) {
		  		return _found[0]; // region set to id of first response
		  	} else {
				  var _err = new Error('invalid region id');
					_err.status = 400;
					return Promise.reject(_err);
				}
		  });

			resolve(_search);
		}
	}).then(function(val) {
		req.region = val;
		next();

	}).catch(function(err) {
		next(err);
	});

});


router.route('/:region/:objectType/:objectProp?/:objectVal?')
// access objects of type 'objectVal'
// if objectVal
.all(function(req, res, next) {
	console.log('region: ' + req.params.region);
	console.log('type:   ' + req.params.objectType);
	console.log('prop:   ' + req.params.objectProp);
	console.log('val:    ' + req.params.objectVal);

	next();
})
.get(function(req, res, next) {

	var _qu = {};
	var _lm = {};

	_qu.type = req.params.objectType;
	_qu.region = req.region._id;
	if(req.params.objectProp !== undefined) {
		if(req.params.objectVal !== undefined) {
		  _qu[req.params.objectProp] = req.params.objectVal;
		} else {
	  // limit search of 'region', 'objectType' to response with 'objectProp'
			_lm[req.params.objectProp] = 1;
		}
	}

	findByQu(_qu, _lm).then(function(docs) {
		res.json([_qu, _lm, docs]);
	}).catch(function(err) {
		next(err);
	});
})
.post(function(req, res, next) {
	var _err = new Error('url not supported for this method');
	_err.status = 400;
	next(_err);
})
.put(function(req, res, next) {
	// single objects (or several objects that match qu in req.body) can be modified here
	next();
});




router.route('/:regionId')
.get(function(req, res, next) {
	res.json(req.region);
})
// HERE.  the following needs to be extended for list of docs
.post(function(req, res, next) {
	// {
	// 0 : {'type' : 'player',
	//      'name' : {'first' : 'Sam', 'last' : 'Zagrobelny'}
	//      },
	// 1 : {'type' : 'player',
	// 			'name' : {'first' : 'Jerry, 'last' : 'John'}
	// 			}
	// }

	var body = req.body;
	var _err = new Error('invalid format');
	_err.status = 400;
	for(var key in body) if(isNaN(key)) return next(_err);
	
	for(var key in body) {
		body[key].region = req.region._id
	}

	insertByManyDocs(body).then(function(docs) {
		res.json(docs);
	}).catch(function(err) {
		var _err = new Error(err);
		_err.status = 500;
		next(_err);
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
