addEventListener('template-bound', function(e) {
	var scope = e.target;
  scope.selected = 0;
	scope.maxmessages = 10;
  
  scope.messages0 = [
    {h: 'matt', v: 'Matt McNulty'},
    {h: 'scott', v: 'Scott Miles'},
    {h: 'steve', v: 'Steve Orvell'},
    {h: 'frankie', v: 'Frankie Fu'},
    {h: 'daniel', v: 'Daniel Freedman'},
    {h: 'yvonne', v: 'Yvonne Yip'},
  ];
  
  scope.messages1 = [
    {h: 'matt', v: 'Matt McNulty'},
    {h: 'scott', v: 'Scott Miles'},
    {h: 'steve', v: 'Steve Orvell'},
    {h: 'frankie', v: 'Frankie Fu'},
    {h: 'daniel', v: 'Daniel Freedman'},
    {h: 'yvonne', v: 'Yvonne Yip'},
  ];
  
  scope.reorder = function(e) {
    if (this.$.messagelist.transitioning.length) {
      return;
    }
  
    this.lastMoved = e.target;
		console.log('target');
		console.log(e.target);
    this.lastMoved.style.zIndex = 10005;
    var item = e.target.templateInstance.model;
		console.log('item');
		console.log(item);
		console.log('selected');
		console.log(this.selected);
    var items = this.selected ? this.messages0 : this.messages1;
    var i = this.selected ? this.messages1.indexOf(item) : this.messages0.indexOf(item);
    if (i != 0) {
      items.splice(0, 0, item);
      items.splice(i + 1, 1);
    }
  
    this.lastIndex = i;
    this.selected = this.selected ? 0 : 1;
  }
  
  scope.done = function() {
    var i = this.lastIndex;
    var items = this.selected ? this.messages0 : this.messages1;
    var item = items[i];
    items.splice(0, 0, item);
    items.splice(i + 1, 1);
    this.lastMoved.style.zIndex = null;
  }

	scope.addmessage = function(message) {
		this.messages0.push(message);
		this.messages1.push(message);
		this.messages0.slice(-scope.maxmessages);
		this.messages1.slice(-scope.maxmessages);
	}

});
