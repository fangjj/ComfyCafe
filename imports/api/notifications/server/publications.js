import Notifications from "../collection";

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
