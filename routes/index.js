var express = require('express');
var config = require('../config');
var bodyParser = require('body-parser');
var router = express.Router();
var routing = require('../routing');
var dbops = require('../database');

/* GET home page. */
function getRegionData(obj, callback, params) {
	// get regions, ids of member games
	// initialize object
	// fill in data for each id
	// check if each id has data
	// if so, return callback
	
	var regions = {};
  var tmp = {};
  tmp.members = {};

	for(var i=0; i<obj.length; i++) {

		//for(var j=0;j<obj[i].members.length; j++) {
		//	var memberID = obj[i].members[j];
		//	tmp.members[memberID] = {};
		//	console.log(tmp);
		//	//tmp.members.push({obj[i].members}) 
		//}

		//regions[obj[i]._id] = tmp;
		//console.log(regions);
		
		for(var k=0;k<obj[i].members.length; k++) {
		  var req = {'method':'get', 'params':{'what':{'type':'game'}}};
			req.params.what._id = obj[i].members[k];
			console.log('request');
			console.log(req);
		  routing(req, cb);
		}

	}

	function cb(msg) {
		console.log('response');
		console.log(msg);
		console.log(regions);
		//for(var i=0; i<msg.length; i++) {
		//	tmp.members.push(msg[i]);
		//}
		//if(tmp.members.length == tmp.numberOfGames) {
		//	callback(params);
		//}
	}

//	var p = {"method":"get", "params":{"what":{"type": "region"}}};
//	routing(params, cb);
}

router.get('/', function(req, res) {
	var obj = {title: config.name};

	//var obj = {title: config.name,
	//           regions: [{'name': 'South', 'index': 1, 'games': 
	//						          [{'name':'test1'},
	//						           {'name':'test2'}]
	//					           },
	//						         {'name': 'East', 'index': 0, 'games':
	//										  [{'name':'test3'}]
	//										 },
	//						         {'name': 'West', 'index': 3, 'games':[]},
	//						         {'name': 'North', 'index': 2, 'games':[]}],
	//			     header: ['name', 'born on', 'players']
	//          };

	// get available regions
	//var data = {"method":"get", "params":{"what":{"type": "region"}}};
	//	
	//function cb(regions) {
	//	obj.regions = regions;
	//  res.render('index', obj);
	//}

  //routing(data, function(msg) {getRegionData(msg, cb, msg);});
	res.render('index', obj);
});


router.get('/:region/:game', function(req, res) {
	// pass it to a function, return game if exists, else don't
	var region = req.params.region;
	var game = req.params.game;
	if(game) {
	  res.render('each', { title: game});
	} else {
	  res.render('not', { title: game});
	}
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
