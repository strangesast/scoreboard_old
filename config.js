var config = {};

config.name = 'Scoreboard';

config.mongoUrl = 'mongodb://127.0.0.1:27017/sb';

config.gameCollectionName = 'games';
config.teamCollectionName = 'teams';
config.playerCollectionName = 'players';
config.regionCollectionName = 'regions';

module.exports = config;
