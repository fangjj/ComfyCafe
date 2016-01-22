Template.feed.onRendered(function () {
	var self = this;

	$(".tooltipped").tooltip({delay: 50});

	media.resumable.assignBrowse($(".addFile"));
});

Template.feed.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});
