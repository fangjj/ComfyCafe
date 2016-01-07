Template.home.onRendered(function () {
	var self = this;

	$(".tooltipped").tooltip({delay: 50});

	media.resumable.assignBrowse($(".addFile"));
});

Template.home.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});
