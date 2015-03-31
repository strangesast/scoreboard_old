var models = {};
var mongoose = require('mongoose')
		, Schema = mongoose.Schema;
var EventEmitter = require('events').EventEmitter;

// schemas and models

// Region: collection of players, boards, teams, etc
var regionSchema = new Schema({
	name : {type: String, required: true},
	createdAt: { type: Date, default: Date.now }
});

regionSchema.post('save', function(docs) {
	models.events.emit('region-added', docs);
});

models.Region = mongoose.model('Region', regionSchema);


// Player: competitor basic information, with reference to history document
var playerSchema = new Schema({
	name:     {
		         first : String,
		         middle: String,
		         last:   { type: String, required: true}
	          },
	age:       Number,
	team:      { type: Schema.Types.ObjectId, ref: 'Team' },
	region:    { type: Schema.Types.ObjectId, ref: 'Region', required: true},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
  history:   { type: Schema.Types.ObjectId, ref: 'History' }
});

models.Player = mongoose.model('Player', playerSchema);


// Team: collection of players, reference to history document
var teamSchema = new Schema({
	name:     { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
});

models.Team = mongoose.model('Team', teamSchema);


// Game: collection of actions, meta information includes partipating teams / players, live status, etc
var gameSchema = new Schema({
	name:        { type: String, required: true },
	members:     [Schema.Types.Mixed],
  startTime:   { type: Date },
	history:     { type: Schema.Types.ObjectId, ref: 'History'},
	liveHistory: { type: Schema.Types.ObjectId, ref: 'LiveHistory'}
});

models.Game = mongoose.model('Game', gameSchema);


// Board: address and infomation about a displayServer instance
var boardSchema = new Schema({
	hostname: { type: String, required: true },
	port:     { type: Number, required: true },
	follows:  [{ type: Schema.Types.ObjectId }] // what object(s) is it displaying
});

models.Board = mongoose.model('Board', boardSchema);


// Action: an event associated with Player or Game
var actionSchema = new Schema({
	parents: { type: [Schema.Types.ObjectId], required: true }, // who or what is the action attributed to
	action:  { type: String, required: true }, // what action is it
  time:    { type: Date, required: true }
});

actionSchema.post('save', function(doc) {
	console.log("doc has been added");
});

models.Action = mongoose.model('Action', actionSchema);

var liveactionSchema = new Schema({
	parents: { type: [Schema.Types.ObjectId], required: true }, // who or what is the action attributed to
	action:  { type: String, required: true }, // what action is it
  time:    { type: Date, required: true }
}, { capped: 2048 });

models.LiveAction = mongoose.model('LiveAction', liveactionSchema);


// History: a list of actions tied to a player or game, may contain meta information
// LiveHistory: a list of all actions tied to a game or region, "capped"


// for mapping url to model defs
models.mapping = {
	'region' : models.Region,
	'player' : models.Player,
	'game'   : models.Game
}

models.events = new EventEmitter();

module.exports = models;
