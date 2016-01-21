Template.topBar.onRendered(function () {
	$(".tooltipped").tooltip({delay: 50});

	$("html").click(function () {
		var acc = $(".accountActions");
		if (acc.css("display") !== "none") {
			acc.fadeOut("fast");
		}
	});
});

Template.topBar.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});

Template.topBar.events({
	"click #accountActionsToggle": function (event, template) {
		if (event.which === 2) {
			// Middle mouse click
		} else {
			event.preventDefault();
			event.stopPropagation();
			$(".accountActions").fadeToggle("fast");
		}
	},
	"click .accountActions": function (event, template) {
		event.stopPropagation();
	}
});
