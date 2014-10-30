var express = require('express');
var config = require('../config');
var bodyParser = require('body-parser');
var router = express.Router();
var routing = require('../routing');
var request = require('request');
var dbops = require('../database');

/* GET home page. */
router.get('/', function(req, res) {
	var obj = {title: config.name};
	res.render('index', obj);
});

router.get('/admin', function(req, res) {
	function render(obj) {
		if(obj === undefined) {obj={};}
		console.log(obj);
		res.render('admin', obj);
		//res.send(obj);
	}

	action = {'action':'get', 'game': [], 'region': []};
	
	// should be asked by page itself
	//action = {'method':'get', 'what': [{'type':'player'}]}
	
	dbops.genericRequest(action, render, 'admin');
});


router.get('/:regionid/add', function(req, res) {
	var _id = req.params.regionid;
	function cb(obj) {
		if(obj.length>0) {
			res.render('add', {'region': obj[0]});
		} else {
			res.render('not');
		}
	}
	routing({'method':'get', 'params':{'what':
					{'type':'region', '_id':_id}}}, cb);
});


// at some point write generic function:
// function genericRequest('what', 'callback', 'callback params') {}


router.get('/:regionid/', function(req, res) {
	var regionid = req.params.regionid;
	function handleGames(msg, obj) {
		var members = obj.members;
	  for(var i=0; i<members.length; i++) {
			for(var j=0; j<msg.length; j++) {
				if(msg[j]._id == members[i]) {
					obj.members[i] = msg[j];
				} else {console.log(false);}
			}
		}
		res.render('region', {'region': obj});
	}

	function cb(obj) {
		if(obj.length>0) {
			var idList = obj[0].members;
			routing({'method':'get','params':{'what':
							{'type':'game', '_id':{$in:idList}}}}, 
			        function(msg) {handleGames(msg, obj[0]);});

		} else {
			res.render('not');
		}
	}
	routing({'method':'get', 'params':{'what':
					{'type':'region', '_id':regionid}}}, cb);
});


router.get('/:game/', function(req, res) {
	var game = req.params.game;
});



// if you get a post at index
router.post('/', function(req, res) {
	function cb(msg) {
		res.writeHead(200, {'Content-Type':'application/json'});
		res.write(JSON.stringify(msg));
		res.end();
	}
	data = req.body;
	routing(data, cb);
});


module.exports = router;
