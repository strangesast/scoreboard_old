addEventListener('template-bound', function(e) {
	var scope = e.target;
	var regions = scope.regionsAvailable;

  scope.arranged = false;

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
    scope.activeRegionName = null;
		document.getElementById('scaffold').closeDrawer();
		setTimeout(function() {
			var elem = document.getElementById(e.target.innerHTML);
		  var pos = $(elem).position().top
		  $(document.getElementById('scaffold').scroller).animate({
				scrollTop: pos
			});
		}, 250);
	}

  scope.maxView = function(e) {
		var i = e.target.templateInstance.model.i;
    this.$.pages.selected = i+1;
    scope.activeRegionName = e.target.templateInstance.model.region.name;
  }

  scope.back = function(e) {
    if(this.$.pages.selected == 0) {
      var bool = e.target.templateInstance.model.arranged;
      e.target.templateInstance.model.arranged = !bool;

    } else {
      this.$.pages.selected = 0;
      scope.activeRegionName = null;
    }
  }

  scope.refresh = function(e) {
    document.querySelector('#getRegions').go()
  }


  scope.toggleLogin = function(e) {
    document.querySelector('#adminLogin').toggle();
  }

  document.querySelector('core-ajax').addEventListener('core-response', function(e) {
    console.log('event');
    console.log(e);
  });

})
