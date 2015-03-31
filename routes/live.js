var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('../config');
var mongoUrl = config.mongoUrl;
var url = require('url');
var Promise = require('es6-promise').Promise;
var WebSocketServer = require('ws').Server,
	  wss = new WebSocketServer({port : 3030});
var models = require('../models');


default_limit = 50;

router.get('/', function(req, res, next) {
  default_limit = 50;
  models.Action.find({}).limit(req.query.limit || default_limit).exec(function(err, docs) {
		res.json([err, docs]);
	});
})



// example "event"
// {'parent_type' : 'game',
//  'action'      : 'score_change',
//  'value'       : '+1',
//  'parent_id'   : 'abadcdadkfjak'}


router.post('*', function(req, res, next) {
	// general verifications
	next();
})

// websocket server (probably a bad place for this)
wss.on('connection', function(ws) {

})
module.exports = router;
