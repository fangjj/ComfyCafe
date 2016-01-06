Deps.autorun(function () {
  Meteor.subscribe("media", Meteor.userId());
  $.cookie("X-Auth-Token", Accounts._storedLoginToken());
});

Template.home.onCreated(function () {
	this.isUploading = new ReactiveVar(false);
});

Template.home.onRendered(function () {
	var self = this;

	$(".tooltipped").tooltip({delay: 50});

	media.resumable.assignDrop($(".dropzone"));
	media.resumable.assignBrowse($(".addFile"));

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
						} else {
							console.log(newImage.length, file.size);
						}
					}
				});
			}
		);
	});
});

Template.home.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});

Template.home.helpers({
	isUploading: function () {
		return Template.instance().isUploading.get();
	}
});
