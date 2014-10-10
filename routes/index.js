var express = require('express');
var config = require('../config');
var bodyParser = require('body-parser');
var router = express.Router();
var routing = require('../routing');

/* GET home page. */
router.get('/', function(req, res) {
	var obj = {title: config.name,
	           regions: [{'name': 'South', 'index': 1, 'games': 
							          [{'name':'test1'},
							           {'name':'test2'}]
						           },
							         {'name': 'East', 'index': 0, 'games':
											  [{'name':'test3'}]
											 },
							         {'name': 'West', 'index': 3, 'games':[]},
							         {'name': 'North', 'index': 2, 'games':[]}],
				     header: ['name', 'born on', 'players']
	          };
  console.log(obj.regions);
  res.render('index', obj);
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
	function cb(msg) {
		res.writeHead(200, {'Content-Type':'application/json'});
		res.write(JSON.stringify(msg));
		res.end();
	}
	data = req.body;
	routing(data, cb);
});

module.exports = router;
