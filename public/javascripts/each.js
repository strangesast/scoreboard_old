// for testing
var addTest = JSON.stringify({"method":"add", "params":{"what": "game", "name": "test"}});

var cntTest = JSON.stringify({"method":"count", "params":
														 {"what":"game"}});

$('#add').on('click', function() {
	var ajaxUrl = '/';
	ajaxy(ajaxUrl, addTest);
});

$('#count').on('click', function() {
  var ajaxUrl = '/';
	ajaxy(ajaxUrl, cntTest);
});


function ajaxy(url, obj) {
  var promise = $.ajax({
		url: url,
		contentType:"application/json",
		type: 'POST',
		data: obj
	});

	promise.done(function(data, err) {
		console.log(data);
	});
}
