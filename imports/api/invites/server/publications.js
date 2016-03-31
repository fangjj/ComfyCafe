import Invites from "../collection";

Meteor.publish("invites", function () {
	//Meteor._sleepForMs(2000);
	return Invites.find({ owner: this.userId });
});
