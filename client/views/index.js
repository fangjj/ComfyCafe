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

Template.index.helpers({
	posts: function () {
		return Posts.find(
			{ },
			{ sort: { createdAt: -1, _id: 1 }
		});
	}
	/* for manage posts view
	posts: function () {
		return Posts.find(
			{ "uploader._id": Meteor.userId() },
			{ sort: { createdAt: -1, name: 1 } }
		);
	}
	*/
});
