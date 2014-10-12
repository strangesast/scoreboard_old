var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var config = require('./config');
var mongoUrl = config.mongoUrl;


var Db;


function connect(callback, params, fin) {
// check for active connection; if it is dead, reconnect
	if (Db === undefined){
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
	_db.collection(doc.collection).update();


	_success = false;
	

	callback(_success);
}

function getDocument(err, _db, doc, callback) {
// get value
	if(err) { return console.log('getError\n'); }
  var col;
	var _docs = [];
	if(doc.params.what == "game") {
		col = config.gameCollectionName;
	} else if (doc.params.what == "player") {
		col = config.playerCollectionName;
	}

	if(doc.params.who == "*") {
	  _docs = _db.collection(col).find();
		console.log(_docs);
	}
	callback("toast");

}

function addDocument(err, _db, doc, callback) {
// add new user / game / event
	if(err) { return console.log('createError\n'); }
	var col;
	// staged new document
	var _doc;

	var time = doc.params.availableWhen;
	// if time is specified, use it
	if(!time) {
		time = new Date();
	}

	// what are you creating (user / game)
	what = doc.params.what;
	name = doc.params.name;

 	function retCnt(err, cnt) {
 		if(!cnt && !err) {
 	    col.insert(_doc, function(err, docs) {
 				console.log(docs);
 				callback(true);
 			});
 
 		} else if(err) {
 			callback(err);
 		} else {
 			callback(false);
 		}
 	}


	if(what=='game') {
    _doc = {'name': name, 'members': [], created: time, 'region':0};
		col = _db.collection(config.gameCollectionName);
		col.find({'name':name, 'region':0}).count(retCnt);

	} else if (what=='player') {
		col = _db.collection(config.playerCollectionName);
		// create player
	} else {
		
	}
	
	//_db.collection(doc.collection).insert();
	_success = false;
	

	//callback(_success);
}

function removeDocument(err, _db, doc, callback) {
	console.log('not yet');
	callback('not yet');
}

module.exports = {
	connect: connect,
	update: updateDocument,
	get: getDocument,
	add: addDocument,
	count: count,
	rem: removeDocument
};
