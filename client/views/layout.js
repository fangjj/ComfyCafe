Deps.autorun(function () {
  Meteor.subscribe("media", Meteor.userId());
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
		self.isUploading.set(true);
		media.insert({
				_id: file.uniqueIdentifier,
				filename: file.fileName,
				contentType: file.file.type
			}, function (err, _id) {
				if (err) { return console.error("File creation failed!", err); }
				media.resumable.upload();

				var cursor = media.find({ _id: _id });
				var liveQuery = cursor.observe({
					changed: function(newImage, oldImage) {
						if (newImage.length === file.size) {
							liveQuery.stop();
							self.isUploading.set(false);
							Meteor.call("addPost", file.uniqueIdentifier, function (err, name) {
								Router.go("post.view", { name: name });
							});
						}
					}
				});
			}
		);
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
