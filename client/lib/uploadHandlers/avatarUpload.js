avatarUpload = function (self, file) {
	self.isUploading.set(true);
	media.insert({
			_id: file.uniqueIdentifier,
			filename: file.fileName,
			contentType: file.file.type,
			metadata: {
      	thumbnailPolicy: "avatar"
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
						Meteor.call("setAvatar", file.uniqueIdentifier);
					}
				}
			});
		}
	);
};
