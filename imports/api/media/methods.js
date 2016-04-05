import media from "./collection";
import Posts from "../posts/collection";

if (Meteor.isServer) {
	getPalette = require("./server/palette").default;
}

Meteor.methods({
	freeMedium: function (mediumId) {
		check(mediumId, String);

    var medium = media.findOne({ _id: new Mongo.ObjectID(mediumId) });

		if (medium.metadata.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

    media.remove({ _id: new Mongo.ObjectID(mediumId) });
  },
	mediumDimensions: function (mediumId, width, height) {
		check(mediumId, String);
		check(width, Number);
		check(height, Number);

		var medium = media.findOne({ _id: new Mongo.ObjectID(mediumId) });

		if (medium.metadata.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		if (Meteor.isServer) {
			media.update(
				{ _id: new Mongo.ObjectID(mediumId) },
				{ $set: {
					"metadata.width": width,
					"metadata.height": height
				} }
			);
		}
	},
	mediumColor(mediumId) {
		check(mediumId, String);


		if (Meteor.isServer) {
			const medium = media.findOne({ _id: new Mongo.ObjectID(mediumId) });

			if (medium.contentType.split("/")[0] === "image") {
				getPalette(mediumId, Meteor.bindEnvironment((color) => {
					media.update(
						{ _id: new Mongo.ObjectID(mediumId) },
						{ $set: {
							"metadata.color": color
						} }
					);

					Posts.update(
						{ "medium._id": new Mongo.ObjectID(mediumId) },
						{ $set: {
							"color": color
						} }
					);
				}));
			}
		}
	}
});
