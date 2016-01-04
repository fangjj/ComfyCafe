Template.post.onRendered(function () {
  $(".tooltipped").tooltip({delay: 50});
});

Template.post.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});

Template.post.helpers({
  exists: function () {
    return _.has(this, "medium") && this.medium.url;
  },
  isImage: function () {
    return this.medium.type.split("/")[0] === "image";
  },
  isVideo: function () {
    return this.medium.type.split("/")[0] === "video";
  },
  isOwner: function () {
    return Meteor.userId() === this.uploader;
  },
  favorited: function () {
    return _.contains(this.favorited, Meteor.userId());
  }
});

Template.post.events({
  "click #fabFavorite": function (event, template) {
    Meteor.call("favoritePost", this._id, ! _.contains(this.favorited, Meteor.userId()));
  },
  "click #fabReroll": function (event, template) {
    Meteor.call("rerollPost", this._id, function (err, name) {
      Router.go("post.view", {name: name});
    });
  },
  "click #fabDelete": function (event, template) {
    var self = this;
    Meteor.call("deletePost", this._id, function () {
      Router.go("home");
    });
  }
});
