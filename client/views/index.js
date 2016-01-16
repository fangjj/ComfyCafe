Template.index.onRendered(function () {
	var self = this;

	$(".tooltipped").tooltip({delay: 50});

	media.resumable.assignBrowse($(".addFile"));
});

Template.index.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});
