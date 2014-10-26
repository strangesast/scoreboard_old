function getValue() {
	return document.getElementById('displayAddress').value;
}

function ajaxy(_val, _method) {
	if(_val==='' || _val===undefined) {
		return null;
	} else {
		var obj = {'method': _method, 'value': _val};
    var promise = $.ajax({
  		url: "/",
  		contentType:"application/json",
  		type: 'POST',
  		data: JSON.stringify(obj)
  	});
  
  	promise.done(function(data, err) {
  		console.log(data);
  	});
	}
}

$('#displayAddressTest').on('click', function() {
	var value = getValue();
	ajaxy(value, 'testDisplayConnection');
});


$('#displayAddressSubmit').on('click', function() {
	var value = getValue();
	console.log(value);

});
