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
  isOwner: function () {
    return isOwner(this);
  },
  favorited: function () {
    return _.contains(this.favorited, Meteor.userId());
  },
  subscribed: function () {
    if (Meteor.userId()) {
      return _.contains(Meteor.user().subscriptions, this.uploader._id);
    }
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
  "click .toggleSubscription": function (event, template) {
    Meteor.call("toggleSubscription", this.uploader._id);
  },
  "click #fabFavorite": function (event, template) {
    Meteor.call("favoritePost", this._id, ! _.contains(this.favorited, Meteor.userId()));
  },
  "click #fabDelete": function (event, template) {
    var self = this;
    Meteor.call("deletePost", this._id, function () {
      Router.go("feed");
    });
  }
});
