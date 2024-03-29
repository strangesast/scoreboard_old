var express = require('express');
var net = require('net');
var router = express.Router();
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
var config = require('../config')
    , mongoUrl = config.mongoUrl; var Promise = require('es6-promise').Promise;
var models = require('../models');

var db;
var listeners = {};

// add connection to available connections or timeout
// *****attach to mongoose schema, on changed listener*****
function addSocketConnection(url, port) {
	var name = url + ':' + port;
	if(name in listeners) return Promise.resolve(null);
	var test = new Promise(function(resolve, reject) {
		var sock = net.connect(port, url);
		sock.name = name;
	  sock.once('connect', function(e) {
			sock.write('success');
		  resolve(sock);
		});
		sock.on('error', function(e) {
			resolve(null);
			sock.destroy();
		});
		sock.on('close', function(e) {
			var index = listeners.indexOf(sock.name);
			if(index > -1) listeners.splice(index, 1);
		})
	});

	// timeout after 1000ms if connection not established
	var timeout = new Promise(function(resolve, reject) {
		setTimeout(resolve, 1000, null);
	})
	return Promise.race([test, timeout]).then(function(socket) {
		if(socket !== null) listeners[socket.name] = socket;
		return true;
	});
}

function isArray(_obj) {
	for(var i in _obj) if(isNaN(i)) return false;
	return true;
}

router.use(function(req, res, next) {
	// verify that connection to the database is valid/available
	var db = db || mongoose.connection;
	if(db._listening) next();
	else {
		mongoose.connect(mongoUrl, function(err) {
			if(err) return next(new Error('database error'));
			console.log('Connected at %s', mongoUrl);
		  db = mongoose.connection;
			next();
		});
	}
})

router.all('/', function(req, res, next) {
	res.json("hi");
})

var getter = function(req, res, next) {
	var Model = models.Models[req.params.firstType];
	var query = {};
	var first_value = req.params.firstValue;
	var second_type = req.params.secondType;
	var second_value = req.params.secondValue;
	var restrict_to = ''//'name _id';

	if(first_value !== undefined) {
	  restrict_to = ''; // restrict to different values
	  if(mongoose.Types.ObjectId.isValid(first_value)) {
			query._id = first_value;
		} else {
			query.name = first_value;
		}
	}
	var found;
	if(first_value == '*') {
		found = Model.find({}).select(restrict_to);
	} else {
    found = Model.find(query).select(restrict_to)
	}
  if(second_type !== undefined && second_value === undefined) {
		restrict_to = second_type.split('+').join(" ")
		found = found.select(restrict_to);
	} else if (second_value !== undefined) {
		found = found.where(second_type).in(second_value.split('+'))
	}
	if(req.params.op == "count") {
		found.count(function(err, count) {
    	if(err) return next(new Error(err));
			res.json(count)
		});
	} else {
	  found.exec(function(err, docs) {
    	if(err) return next(new Error(err));
    	res.json(docs);
    });
	}
}

router.route('/:firstType/:firstValue/:secondType/:secondValue/:op')
.get(getter);

router.route('/:firstType/:firstValue/:secondType/:secondValue?')
.get(getter);

router.route('/:firstType/:firstValue?')
.get(getter)
.post(function(req, res, next) {
	var Model = models.Models[req.params.firstType];
	var body = req.body;

	console.log(body);


  // if passed as array, add each
	if(isArray(body)) {
		var promiseArray = [];
		for(var i in body) {
			var doc = body[i];

     	// need to add user validation, until then default user
     	doc.lastModifiedBy = "551b2c385abb2a2e14f29c6c";

			promiseArray.push(new Promise(function(resolve, reject) {
				Model.create(doc, function(err, _doc) {
		  		resolve(err ? err : _doc);
		  	});
			}));
		}
		Promise.all(promiseArray).then(function(vals) {
		  res.json(vals);
		});

	// else add as single document
	} else {

  	// need to add user validation, until then default user
  	body.lastModifiedBy = "551b2c385abb2a2e14f29c6c";
		Model.create(body, function(err, _doc) {
	    if(err) return next(new Error(err));
			res.json(_doc);
		});
	}
})
.put(function(req, res, next) {
	// need to add update functionality
	var Model = models.Models[req.params.firstType];
	res.json(req.method);

})
.delete(function(req, res, next) {
	var Model = models.Models[req.params.firstType];
	var first_value = req.params.firstValue;
	if(first_value !== undefined && mongoose.Types.ObjectId.isValid(first_value)) {
	  Model.remove({ _id: first_value}, function(err) {
			if(err) return next(new Error(err));
			res.json("ok");
		});
	} else {
		// this is rather dangerous
		// also, should drop collection - much faster
		Model.remove({}, function(err) {
			if(err) return next(new Error(err));
			res.json("ok");
		});
	}
})
.all(function(req, res, next) {
	var Model = models.Models[req.params.firstType];
	res.json(req.method);
});


module.exports = router;
