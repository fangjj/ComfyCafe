import Notifications from "./collection";

Meteor.methods({
	dismissNotification: function (noteId) {
		check(noteId, String);

		var note = Notifications.findOne(noteId);

		if (note.to !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Notifications.update(
			{ _id: noteId },
			{ $set: {
				dismissed: true
			} }
		);
	},
	deleteNotification: function (noteId) {
		check(noteId, String);

		var note = Notifications.findOne(noteId);

		if (note.to !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Notifications.remove(noteId);
	}
});
