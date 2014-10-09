var express = require('express');
var router = express.Router();

/* GET events listing. */
// event home page
router.get('/', function(req, res) {
  res.render('event', { title: 'Express' });
});


// for each event
router.get('/:name', function(req, res) {
	var name = req.params.name;
	if(name) {
    res.send('name is' + req.params.name);
	} else {
		res.send('not valid');
	}
});

module.exports = router;
