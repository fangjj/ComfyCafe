Template.index.onRendered(function () {
	var self = this;

	setTitle();

	$(".tooltipped").tooltip({delay: 50});

	media.resumable.assignBrowse($(".addFile"));
});

Template.index.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});
