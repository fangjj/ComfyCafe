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

Template.favorites.helpers({
  posts: function () {
    return Posts.find(
      { favorited: Meteor.userId() },
      { sort: { createdAt: -1, name: 1 } }
    );
  },

  PostPreviewComponent() {
    return PostPreviewComponent;
  }
});
