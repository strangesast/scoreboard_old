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
  var col;
	//console.log(doc.params.what);
	//if(err) { return console.log('updateError\n'); }
	//_db.collection(doc.collection).count();
	_cnt = 0;


	callback(_cnt);
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
	_db.collection(doc.collection).find();


	_doc ='test';

	callback(_doc);
}

function addDocument(err, _db, doc, callback) {
// add new user / game / event
	if(err) { return console.log('createError\n'); }
	var col;

	// what are you creating
	what = doc.params.what;
	if(what=='game') {
	  gameName = doc.params.name;
		col = _db.collection(config.gameCollectionName);
		// create game
		//col.insert()
	} else if (what=='player') {

		col = _db.collection(config.playerCollectionName);
		// create player
	} else {
		
	}
	
	//_db.collection(doc.collection).insert();
	_success = false;
	

	callback(_success);
}

module.exports = {
	connect: connect,
	update: updateDocument,
	get: getDocument,
	add: addDocument,
	count: count
};
