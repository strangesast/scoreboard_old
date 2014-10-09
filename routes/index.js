var express = require('express');
var router = express.Router();
var qs = require('querystring');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


// if you get a post at index
router.post('/', function(req, res) {
	var obj = ['one', 'two'];
	res.send(JSON.stringify(obj));
});

module.exports = router;
