Meteor.subscribe("posts");
Meteor.subscribe("media");

Template.post.onRendered(function () {
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
});
