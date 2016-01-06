Template.post.onRendered(function () {
  $(".tooltipped").tooltip({delay: 50});
});

Template.post.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});

Template.post.helpers({
  isImage: function () {
    return this.contentType.split("/")[0] === "image";
  },
  isVideo: function () {
    return this.contentType.split("/")[0] === "video";
  },
  isOwner: function () {
    return Meteor.userId() === this.post.uploader;
  },
  favorited: function () {
    return _.contains(this.post.favorited, Meteor.userId());
  }
});

Template.post.events({
  "click #fabFavorite": function (event, template) {
    Meteor.call("favoritePost", this.post._id, ! _.contains(this.post.favorited, Meteor.userId()));
  },
  "click #fabReroll": function (event, template) {
    Meteor.call("rerollPost", this.post._id, function (err, name) {
      Router.go("post.view", {name: name});
    });
  },
  "click #fabDelete": function (event, template) {
    var self = this;
    Meteor.call("deletePost", this.post._id, function () {
      Router.go("home");
    });
  }
});
