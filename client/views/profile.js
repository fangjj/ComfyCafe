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
	},
	hasAvatar: function () {
		return _.has(this.profile, "avatar");
	}
});

var cropperOptions = {
	aspectRatio: 1,
	dragMode: "move"
};

var addToCropzone = function (event, template) {
	var files = getFiles(event);
	var reader  = new FileReader();
	reader.onloadend = function () {
		var cropperInitialized = $(".newAvatar").hasClass("cropper-hidden");
		if (cropperInitialized) {
			$(".newAvatar").one("built.cropper", function () {

			}).cropper("reset").cropper("replace", reader.result).cropper(cropperOptions);
		} else {
			$(".cropzone").addClass("active");
			$(".newAvatar").attr("src", reader.result);
			$(".newAvatar").cropper(cropperOptions);
		}
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
			blob.source = "avatar";
			media.resumable.addFile(blob);
		});
	},
	"click .deleteAvatar": function (event, template) {
		Meteor.call("deleteAvatar");
	}
});
