var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var config = require('../config');
var mongoUrl = config.mongoUrl;

var Db;
var validMethods = ['GET', 'POST', 'PUT', 'DELETE'];


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



function getObject(_col, _what) {
	returnConnection(mongoUrl).then(function(db) {}, function(err) {});
	
}

function doAction(_where, _what, _method) {
	return new Promise(function(resolve, reject) {
	  returnConnection(mongoUrl)
		.then(function(db) { return db.collection(_where.type[0]);})
		.then(function(_col) {
			var q;
	    if(_method == 'GET') {
		  	if(_what._id) {
		  		q = _col.find({'_id' : _what._id});
		  	} else {
		  		q = _col.find(_what);
		  	}
		  	q.toArray(function(err, docs) {
		  		if(err) {reject(err)} else {
		  			resolve(docs);
		  		}
		  	});

	    } else if (_method == 'POST') {
		  	_col.insert(_what, function(err, docs) {
					if(err) {reject(err)} else {
						resolve(docs)
					}
				});

	    } else if (_method == 'PUT') {
				_col.update({'_id' : _what._id}, _what, function(err, docs) {
					if(err) {reject(err)} else {
					  resolve(docs);
					}
				});

	    } else if (_method == 'DELETE') {

	    }
	  });
	});
}

function passAction(_where, _what, _method) {
	return new Promise(function(resolve, reject) {
		if(_where.type == 'player') {
			_what.type = 'player';
			if(_where.team_id) {_what.team = _where.team_id}
			doAction(_where, _what, _method).then(function(response) {
				resolve(response);
			}, function(err) {
				reject(400);
			});;
		} else if (_where.type == 'team') {
			// invalid params for this type
			if(_where.player_id) { reject(400); } else {
			  resolve(_what);
			}
		} else if (_where.type == 'region') {
			// invalid params for this type
			if(_where.player_id || _where.team_id) {reject(400)} else {
			  resolve(_what);
			}
		} else {
			reject(404);
		}
	});
}


function handleRequest(req, res) {
  var keys = Object.keys(req.params);
  var where = {};
	var what = req.body;
	var method = req.method;
  for(var i=0; i < keys.length; i++) {
  	where[keys[i]] = req.params[keys[i]].split("+");
  }
	passAction(where, what, method).then(function(obj) {
		res.send(obj);
	}, function(err) {
		res.status(err);
		res.send();
	});
}



router.all('/:type/:region_id/:team_id/:player_id', handleRequest);
router.all('/:type/:region_id/:team_id', handleRequest);
router.all('/:type/:region_id', handleRequest);
router.all('/:type', handleRequest);


module.exports = router;

//function buildQueryObject(_where, _what, _method) {
//	// GET, each _where param may be length > 1, other methods just one
//	var cn; // collectionName
//	var ob; // queryObject
//	if(_where.player) {
//		// /api/regionName/teamName/player
//
//		// if PUT: modifying a player object with particular id, with _what
//		if (_method == 'PUT') {
//			// update: <query>, <update>, <writeConcern>
//			// _what must at least be _id == _where.player
//			_what._id = _where.player[0];
//			_what.type = 'player';
//			ob = [{'_id':_where.player[0]}, _what];
//			cn = _where.regionName[0];
//
//		// if GET: return player matching _where.player (_id), ignore _what
//	  } else if(_method == 'GET') { 
//			// find: <query>
//			// return objects that qualify 
//			ob = [{'$and' : [
//				  { '_id' : { '$in': _where.player }},
//				  { 'team' : {'$in' : _where.teamName}},
//					{ 'type' : 'player' } //,
//					// {'regionName' : {'$in' : _where.regionName }}
//				]}];
//			cn = _where.regionName;
//		}
//
//	} else if (_where.teamName) {
//		// /api/regionName/teamName
//		// if POST: adding a player on _where.teamName with _what
//		if (_method == 'POST') {
//			// team must be consistent
//			_what.team = _where.teamName[0];
//			_what.region = _where.regionName[0];
//			_what.type = 'player';
//			ob = [_what];
//			cn = _where[0];
//
//		// if PUT: modifying team of _id == _where.teamName with _what
//		} else if (_method == 'PUT') {
//			_what.region = _where.regionName[0];
//			_what._id = _where.teamName[0];
//			_what.type = 'team';
//			ob = [{'_id' : _where.teamName[0]}, _what];
//			cn = _where.regionName[0];
//			
//		// if GET && _what == undefined: return team object of _where.teamName
//		} else if (_method == 'GET' && _what === undefined) {
//			cn = _where;
//
//		// if GET && _what: get player on _where.teamName matching _what
//		} else if (_method == 'GET') {
//			cn = _where;
//
//		}
//
//	} else if (_where.regionName) {
//		// /api/regionName
//		// if POST: add team in region _where.regionName
//		if (_method == 'POST') {
//
//		// if PUT: modifying region of _where.regionName
//		} else if (method == 'PUT') {
//
//		// if GET: return region where _id == _where.regionName
//		} else if(_method == 'GET') {
//			cn = _where;
//
//		}
//	}
//
//	// which collection, which query object to pass to mongo
//	return {'collectionName' : cn, 'queryObject': ob};
//}






