Template.post.onRendered(function () {
  $(".tooltipped").tooltip({delay: 50});
});

Template.post.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});

Template.post.helpers({
  isImage: function () {
    console.log(this);
    return this.medium.type.split("/")[0] === "image";
  },
  isVideo: function () {
    return this.medium.type.split("/")[0] === "video";
  },
  isOwner: function () {
    return Meteor.userId() === this.uploader;
  }
});

Template.post.events({
  "click #fabReroll": function (event, template) {
    Meteor.call("rerollPost", this._id, function (err, name) {
      Router.go("post.view", {name: name});
    });
  },
  "click #fabDelete": function (event, template) {
    Meteor.call("deletePost", this._id, function () {
      Router.go("home");
    });
  }
});
