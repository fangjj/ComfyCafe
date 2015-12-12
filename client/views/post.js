Meteor.subscribe("posts");
Meteor.subscribe("media");

Template.post.onRendered(function () {
  $(".tooltipped").tooltip({delay: 50});

  var video = $("video");
  if (video.length) {
    videojs(video[0], {
      controls: true,
      autoplay: false,
      preload: "auto"
    }, function () {

    });
  }
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
      $(".tooltipped").tooltip("remove");
      Router.go("home");
    });
  }
});
