var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/test', function(req, res) {
	res.render('test');
});

router.get('/current-game', function(req, res) {
	res.render('game-summary');
});

module.exports = router;
