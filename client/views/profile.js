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

Template.profile.onRendered(function () {
	media.resumable.assignBrowse($(".addAvatar"));

	$(".avatar.center").cropper({
	  aspectRatio: 1,
		viewMode: 3,
	  crop: function (event) {
			var canvas = $(".avatar.center").cropper("getCroppedCanvas");
			console.log(canvas.toDataURL());
	  }
	});
});

Template.profile.helpers({
	isOwner: function () {
    return this._id === Meteor.userId();
	}
});

Template.profile.events({

});
