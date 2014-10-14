var localUrl = '/';
var regions = [];

function getAvailableRegions() {
	var req = {'method':'get', 'params':{'what':{'type':'region'}}};
	ajaxy(localUrl, JSON.stringify(req), renderRegions);
}

function getGameById(obj, callback) {
	var objId = obj.id;
	console.log(objId);
	var req = {'method':'get', 'params':
		         {'what':{'type':'game', '_id':objId}}
	          };
  ajaxy(localUrl, JSON.stringify(req), function(values) {
		callback(obj, values);
	});
}


function getPlayerById() {}


function ajaxy(url, obj, callback) {
  var promise = $.ajax({
		url: url,
		contentType:"application/json", // this is essential
		type: 'POST',
		data: obj
	});

	promise.done(function(data, err) {
		callback(data);
	});
}

function renderRegions(data) {
	for(var i=0; i<data.length; i++) {
		$('#regions').append(returnRegionPanel(data[i]));
	}

}


function returnRegionPanel(data) {
	console.log(data);
	var p  = $("<div/>", {"class":"panel panel-default"});
	var ph = $("<div/>", {"class":"panel-heading"});
	var he = $("<h4/>", {"class":"panel-title"});
	var al = $("<a/>", {
						          "data-toggle":"collapse",
											"data-parent":"#regions",
											"text":data.name,
	                    "href":"#"+data._id});
	var pc = $("<div/>", {"class":"panel-collapse collapse",
	                      "id":data._id});
	var pb = $("<div/>", {"class":"panel-body"});

	if(data.members.length>0) {
		var ul = $("<ul/>", {"class":"list-group"});
	  for(var i=0; i<data.members.length; i++) {
			var li = $("<li/>", {"class":"list-group-item",
			                     "id": data.members[i],
			                     "text": "..."});
			ul.append(li);
	  }
		pb.append(ul);
	}

	var bt = $("<button/>", {"class":"btn btn-default"});
  var ic = $("<span/>", {"class":"glyphicon glyphicon-plus"});

	p.append(ph.append(he.append(al)))
	.append(pc.append(pb.append(bt.append(ic))));

	return p;

}

function renderGameInfo(obj, values) {
	var vals = values[0];
	// list element
	var li = $("<li/>", {"id": vals._id,
	                     "class": "list-group-item"});

	// link to game page
  var a = $("<a/>", {"href" : "/",
	                   "text" : vals.name});
  // list how many players in game
	var b = $("<span/>", {"class":"badge",
	                      "text" : vals.players.length});
	li.append(b);
	li.append(a);
	// replace old list element with new, updated one
	$(obj).replaceWith(li);
}



$(document).ready(function() {
	getAvailableRegions();
});

// Listeners
$('.panel-group').on('show.bs.collapse', function(e) {
	var games = $(e.target).find('li').toArray();
	for(var i=0; i<games.length; i++) {
		getGameById(games[i], renderGameInfo);
	}
});
