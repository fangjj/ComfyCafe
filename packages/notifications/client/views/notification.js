Template.notification.events({
	"click .deleteNotification": function (event, template) {
    event.stopPropagation();
    Meteor.call("deleteNotification", this._id);
	}
});
