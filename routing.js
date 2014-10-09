// handle methods, then what to do
var dbops = require('./database');


function routing(params, callback) {
	var method = params.method;
	console.log(method);
	//console.log(method);
	//console.log(params);
	switch(method) {
		case 'add':
		  dbops.connect(dbops.add, params, function(msg) {callback(msg);});
			break;

		case 'update':
			callback('update');
			break;
		default:
			callback('invalid');
	}
}


module.exports = routing;