//function count(callback, data) {
//	get(function(_data) {
//    var response =  [];
//		for(var i=0; i<_data.length; i++) {
//			response[i] = _data[i].length;
//		}
//		callback(response);
//	}, data);
//}
//
//
//function get(callback, data) {
//	var what = data.what;
//	var response = [];
//
//	function buildResponse(i) {
//		return function(err, docs) {
//			if(err) {
//				response[i] = err;
//			} else {
//				response[i] = docs;
//			}
//			if(response.indexOf(undefined) == -1 && response.length == what.length) {
//				callback(response);
//			}
//		};
//	}
//
//  for(var i=0; i<what.length; i++) {
//		var each = what[i];
//		if(config.validTypes.indexOf(each.type) == -1) {
//			response[i] = null;
//		} else {
//		  Db.collection(each.type).find(each).toArray(buildResponse(i));
//		}
//	}
//}
//
//
//function remove(callback, data) {
//	var what = data.what;
//	var response = [];
//
//	function buildResponse(i) {
//		return function(err, docs) {
//			if(err) {
//				response[i] = err;
//			} else {
//				response[i] = docs;
//			}
//			if(response.indexOf(undefined) == -1 && response.length == what.length) {
//				callback(response);
//			}
//		};
//	}
//
//  for(var i=0; i<what.length; i++) {
//		var each = what[i];
//		if(config.validTypes.indexOf(each.type) == -1) {
//			response[i] = null;
//		} else {
//		  Db.collection(each.type).remove(each, buildResponse(i));
//		}
//	}
//}
//
//
//function add(callback, data) {
//	var what = data.what;
//	var response = [];
//
//	function buildResponse(i) {
//		console.log('tosat');
//		return function(err, docs) {
//			if(err) {
//				response[i] = err;
//			} else {
//				response[i] = docs;
//			}
//			if(response.indexOf(undefined) == -1 && response.length == what.length) {
//				callback(response);
//			}
//		};
//	}
//
//	for(var i=0; i<what.length; i++) {
//		var each = what[i];
//		console.log(each);
//		if(config.validTypes.indexOf(each.type) == -1) {
//			response[i] = null;
//		} else {
//			console.log('good');
//		  Db.collection(each.type).insert(each, buildResponse(i));
//		}
//	}
//}
//
//var routing = {'count': count, 'get': get, 'remove': remove, 'add': add};
//
//router.post('/', handle);
//router.get('/', handle);
//
//function handle(req, res) {
//	var incomingObj = req.body;
//
//	if(validate(incomingObj)) {
//    var method = routing[incomingObj.method];
//	  connect(method, function(obj) {res.send(obj);}, incomingObj);
//
//	} else {
//		res.send('invalid');
//	}
//}
//
//function validate(obj) {
//	// check for method and what in incoming object
//	if(!('method' in obj)) { console.log('bad method'); return false;}
//	if(!('what' in obj)) { console.log('bad what'); return false;}
//	// verify each what has a type
//	for(var i=0; i<obj.what.length; i++) {
//		if(!('type' in obj.what[i])) {
//			console.log(obj.what[i]);
//			return false;
//		}
//	}
//	return true;
//}
//
//module.exports = router;
