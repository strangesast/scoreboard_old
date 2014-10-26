// handle methods, then what to do
var dbops = require('./database');
var disp  = require('./display');

function routing(params, callback) {
	// handle callback.  msg = db value / status
	function respond(msg) {callback(msg);}

	var method = params.method;
	switch(method) {
		case 'add':
		  dbops.connect(dbops.add, params, respond);
			break;

		case 'update':
		  dbops.connect(dbops.update, params, respond);
			break;

		case 'count':
		  dbops.connect(dbops.count, params, respond);
	    break;

		case 'get':
		  dbops.connect(dbops.get, params, respond);
		  break;

	  case 'remove':
		  dbops.connect(dbops.rem, params, respond);
			break;

		case 'testDisplayConnection':
			disp.test(params.value, callback);
			break;

		default:
			callback('invalid');
	}
}

module.exports = routing;
