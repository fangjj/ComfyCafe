Meteor.subscribe("posts");
Meteor.subscribe("media");

Template.post.onRendered(function () {
  $(".tooltipped").tooltip({delay: 50});
});

Template.post.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});

Template.post.helpers({
  fileObj: function () {
    return Media.findOne(this.medium);
  },
  isOwner: function () {
    return Meteor.userId() === this.uploader;
  }
});

Template.post.events({
  "click #fabDelete": function (event, template) {
    Meteor.call("deletePost", this._id, function () {
      Router.go("home");
    });
  }
});
