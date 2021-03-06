import media from "/imports/api/media/collection";
import "/imports/api/users/methods";

export default function (file, callback) {
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

			Meteor.subscribe("medium", _id._str, () => {
				const cursor = media.find({ _id: _id });
				const liveQuery = cursor.observe({
					changed: function (newImage, oldImage) {
						if (newImage.length === file.size) {
							liveQuery.stop();
							callback(file.uniqueIdentifier);
							Meteor.call("setAvatar", file.uniqueIdentifier);
						}
					}
				});
			});
		}
	);
};
