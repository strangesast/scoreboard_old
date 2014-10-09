document.addEventListener('polymer-ready', function() {
  var navicon = document.getElementById('navigation');
  var drawerPanel = document.getElementById('drawerPanel');
  navicon.addEventListener('click', function() {
    drawerPanel.togglePanel();
  });
});
