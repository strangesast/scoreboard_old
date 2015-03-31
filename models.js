var models = {};
var mongoose = require('mongoose')
		, Schema = mongoose.Schema;
var EventEmitter = require('events').EventEmitter;

// so events can be accessed in other files
models.events = new EventEmitter();

// schemas
var schemas = {};

// Region: collection of players, boards, teams, etc
schemas['Region'] = new Schema({
	name : {type: String, required: true},
	createdAt: { type: Date, default: Date.now }
});

// Player: competitor basic information, with reference to history document
schemas['Player'] = new Schema({
	name:     {
		         first : String,
		         middle: String,
		         last:   { type: String, required: true}
	          },
	age:       Number,
	team:      { type: Schema.Types.ObjectId, ref: 'Team' },
	region:    { type: Schema.Types.ObjectId, ref: 'Region', required: true},
	createdAt: { type: Date, default: Date.now },
  history:   { type: Schema.Types.ObjectId, ref: 'History' }
});

// Team: collection of players, reference to history document
schemas['Team'] = new Schema({
	name:     { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
  members: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
});

// Game: collection of actions, meta information includes partipating teams / players, live status, etc
schemas['Game'] = new Schema({
	name:        { type: String, required: true },
	members:     [Schema.Types.Mixed],
  startTime:   { type: Date },
	history:     { type: Schema.Types.ObjectId, ref: 'History'},
	createdAt: { type: Date, default: Date.now },
	liveHistory: { type: Schema.Types.ObjectId, ref: 'LiveHistory'}
});

// History: a list of actions tied to a player or game, may contain meta information
// LiveHistory: a list of all actions tied to a game or region, "capped"

//actionSchema.post('save', function(doc) {
//	// do this or use tailable cursor
//	console.log(doc);
//});


// stuff for all (most) schemas
for(var schema in schemas) {
	schemas[schema].add({ 
		lastModifiedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true},
		updatedAt: { type: Date, default: Date.now }
  })

  schemas[schema].post('save', function(doc) {
		// emit creation event e.g. 'region-added'
  	//models.events.emit(schema.toLowerCase() + '-added', doc);
    var action = new models.Models.action({
    	parent: doc._id,
    	action: 'add',
    	time: Date.now(),
			by: doc.lastModifiedBy
    });
  	action.save();
  });
}


// Action: an event associated with another object
schemas['Action'] = new Schema({
	parent:       { type: Schema.Types.ObjectId, required: true }, // in what context is the action occuring
	action:       { type: String, required: true }, // what action is it
	value:        { type: Number },
  time:         { type: Date, required: true },
	attributedTo: { type: Schema.Types.ObjectId, ref: 'User' } // who is performing action
}, { capped: 1048576, tailable: true}); // may need to be larger

// User: a user with varying privledges
schemas['User'] = new Schema({
	name:   { type: String, required: true },
	level:  Number
});

// Connection: a websocket or tcp connection to scoreboard (e.g. displayServer)
schemas['Connection'] = new Schema({
	hostname: { type: String, required: true },
	port:     { type: Number, required: true },
	follows:  [{ type: Schema.Types.ObjectId }], // what object(s) is it following
	createdAt: { type: Date, default: Date.now },
	type:     { type: String, required: true} // either "tcp" or "ws"
});



// schema middleware
//schemas['Region'].virtual('test').set(function(test) {
//	console.log(this); //test = test;
//	console.log('test: %s', test);
//})


// models

var Models = {};
for(var schema in schemas) {
	Models[schema.toLowerCase()] = mongoose.model(schema, schemas[schema]);
}

models.Models = Models;


module.exports = models;
