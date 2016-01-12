Template.favorites.onRendered(function () {
  setTitle("Favorites");

  $(".tooltipped").tooltip({delay: 50});
});

Template.favorites.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});
