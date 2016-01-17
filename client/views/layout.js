Deps.autorun(function () {
  document.title = Session.get("pageTitle") || "TeruImages";
  Meteor.subscribe("media", Meteor.userId());
  Meteor.subscribe("avatars", Meteor.userId());
  Meteor.subscribe("jobs", Meteor.userId());
  $.cookie("X-Auth-Token", Accounts._storedLoginToken());
});

mediaUpload = function (self, file) {
  self.isUploading.set(true);
  media.insert({
      _id: file.uniqueIdentifier,
      filename: file.fileName,
      contentType: file.file.type,
      metadata: {
        master: true
      }
    }, function (err, _id) {
      if (err) { return console.error("File creation failed!", err); }
      media.resumable.upload();

      var cursor = media.find({ _id: _id });
      var liveQuery = cursor.observe({
        changed: function(newImage, oldImage) {
          if (newImage.length === file.size) {
            liveQuery.stop();
            self.isUploading.set(false);
            self.progress.set(0);
            Meteor.call("addPost", file.uniqueIdentifier, function (err, name) {
              Router.go("post.view", { name: name });
            });
          }
        }
      });
    }
  );
};

Template.layout.onCreated(function () {
	this.isUploading = new ReactiveVar(false);
	this.progress = new ReactiveVar(0);
});

Template.layout.onRendered(function () {
	var self = this;

	media.resumable.assignDrop($("html"));
	media.resumable.on("fileAdded", function (file) {
		mediaUpload(self, file);
	});
	media.resumable.on("progress", function () {
		self.progress.set(media.resumable.progress() * 100);
	});

  avatars.resumable.on("fileAdded", function (file) {
    avatarUpload(self, file);
  });
	avatars.resumable.on("progress", function () {
		self.progress.set(avatars.resumable.progress() * 100);
	});
});

Template.layout.helpers({
	isUploading: function () {
		return Template.instance().isUploading.get();
	},
	progress: function () {
		return Template.instance().progress.get();
	}
});
