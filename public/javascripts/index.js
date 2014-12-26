$(document).ready(function() {
});

$('button').on('click', function() {
  console.log('toast');
	test();
});

var obj = {'_id':'01kdka93d'};

function test() {
  var promise = $.ajax({
		url: '/api/abc/ad/da/',
		contentType:"application/json",
		type: 'PUT',
		data: JSON.stringify(obj)
	});

	promise.done(function(err, data) {
		console.log(err);
		console.log(data);
	});
}

//$(document).ready(function() {
//	console.log('toast Ready toast');
//	$('.thumbnail').css("background-color", "yellow");
//	$('#datetimepicker1').datetimepicker();
//});
//
//var validMethods = ['get', 'add'];
//var localUrl = '/api';
//
//function getName() {
//	return document.getElementById('nameInput').value;
//}
//
//function getDesc() {
//	return document.getElementById('descInput').value;
//}
//
//function getType() {
//	return document.getElementById('typeInput').value;
//}
//
//function getTeam() {
//	var input = document.getElementById('teamInput');
//	var value = input.options[input.selectedIndex].value;
//	return value;
//}
//
//function getAddTeam() {
//	var input = document.getElementById('addTeamInput');
//	var inputOption = input.options[input.selectedIndex];
//	if(inputOption !== undefined) {
//		var value = inputOption.value;
//	} else {
//		var value = undefined;
//	}
//	return value;
//}
//
//function getGly(index, css) {
//	return (css.match (/(^|\s)glyphicon-\S+/g) || []).join(' ');
//}
//
//// control which rows are visible for each type
//$('#typeInput').on('input', function(eventObj) {
//  $('#objectName').text('Example Name');
//	$('#objectDesc').text('Lorum ipsum dolorem...');
//	$('input[type=text]').each(function() {this.value = ""});
//	if(this.value == 'event') {
//		$('#compRow').addClass('hidden');
//		$('#nameRow').removeClass('hidden');
//    $('#descRow').removeClass('hidden');
//		$('.thumbnail').css("background-color", "lightgreen");
//		$('#timeRow').removeClass('hidden');
//		$('#gameRow').removeClass('hidden');
//		$('#teamRow').addClass('hidden');
//		$('#prevIcon').removeClass(getGly).addClass('glyphicon-tasks');
//	} else if(this.value == 'player') {
//		$('#compRow').addClass('hidden');
//		$('#nameRow').removeClass('hidden');
//    $('#descRow').addClass('hidden');
//		$('.thumbnail').css("background-color", "lightblue");
//		$('#teamRow').removeClass('hidden');
//		$('#timeRow').addClass('hidden');
//		$('#gameRow').addClass('hidden');
//		$('#prevIcon').removeClass(getGly).addClass('glyphicon-user');
//		$('#objectDesc').text(getTeam());
//	} else if(this.value == 'game') {
//		$('#compRow').removeClass('hidden');
//		$('#nameRow').removeClass('hidden');
//		$('.thumbnail').css("background-color", "yellow");
//    $('#descRow').addClass('hidden');
//		$('#timeRow').addClass('hidden');
//		$('#teamRow').addClass('hidden');
//		$('#gameRow').addClass('hidden');
//		$('#prevIcon').removeClass(getGly).addClass('glyphicon-bullhorn');
//	} else if(this.value == 'team') {
//		$('#compRow').addClass('hidden');
//		$('#nameRow').removeClass('hidden');
//		$('.thumbnail').css("background-color", "purple");
//		$('#timeRow').addClass('hidden');
//		$('#teamRow').addClass('hidden');
//		$('#gameRow').addClass('hidden');
//		$('#prevIcon').removeClass(getGly).addClass('glyphicon-link');
//	}
//});
//
//
//$('#teamInput').on('input', function() {
//  if(['player'].indexOf(getType() > -1)) {
//		$('#objectDesc').text(getTeam());
//	}
//});
//
//
//$('#nameInput').on('input', function() {
//	$('#objectName').text(this.value);
//});
//
//
//$('#descInput').on('input', function() {
//	if(['event', 'team'].indexOf(getType()) > -1) {
//    $('#objectDesc').text(this.value);
//	}
//});
//
//
//$('#addTeam').on('click', function() {
//	var source = $('#testTemplate').html();
//	var template = Handlebars.compile(source);
//	var value = getAddTeam();
//	if(value) {
//	  var data = {'name' : value};
//	  $('#compRow > .form-group').append(template(data));
//	  $('#addTeamInput > option[value=' + value + ']').prop('disabled', true);
//	  $('#addTeamInput').val('0');
//	  refreshDescription();
//	}
//});
//
//function removeGame(obj) {
//	var _parent = $(obj).parent();
//	var value = _parent.children(":first").text();
//	$('#addTeamInput > option[value=' + value + ']').prop('disabled', false);
//	_parent.remove();
//	$('#addTeamInput').val('0');
//	refreshDescription();
//}
//
//// return teams that have been chosen
//function getSelectedTeams() {
//	var teams = [];
//	var teamList = $('.team-box');
//  for(var i=0; i<teamList.length; i++) {
//		var team = $(teamList[i]).children(':first').text();
//		teams.push(team);
//	}
//	return teams;
//}
//
//// refresh preview description
//function refreshDescription() {
//	document.getElementById('objectDesc').innerHTML = "";
//	var teams = getSelectedTeams();
//	console.log(teams);
//	var index = teams.indexOf('unattached');
//	if(index > -1) {
//		teams.splice(index, 1);
//	}
//	if(teams.length > 4) {
//		teams = teams.slice(0, 4);
//	  var text = teams.join([separator=' vs '])
//	  text = text + '...';
//	} else {
//	  var text = teams.join([separator=' vs '])
//	}
//	document.getElementById('objectDesc').innerHTML = text;
//}
//
//$('#submit').on('click', function(eventObj) {
//	var obj = {'method':'add'};
//	var what = {};
//	what.type = getType();
//
//	if(what.type == 'event') {
//    var date = $('#datetimepicker1').data('DateTimePicker').getDate();
//		what.date = date;
//		what.parent = document.getElementById('gameInput').value;
//		what.description = document.getElementById('objectDesc').innerHTML;
//
//	} else if(what.type == 'game') {
//		what.name = getName();
//		what.teams = getSelectedTeams();
//
//	} else if(what.type == 'player') {
//		what.team = document.getElementById('teamInput').value;
//	}
//	var name = document.getElementById('nameInput').value
//	what.name = name;
//  obj.what = [what];
//
//	$('input, select').prop('disabled', true);
//	ajaxy(localUrl, JSON.stringify(obj), finishAddition);
//});
//
//function finishAddition(_data) {
//	if(_data != 'invalid' && _data != 'timeout') {
//	  $('.littleContainer').children().not('.preview').animate({"opacity":"0"}, 500);
//		$('.littleContainer').animate({"height": "200px"}, 500);
//	  $('.preview').animate({"top": "25%", "left":"25%", "width": "300px"}, 500);
//		setTimeout(function () {
//			window.location.href = "/players";
//		}, 700);
//	} else {
//	  $('input, select').prop('disabled', false);
//		// trigger that it was bad
//	}
//}
//
//function ajaxy(url, obj, callback) {
//  var promise = $.ajax({
//		url: url,
//		contentType:"application/json", // this is essential
//		type: 'POST',
//		data: obj
//	});
//
//	promise.done(function(data, err) {
//		finishAddition(data);
//	});
//}
