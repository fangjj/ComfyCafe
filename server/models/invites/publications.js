Meteor.publish("invites", function () {
	//Meteor._sleepForMs(2000);
	return Invites.find({ uploader: this.userId });
});