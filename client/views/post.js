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
  Inline404Component() {
    return Inline404Component;
  },
  LoadingSpinnerComponent() {
    return LoadingSpinnerComponent;
  },
  PostInfoBoxComponent() {
    return PostInfoBoxComponent;
  },
  TagTreeComponent() {
    return TagTreeComponent;
  },
  FavoriteFAB() {
    return FavoriteFAB;
  },
  PostModifyFAB() {
    return PostModifyFAB;
  }
});
