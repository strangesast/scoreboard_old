var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var config = require('./config');
var mongoUrl = config.mongoUrl;

// the big db
var Db;

function connect(callback) {
// check for active connection; if it is dead, reconnect
	if (Db === undefined){
		mongodb.connect(mongoUrl, function(err, db) {
			if(err) {return callback(err);}
			Db = db;
			callback(null, db);
		});
		
	} else {
		callback(null, Db);
	}
}

function updateDocument(err, _db, doc) {
// update user / game / event
	if(err) { return console.log('updateError\n'); }
	_db.collection(doc.collection).update();
}

function getDocument(err, _db, doc) {
// get value
	if(err) { return console.log('getError\n'); }
	_db.collection(doc.collection).find();
}

function addDocument(err, _db, doc) {
// add new user / game / event
	if(err) { return console.log('addError\n'); }
	_db.collection(doc.collection).insert();
}

module.exports = {
	connect: connect,
	update: updateDocument,
	get: getDocument,
	add: addDocument
};
