addEventListener('template-bound', function(e) {
	var scope = e.target;
	var regions = scope.regionsAvailable;

	scope.selectView = function(e) {
		var i = e.target.templateInstance.model.i;
		if(this.selected != i) {
			console.log(e.target);
			this.selected = i;
		}
		else this.selected = -1;
	}

	scope.scrollTo = function(e) {
    document.querySelector('#pages').selected = 0;
		document.getElementById('scaffold').closeDrawer();
		setTimeout(function() {
			var elem = document.getElementById(e.target.innerHTML);
		  var pos = $(elem).position().top
		  $(document.getElementById('scaffold').scroller).animate({
				scrollTop: pos
			});
		}, 500);
	}

  scope.maxView = function(e) {
		var i = e.target.templateInstance.model.i;
    this.$.pages.selected = i+1;
  }

  document.querySelector('core-ajax').addEventListener('core-response', function(e) {
    console.log('event');
    console.log(e);
  });

})



