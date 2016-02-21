Meteor.methods({
	freeMedium: function (mediumId) {
		check(mediumId, String);

    var medium = media.findOne({ _id: new Mongo.ObjectID(mediumId) });

		if (! medium.metadata.owner === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

    media.remove({ _id: new Mongo.ObjectID(mediumId) });
  }
});
