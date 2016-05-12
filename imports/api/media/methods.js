import _ from "lodash";

import media from "./collection";
import Posts from "../posts/collection";

if (Meteor.isServer) {
	mediumValidate = require("./server/validate").default;
	getPalette = require("./server/palette").default;
}

function regenThumbs(mediumId, authFunc) {
	if (_.isString(mediumId)) {
		mediumId = new Mongo.ObjectID(mediumId);
	}

	const medium = media.findOne({ _id: mediumId });

	if (! authFunc(medium)) {
		throw new Meteor.Error("not-authorized");
	}

	if (Meteor.isServer) {
		media.remove({ "metadata.thumbOf": mediumId });
		media.update(
			{ _id: mediumId },
			{ $unset: {
				"metadata._Jobs": 1,
				"metadata.thumbnails": 1,
				"metadata.thumbsComplete": 1,
				"metadata.thumbsTerminated": 1
			} }
		);
	}
}

Meteor.methods({
	mediumDelete(mediumId) {
		check(mediumId, String);

    const medium = media.findOne({ _id: new Mongo.ObjectID(mediumId) });

		if (medium.metadata.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

    media.remove({ _id: new Mongo.ObjectID(mediumId) });
  },
	mediumComplete(mediumId) {
		check(mediumId, String);

    const medium = media.findOne({ _id: new Mongo.ObjectID(mediumId) });

		if (medium.metadata.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		if (Meteor.isServer) {
			try {
				mediumValidate(medium._id, Meteor.bindEnvironment((mime, valid) => {
					if (valid) {
				    media.update(
							{ _id: medium._id },
							{ $set: {
								contentType: mime,
								"metadata.complete": true
							} }
						);
					} else {
						media.remove({ _id: medium._id });
						console.error("Invalid medium " + mediumId + " purged. (Invalid)");
						throw new Meteor.Error("invalid-medium");
					}
				}));
			} catch (e) {
				console.error(e);
				media.remove({ _id: medium._id });
				console.error("Invalid medium " + mediumId + " purged. (Caught)");
				throw e;
			}
		}
  },
	mediumDimensions(mediumId, width, height) {
		check(mediumId, String);
		check(width, Number);
		check(height, Number);

		const medium = media.findOne({ _id: new Mongo.ObjectID(mediumId) });

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
				getPalette(mediumId, Meteor.bindEnvironment((color, complement) => {
					media.update(
						{ _id: new Mongo.ObjectID(mediumId) },
						{ $set: {
							"metadata.color": color,
							"metadata.complement": complement
						} }
					);

					Posts.update(
						{ "medium._id": new Mongo.ObjectID(mediumId) },
						{ $set: {
							"color": color,
							"complement": complement
						} }
					);
				}));
			}
		}
	},
	mediumRegenThumbs(mediumId) {
		check(mediumId, String);
		regenThumbs(mediumId, (medium) => {
			if (medium.metadata.owner !== Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
		});
	}
});

export {
	regenThumbs
};
