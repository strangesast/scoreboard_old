var dbops = require('./database');

function respond(msg) {
	console.log(msg);
}

var date = new Date();

var exTeam = {
	'type': 'team',
	'name': 'bears',
	'_id': '1ff2b370',
	'members': ['b444ac06']
};

var exPlayer = {
	'type': 'player',
	'name': 'Bobby M',
	'_id' : 'b444ac06'
};

var exGame = {
	'type': 'game',
	'name': 'eavsop',
	'_id' : '109f4b3c',
	'beginTime': date
};

var exRegion = {
  'type': 'region',
	'name': 'north',
	'_id': '3ebfa301'
};

var params = JSON.stringify({"method":"rem", "params":
														 {"what":[{'type':'game', '_id':'b444ac06'}]}
                            });

var params = JSON.stringify({"method":"add", "params":
														{"what":[exGame]}});


var params = JSON.stringify({"method": "get", "params":
														 {"what":{'type':'game'}}
                            });

dbops.connect(dbops.add, JSON.parse(params), respond);
