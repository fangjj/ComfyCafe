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

});

Template.profile.helpers({
	isOwner: function () {
    return this._id === Meteor.userId();
	}
});

var addToCropzone = function (event, template) {
	var files = getFiles(event);
	var reader  = new FileReader();
	reader.onloadend = function () {
		$(".newAvatar").attr("src", reader.result);
		$(".newAvatar").cropper({
			aspectRatio: 1,
			dragMode: "move"
		});
	}
	reader.readAsDataURL(files[0]);
};

Template.profile.events({
	"dropped .cropzone": addToCropzone,
	"change .addAvatar": addToCropzone,
	"click .setAvatar": function (event, template) {
		var canvas = $(".newAvatar").cropper("getCroppedCanvas");
		canvas.toBlob(function (blob) {
			blob.name = "avatar.png";
			blob.source = "addAvatar";
			media.resumable.addFile(blob);
		});
	}
});
