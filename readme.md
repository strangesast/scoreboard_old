dbs (per region)

collections:
	history
	live

/api/:region/:objectType/:objectProp/:objectValue

examples:
Add two new players to region 'east-west'
POST /api/east-west/
{
0 : {'type': 'player', 'name': {'first' : 'Sam', 'last' : 'Zagrobelny }},
1 : {'type': 'player', 'name': {'first' : 'Russell', 'last' : 'Zagrobelny'}}
}

Add a new board (displayServer) at location 69.204.67.214:40430 in region 'north-west'
POST /api/north-west/
{
0 : {'type': 'board', 'name': 'zag_house', 'address': '69.204.67.214:40430'}
}

Get all players names in region "east-west"
GET /api/east-west/player/name

Get all players on team "eagles" in region "east-west"
GET /api/east-west/player/team/eagles

Update players on team "eagles" in region "east-west" with new team "bears"
PUT /api/east-west/player/team/eagles
{'team' : 'bears'}

Get all current games in region "east-west"
GET /api/east-west/game/status/live

Get the name (and _ids) of all games in region "east-west" that are live
GET /api/east-west/game/status/live/name
