var request = require('request');

function testDisplayConnection (displayAddress, callback) {
	// verify that display can be accessed
	var obj = {'method': 'test'};
	console.log(displayAddress);
	request.post({url: displayAddress, form: obj}, function(err, response, body) {
		if(err) {callback('notConnected');
		} else if (response.statusCode != 200) {
			callback(body);
			//callback('invalidRequest');
		} else {
			callback(body);
		}
	});
}

function sendObject() {
	// send a display object (i.e. text, time, player, etc)
}


module.exports = {
	test: testDisplayConnection,
	snd: sendObject
};
