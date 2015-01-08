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


function returnConnection(_url) {
  return new Promise(function(resolve, reject) {
		if(Db === undefined) {
		  mongoClient.connect(_url, function(err, db) {
				if(err) {
					console.log('failed to connect to ' + mongoUrl);
					reject(Error(err));
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
	if(_params.length % 2) { return _params.slice(-1)[0]; } else return _params.slice(-2)[0];
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
	// return false if combination of match and method is inappropriate
	console.log('match');
	console.log(_match);
	var _keys = Object.keys(_match);
	for(var i=0; i<_keys; i++) {
		var _key = Object.keys(_match)[i]
		// HERE
		if(_match[_key].constructor == Array && _method != 'GET') {
			return {'400' : 'cannot add or modify >1 subobject, only retrieve or delete'}
		} else return true;
	}
}


function validateType(_type) {
	if(Object.keys(collectionDefinitions).indexOf(_type) == -1) {
		return {'400' : 'invalid object name'}
	} else return true;
}


function returnQuery(_type, _match) {
	var col = collectionDefinitions[_type];
	if(col === undefined) {
		return null
	}
	return collectionDefinitions[_type];
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
	console.log(match);
	if(match_valid != true) error.push(match_valid);


	// extract type; what kind of object is being retrieved/added
	var type = returnType(params);
	var type_valid = validateType(type);
	if(type_valid != true) error.push(type_valid);

	var result;
	// generate class to be added or modified
	if(['PUT', 'POST'].indexOf(method) > -1 && error.length < 1) {
		// generate class object

		// result should be copy of exact object(s) stored
		res.send(result);

  // generate search parameters
	} else if (['GET', 'DELETE'].indexOf(method) > -1 && error.length < 1) {
		result = returnQuery(type, match);
		result = match;
		console.log(match);


		// result should be items retrieved
		res.send(result);

  // method not PUT, POST, GET, or DELETE
	} else if (!error) {
		res.statusCode = 400;
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

router.all('/:first/*', handleRequest);



module.exports = router;
