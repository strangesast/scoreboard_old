var express = require('express');
var config = require('../config');
var bodyParser = require('body-parser');
var router = express.Router();
var routing = require('../routing');
var dbops = require('../database');

/* GET home page. */
router.get('/', function(req, res) {
	var obj = {title: config.name};
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
