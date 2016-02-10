Meteor.publish("notifications", function (clientUserId) {
	if (clientUserId === this.userId) {
		return Notifications.find({ to: this.userId });
	} else {
		return null;
	}
});
