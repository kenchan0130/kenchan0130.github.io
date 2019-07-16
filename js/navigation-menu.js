$(function() {
  var $menuButton = $('#js-mobile-menu').unbind();
  var $navigationMenu = $('#js-navigation-menu');
  $menuButton.on('click', function(e) {
    e.preventDefault();
    $navigationMenu.toggle();
  });
});
