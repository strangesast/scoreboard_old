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
			callback(null, db, params);
	    console.log('connected succesfully!');
		});
		
	} else {
		callback(null, Db, params);
	}

	fin();

}

function count(err, _db, doc) {
	//console.log(_db);
	//console.log(Object.keys(doc));
	//if(err) { return console.log('updateError\n'); }
	//_db.collection(doc.collection).count();
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
	add: addDocument,
	count: count
};
