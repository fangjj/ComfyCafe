Template.index.onCreated(function () {
	var self = this;
	self.autorun(function () {
		self.subscribe("allPosts");
		// "Manage Posts" view is supposed to have yourPosts sub, so figure that out later.
	});
});

Template.index.onRendered(function () {
	var self = this;

	$(".tooltipped").tooltip({delay: 50});

	media.resumable.assignBrowse($(".addFile"));
});

Template.index.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});
