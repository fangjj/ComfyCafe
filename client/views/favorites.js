Template.favorites.onRendered(function () {
  $(".tooltipped").tooltip({delay: 50});
});

Template.favorites.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});
