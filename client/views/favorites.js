Template.favorites.onCreated(function () {
  var self = this;
	self.autorun(function () {
		self.subscribe("favorites");
	});
});

Template.favorites.onRendered(function () {
  $(".tooltipped").tooltip({delay: 50});
});

Template.favorites.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});
