// for testing
var addTest = JSON.stringify({"method":"add", "params":{"what": "game", "name": "test"}});

var cntTest = JSON.stringify({"method":"count", "params":
														 {"what":"game"}});

var getTest = JSON.stringify({"method":"get", "params":{"what":"game", "who":"*"}});

$('#add').on('click', function() {
	var ajaxUrl = '/';
	ajaxy(ajaxUrl, addTest);
	return false;
});

$('#getall').on('click', function() {
  var ajaxUrl = '/';
	ajaxy(ajaxUrl, getTest);
	return false;
});

$('#count').on('click', function() {
  var ajaxUrl = '/';
	ajaxy(ajaxUrl, cntTest);
	return false;
});


function ajaxy(url, obj) {
  var promise = $.ajax({
		url: url,
		contentType:"application/json", // this is essential
		type: 'POST',
		data: obj
	});

	promise.done(function(data, err) {
		console.log(data);
	});
}
