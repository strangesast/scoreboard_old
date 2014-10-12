var dbops = require('./database');


// YOU'RE HERE
function respond(msg) {
	console.log(msg);
}

var params = JSON.stringify({"method":"rem", "params":
														{"what":"game", "name":"*"}});

// HERE


dbops.connect(dbops.rem, params, respond);
