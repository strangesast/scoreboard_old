var models = {};
var mongoose = require('mongoose')
		, Schema = mongoose.Schema;
// schemas and models

// Region: collection of players, boards, teams, etc
var regionSchema = new Schema({
	name : String
});

models.Region = mongoose.model('Region', regionSchema);


// Player: competitor basic information, with reference to history document
var playerSchema = new Schema({
	name:     {
		         first : String,
		         middle: String,
		         last:   String
	          },
	age:       Number,
	team:      { type: Schema.Types.ObjectId, ref: 'Team' },
	region:    { type: Schema.Types.ObjectId, ref: 'Region' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
  history:   { type: Schema.Types.ObjectId, ref: 'History' }
});

models.Player = mongoose.model('Player', playerSchema);


// Team: collection of players, reference to history document
var teamSchema = new Schema({
	name:     String,
  members: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
});

models.Team = mongoose.model('Team', teamSchema);


// Game: collection of actions, meta information includes partipating teams / players, live status, etc
var gameSchema = new Schema({
	name: String,
	members: [Schema.Types.Mixed],
  startTime: Date,
	history: { type: Schema.Types.ObjectId, ref: 'History'},
	liveHistory: { type: Schema.Types.ObjectId, ref: 'LiveHistory'}
});

models.Game = mongoose.model('Game', gameSchema);


// Board: address and infomation about a displayServer instance
var boardSchema = new Schema({
	hostname: String,
	port: Number,
	follows: [Schema.Types.ObjectId] // what object(s) is it displaying
});

models.Board = mongoose.model('Board', boardSchema);

// Action: an event associated with Player or Game
var actionSchema = new Schema({
	parents: [Schema.Types.ObjectId], // who or what is the action attributed to
	action: String, // what action is it
  time: Date
});

models.Action = mongoose.model('Action', actionSchema);


var liveactionSchema = new Schema({
	parents: [Schema.Types.ObjectId], // who or what is the action attributed to
	action: String, // what action is it
  time: Date
}, { capped: 2048 });

models.LiveAction = mongoose.model('LiveAction', liveactionSchema);


// History: a list of actions tied to a player or game, may contain meta information
// LiveHistory: a list of all actions tied to a game or region, "capped"

module.exports = models;
