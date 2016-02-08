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

Template.feed.helpers({
	posts: function () {
		return Posts.find(
			{ $or: [
				{ "uploader._id": Meteor.userId() },
				{ "uploader._id": { $in: Meteor.user().subscriptions || [] } }
			] },
			{ sort: { createdAt: -1, name: 1 } }
		);
	},

	PostPreviewComponent() {
		return PostPreviewComponent;
	},
	UploadFAB() {
		return UploadFAB;
	}
});
