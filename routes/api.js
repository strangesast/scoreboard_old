var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var config = require('../config');
var mongoUrl = config.mongoUrl;
var url = require('url');

var Db;

var validMethods = ['GET', 'POST', 'PUT', 'DELETE'];

// should be moved to config, probably
var collectionDefinitions = {
	'player_info' : 'playerDetails',
	'player_history' : 'playerHistory',
	'region_info' : 'regionDetails',
	'team_info' : 'teamDetails'
}

function retConPromise() {
	// return connection promise
	return new Promise(function(resolve, reject) {
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
	    });
		} else {
			resolve(Db);
		}
	});
}


function returnType(_params) {
	if(_params.length % 2 == 1) { return _params.slice(-1)[0]; } else return _params.slice(-2)[0];
}


function returnMatch(_params) {
	var _match = {};
	for(var i=0; i<Math.floor(_params.length/2)*2; i+=2) {
		var value = _params[i+1];
		// split out '+' to allow multiple objects
		var sp = value.split('+');
		// if more than one, replace text with array
		if(sp.length > 1) value = sp;

		_match[_params[i]] = value;
	}

	return _match;
}


function validateMatch(_match, _method) {
	// _match - object, _method - string
	// return false if combination of match and method is inappropriate
	var _keys = Object.keys(_match);
	if(_keys.length == 0) return true;
	if(_keys === undefined) return {'400' : 'match invalid'};

	for(var i=0; i<_keys.length; i++) {
		var _key = Object.keys(_match)[i]
		if(_match[_key].constructor == Array && _method != 'GET') {
			return {'400' : 'cannot add or modify >1 subobject, only retrieve or delete'}
		} else return true;
	}
}


function validateType(_type) {
	if(Object.keys(collectionDefinitions).indexOf(_type) == -1) {
		return {'400' : Object.keys(collectionDefinitions)}
	} else return true;
}


function Item(props) {
	// add all keys sent (probably dangerous)
	for(var key in props) {
		this[key] = props[key];
	}
}

Item.prototype.collection = function() {
	// return collection object from name (in promise object)
	var con = retConPromise();
	var collectionName = collectionDefinitions[this.type];

	if(collectionName === undefined) {
		return Promise.reject({'status' : 400, 'body' : 'invalid type'});
	}

	var col = con.then(function(db) {
		return db.collection(collectionName);
	}, function(err) {
		return err;
	});
	
	// return promise with collection (or error)
	return col;
}

Item.prototype.validate = function(required, unallowed) {
	var doc = this; // item properties
	var keys = Object.keys(doc);
	var req = keys.filter(function(n) {
		return required.indexOf(n) != -1;
	});
	var una = keys.filter(function(n) {
		return unallowed.indexOf(n) != -1;
	});
	// required/unallowed for all
	return req.length == required.length && una.length == 0;
}

Item.prototype.fetch = function() {
	// retrieve object in database
	if(_id in this) {
		// fetch by id in type
	};

	return this.id;
}

Item.prototype.store = function() {
	// store new document (POST), if _id specified, overwrite with
	// return promise
	var required = ['name']; 
	var unallowed = ['id'];
	if(this.validate(required, unallowed) !== true) {
		return Promise.reject({'status' : 400, 'body' : 'required key absent or invalid key used'});
	}
	// continue with operation

	var doc = this;
	// return promise that resolves to docs or fails to error stuffs
	return this.collection().then(function(col) {
		return new Promise(function(resolve, reject) {
			col.save(doc, function(err, docs) {
			  if(err !== null) return reject({'status' : 400, 'body' : err});
				if(docs == 1) resolve({'status' : 204});
			 	resolve({'status': 201, 'body' : docs});
		  });
		})
	});
}

Item.prototype.update = function() {
	return Promise.reject({'status' : 501});
}

// subclass player
function Player(props) {
	console.log('creating player');
	Item.call(this, props);
	this.type = 'player_info';
}

Player.prototype = Object.create(Item.prototype);

Player.prototype.validate = function(_method) {
	// currently, no specific validation for player vs all other items
	var valid = true;
	var required = []; 
	var unallowed = [];

	return Item.prototype.validate.call(this, required, unallowed) 
		&& valid;
}

// subclass region
function Region(props) {
	console.log('creating region');
	Item.call(this, props);
	this.type = 'region_info';
}

Region.prototype = Object.create(Item.prototype);

Region.prototype.validate = function(_method) {
	// currently, no specific validation for region vs all other items
	var valid = true;
	var required = []; 
	var unallowed = [];

	return Item.prototype.validate.call(this, required, unallowed) 
		&& valid;
}

// subclass player
function Team(props) {
	console.log('creating team');
	Item.call(this, props);
	this.type = 'team_info';
}

Team.prototype = Object.create(Item.prototype);

function PlayerHistory(props, history) {
	Item.call(this, props);
	this.type = 'player_history';
}

PlayerHistory.prototype = Object.create(Item.prototype);

// route object names to classes
var classDefs = {
	'player_info' : Player,
	'player_history' : PlayerHistory,
	'region_info' : Region,
	'team_info' : Team
}

function handleRequest(req, res) {
	var method = req.method;
	var body = req.body;
	var error = [];

	// content after first, required object type
	var optional = req.params[0]; 
	
	// convert backslash delimited url into search
	var opt = function() {if(optional) return optional.split('/'); else return [];}
	var params = [req.params.first].concat(opt());

	// what search parameters are defined
	var match = returnMatch(params);

	// if improper, return 400, halt processing
	var match_valid = validateMatch(match, method);
	if(match_valid != true) error.push(match_valid);

	var type = returnType(params);
	var result;
	var prom;
	
	if(!(type in classDefs)) {
		prom = Promise.reject({'status': 400, 'body': 'invalid type'});
	} else {
		var object = new classDefs[type](body);
	}
	
	if(['PUT', 'POST'].indexOf(method) > -1 && error.length < 1) {

		prom = prom || object.store();

		prom.then(function(result) {
			if('status' in result) {
				res.status(result.status);
			  res.send(result.body);
			} else {
				res.status(500);
				res.send();
			}

		}, function(err) {
			console.log('error');
			res.status(err.status);
			res.send(err.body);
		});

  // generate search parameters
	} else if (['GET', 'DELETE'].indexOf(method) > -1 && error.length < 1) {
		
		res.send([match, object]);

		
  // method not PUT, POST, GET, or DELETE
	} else if (!error) {
		res.status = 400;
		res.json('invalid method');

  // respond with error
	} else {
		res.send(error);
	}
}


router.all('/', function(req, res) {
	res.statusCode = 400;
	res.json('must operate on object');
});

router.all('/:first', handleRequest);
router.all('/:first/*', handleRequest);



module.exports = router;
