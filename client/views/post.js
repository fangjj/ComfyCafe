Template.post.onRendered(function () {
  $(".tooltipped").tooltip({delay: 50});
});

Template.post.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});

var isOwner = function (self) {
  return self.uploader && Meteor.userId() === self.uploader._id;
};

Template.post.helpers({
  isImage: function () {
    return this.contentType.split("/")[0] === "image";
  },
  isVideo: function () {
    return this.contentType.split("/")[0] === "video";
  },
  isAudio: function () {
    return this.contentType.split("/")[0] === "audio";
  },
  isOwner: function () {
    return isOwner(this);
  },
  favorited: function () {
    return _.contains(this.favorited, Meteor.userId());
  },
  showInfoBox: function () {
    return Boolean(this.medium);
  },
  showEditButton: function () {
    return isOwner(this);
  },
  showFavoriteButton: function () {
    return ! isOwner(this) && Meteor.userId() && this.medium;
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
      Router.go("post.list");
    });
  }
});
