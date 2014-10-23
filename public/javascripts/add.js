var localUrl = window.location.href;
var form = $('#gameNameForm');
var button = $('#submit');
console.log(localUrl);
$('#submit').click(function() {
	var data = $('#gameNameForm').serializeArray();
	console.log(data);
	//var promise = $.ajax({
	//	type: "POST",
	//	url: localUrl,
	//	data: data 
	//});
	//promise.done(function(err, data) {});
});

var timeout;
$('#gameNameInput').on('input', function(what) {
	button.prop('disabled', true);
	if(timeout) {
		clearTimeout(timeout);
	}
	var val = this.value;
	timeout = setTimeout(function() {checkValid(val);}, 500);
});


function checkValid(_val) {
	if(_val !== '') {
	  button.prop('disabled', false);
	}
}
