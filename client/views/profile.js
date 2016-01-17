avatarUpload = function (self, file) {
	self.isUploading.set(true);
	avatars.insert({
			_id: file.uniqueIdentifier,
			filename: file.fileName,
			contentType: file.file.type,
			metadata: {
				master: true
			}
		}, function (err, _id) {
			if (err) { return console.error("File creation failed!", err); }
			avatars.resumable.upload();

			var cursor = avatars.find({ _id: _id });
			var liveQuery = cursor.observe({
				changed: function(newImage, oldImage) {
					if (newImage.length === file.size) {
						liveQuery.stop();
						self.isUploading.set(false);
						self.progress.set(0);
						Meteor.call("setAvatar", file.uniqueIdentifier);
					}
				}
			});
		}
	);
};

Template.profile.onRendered(function () {
	avatars.resumable.assignBrowse($(".addAvatar"));
});

Template.profile.helpers({
	isOwner: function () {
    return this._id === Meteor.userId();
	}
});

Template.profile.events({

});
