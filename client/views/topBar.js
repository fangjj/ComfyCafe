Template.topBar.onRendered(function () {
	$("html").click(function () {
		_.each([$(".notifications"), $(".accountActions")], function (value) {
			if (value.css("display") !== "none") {
				value.fadeOut("fast");
			}
		});
	});
});

Template.topBar.helpers({
	notifications: function () {
		return Notifications.find(
			{ to: Meteor.userId() },
			{ sort: { createdAt: -1 } }
		);
	}
});

Template.topBar.events({
	"click #notificationListToggle": function (event, template) {
		if (event.which === 2) {
			// Middle mouse click
		} else {
			event.preventDefault();
			event.stopPropagation();
			$(".accountActions").fadeOut("fast");
			$(".notifications").fadeToggle("fast");
		}
	},
	"click .notifications": function (event, template) {
		event.stopPropagation();
	},

	"click #accountActionsToggle": function (event, template) {
		if (event.which === 2) {
			// Middle mouse click
		} else {
			event.preventDefault();
			event.stopPropagation();
			$(".notifications").fadeOut("fast");
			$(".accountActions").fadeToggle("fast");
		}
	},
	"click .accountActions": function (event, template) {
		event.stopPropagation();
	}
});
