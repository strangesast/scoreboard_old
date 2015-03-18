var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {'animate':true});
});

router.get('/index', function(req, res) {
  res.render('index', {'animate':false});
});

router.get('/test', function(req, res) {
	res.render('test');
});

router.get('/current-game', function(req, res) {
	res.render('game-summary');
});

router.get('/region/:region/', function(req, res) {
	console.log(req.params);
	res.json(req.params);
})
module.exports = router;
