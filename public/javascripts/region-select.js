addEventListener('template-bound', function(e) {
	var scope = e.target;
	var regions = scope.regionsAvailable;

	scope.selectView = function(e) {
		var i = e.target.templateInstance.model.i;
		this.selected = i;
	}
})
