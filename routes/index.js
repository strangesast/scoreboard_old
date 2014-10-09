var express = require('express');
var config = require('../config');
var bodyParser = require('body-parser');
var router = express.Router();
var routing = require('../routing');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: config.name });
});

router.get('/:game', function(req, res) {
	// pass it to a function, return game if exists, else don't
	var game = req.params.game;
	if(game) {
	  res.render('each', { title: game});
	} else {
	  res.render('not', { title: game});
	}
});


// if you get a post at index
router.post('/', function(req, res) {
	function cb(msg) {res.send(msg);}
	data = req.body;
	routing(data, cb);
});

router.post('/:game', function(req, res) {
	// pass it to a function, return game if exists, else don't
	var game = req.params.game;
	if(game) {
		res.send(game);
	}
});

module.exports = router;
