Meteor.publish("notifications", function (clientUserId) {
	if (clientUserId === this.userId) {
		return Notifications.find(
			{
				to: this.userId,
				dismissed: { $ne: true }
			}
		);
	} else {
		return null;
	}
});

Meteor.publish("friendRequest", function (clientUserId, recipId) {
	if (clientUserId === this.userId) {
		return Notifications.find(
			{
				action: "friendRequest",
				to: recipId,
				"owner._id": clientUserId
			}
		);
	} else {
		return null;
	}
});
