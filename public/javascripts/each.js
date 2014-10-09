// for testing
var obj = JSON.stringify({"method":"add", "params":{"what": "game", "name": "test"}});

$('#button').on('click', function() {
	var ajaxUrl = '/';
  var promise = $.ajax({
		url: ajaxUrl,
		contentType:"application/json",
		type: 'POST',
		data: obj
	});

	promise.done(function(data, err) {
		console.log('done');
		console.log(data);
	});
});
