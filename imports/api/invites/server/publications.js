import Invites from "../collection";

Meteor.publish("invites", function () {
	//Meteor._sleepForMs(2000);
	return Invites.find({ owner: this.userId });
});

Meteor.publish("yourInvites", function (slug) {
	check(slug, String);
	return Invites.find(
		{
			to: this.userId,
			"community.slug": slug
		});
});
