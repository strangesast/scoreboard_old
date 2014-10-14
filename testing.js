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
	'beginTime': date,
	'teams': [],
	// should grab from each team
	'players': ['b444ac06']
};


var exGame2 = {
	'type': 'game',
	'name': 'opvsea',
	'_id' : '65891cee',
	'beginTime': date,
	'teams': [],
	// should grab from each team
	'players': ['b444ac06']
};


var exRegion = {
  'type': 'region',
	'name': 'north',
	'_id': '3ebfa301',
	'members': [exGame._id, exGame2._id]
};


var exGame3 = {
	'type': 'game',
	'name': 'toastvsbread',
	'_id' : 'f4c7e976',
	'beginTime': date,
	'teams': [],
	// should grab from each team
	'players': ['b444ac06']
};

var exRegion1 = {
  'type': 'region',
	'name': 'south',
	'_id': '2edc5785',
	'members': [exGame3._id]
};



var params = JSON.stringify({"method":"rem", "params":
														 {"what":[{'type':'region', '_id':'3ebfa301'}]}
                            });

var params1 = JSON.stringify({"method":"add", "params":
														{"what":[exGame3]}});


var params2 = JSON.stringify({"method": "get", "params":
														 {"what":{'type':'game', '_id':'109f4b3c'}}
                            });

//dbops.connect(dbops.rem, JSON.parse(params), respond);
dbops.connect(dbops.add, JSON.parse(params1), respond);
//dbops.connect(dbops.get, JSON.parse(params2), respond);
