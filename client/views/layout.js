Tracker.autorun(function () {
  document.title = Session.get("pageTitle") || "TeruImages";
  Meteor.subscribe("media", Meteor.userId());
  Meteor.subscribe("jobs", Meteor.userId());
  $.cookie("X-Auth-Token", Accounts._storedLoginToken());
});

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
	},

  TopBarComponent() {
    return TopBarComponent;
  }
});
