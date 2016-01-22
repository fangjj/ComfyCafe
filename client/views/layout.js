Tracker.autorun(function () {
  document.title = Session.get("pageTitle") || "TeruImages";
  Meteor.subscribe("notifications");
  Meteor.subscribe("media", Meteor.userId());
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
        thumbnailPolicy: "postMedium"
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
            Meteor.call("addPost", {
              mediumId: file.uniqueIdentifier,
              tags: "tagme"
            }, function (err, name) {
              Router.go("post", { name: name });
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
    // The file's entrypoint; used to route storage actions.
    var source = file.file.source;
    if (! source) {
      if (file.container) {
        source = file.container.className;
      } else {
        // file.container is undefined in Firefox for some reason...
        // but since there are only two cases, we can just go to default.
        source = "default";
      }
    }

    if (source === "avatar") {
      // This is definitely an avatar!
      avatarUpload(self, file);
    } else {
      // This is... everything else!
      mediaUpload(self, file);
    }
	});
	media.resumable.on("progress", function () {
		self.progress.set(media.resumable.progress() * 100);
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
