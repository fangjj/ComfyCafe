Template.feed.onCreated(function () {
	var self = this;
	self.autorun(function () {
		self.subscribe("postFeed");
	});
});

Template.feed.onRendered(function () {
	var self = this;

	$(".tooltipped").tooltip({delay: 50});

	media.resumable.assignBrowse($(".addFile"));
});

Template.feed.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});
