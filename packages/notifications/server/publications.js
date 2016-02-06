Meteor.publish("notifications", function () {
	if (this.userId) {
		return Notifications.find({ to: this.userId });
	}
});
