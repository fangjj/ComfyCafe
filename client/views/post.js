Template.post.onCreated(function () {
  var self = this;
  self.autorun(function () {
    self.subscribe("post", FlowRouter.getParam("postId"));
  });
});

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
  post: function () {
    return Posts.findOne({ _id: FlowRouter.getParam("postId") });
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
  },

  AvatarComponent() {
    return AvatarComponent;
  },
  MediumComponent() {
    return MediumComponent;
  },
  SubscriptionButton() {
    return SubscriptionButton;
  }
});

Template.post.events({
  "click #fabFavorite": function (event, template) {
    Meteor.call("favoritePost", this._id, ! _.contains(this.favorited, Meteor.userId()));
  },
  "click #fabDelete": function (event, template) {
    var self = this;
    Meteor.call("deletePost", this._id, function () {
      var path = FlowRouter.path("feed");
      FlowRouter.go(path);
    });
  }
});
