Meteor.methods({
	deleteNotification: function (noteId) {
		check(noteId, String);

		var note = Notifications.findOne(noteId);

		if (! note.to === Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Notifications.remove(noteId);
	}
});
