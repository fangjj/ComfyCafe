Template.topBar.onRendered(function () {
	$(".tooltipped").tooltip({delay: 50});

	$("html").click(function () {
		var acc = $(".accountActions, .notifications");
		if (acc.css("display") !== "none") {
			acc.fadeOut("fast");
		}
	});
});

Template.topBar.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
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
