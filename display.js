var request = require('request');

function testDisplayConnection (displayAddress, callback) {
	// verify that display can be accessed
	var obj = {'method': 'test'};
	console.log(displayAddress);
	request.post(displayAddress, obj, function(err, response, body) {
		if(err) {callback('error');
		} else if (response.statusCode != 200) {
			callback('invalid');
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
