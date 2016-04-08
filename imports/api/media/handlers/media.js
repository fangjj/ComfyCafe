import media from "../collection";
import "../methods";

export default function (self, file, callback) {
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

      const cursor = media.find({ _id: _id });
      const liveQuery = cursor.observe({
        changed: function (newImage, oldImage) {
          if (newImage.length === file.size) {
            const done = () => {
              liveQuery.stop();
              callback(file.uniqueIdentifier);
            };

            if (newImage.contentType.split("/")[0] === "image") {
              const img = new Image();
              img.onload = function () {
                const imgWidth = this.width;
                const imgHeight = this.height;
                URL.revokeObjectURL(img.src);

                Meteor.call("mediumComplete", file.uniqueIdentifier);
                Meteor.call("mediumDimensions", file.uniqueIdentifier, imgWidth, imgHeight);
                Meteor.call("mediumColor", file.uniqueIdentifier);

                done();
              }
              img.src = URL.createObjectURL(file.file);
            } else {
              done();
            }
          }
        }
      });
    }
  );
};
