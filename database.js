var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var config = require('./config');
var mongoUrl = config.mongoUrl;


var Db;


function connect(callback, params, fin) {
// check for active connection; if it is dead, reconnect
	if (Db === undefined) {
		mongodb.connect(mongoUrl, function(err, db) {
			if(err) {return callback(err);}
			Db = db;
			callback(null, db, params, fin);
	    console.log('connected succesfully at ' + mongoUrl);
		});

	} else {
		callback(null, Db, params, fin);
	}

}


function count(err, _db, doc, callback) {
	console.log(doc);
	if(err) { return console.log('countError\n'); }
  var col;
	var cur;
	what = doc.params.what;
	
	// count total games, perhaps with qualifier (region)
	if (what == 'game') {
		col = _db.collection(config.gameCollectionName);
		cur = col.find();
		cur.count(function(err, count) {callback(count);});

  // count players in qualifier (region)
	} else if (what=='player') {
		region = doc.params.region;
		if(!region) {region = 0;}
		col = _db.collection(config.playerCollectionName);
		cur = col.find({'region':region});
		cur.count(function(err, count) {callback(count);});
		
  // count players in game
	} else if (what=='playersInGame') {
		callback('player');
		
	  // count players in game
	} else if (what=='playersInGame') {
		callback('player');
  }
	//_db.collection(doc.collection).count();
}

function updateDocument(err, _db, doc, callback) {
  var col;
// update user / game / event
	if(err) { return console.log('updateError\n'); }
	//_db.collection(doc.collection).update();


	_success = false;
	

	callback(_success);
}

function getDocument(err, _db, doc, callback) {
// get value
	console.log(doc);
	if(err) { return console.log('getError\n'); }
	var what = doc.params.what;
	_db.collection(config[what.type + 'CollectionName'])
	.find(what).toArray(function(err, items) {
		callback(items);
	});
}

function addDocument(err, _db, doc, callback) {
// add new user / game / event
	if(err) { return console.log('createError\n'); }

	elementList = doc.params.what;
	var col = config[elementList[0].type + 'CollectionName'];
  _db.collection(col).insert(elementList, function(err, docs) {
		var res = docs;
		callback(res);
	});
}

function removeDocument(err, _db, doc, callback) {
	var what = doc.params.what;
	var col = config[what[0].type + 'CollectionName'];
	var idList = [];
	console.log(what, col, idList);
	for(var i=0; i<what.length; i++) {
		idList.push(what[i]._id);
	}

	_db.collection(col).remove({'_id':{'$in':idList}},
														 {w:1}, function(err, result) {
		callback(result);
	});
}


module.exports = {
	connect: connect,
	update: updateDocument,
	get: getDocument,
	add: addDocument,
	count: count,
	rem: removeDocument
};
