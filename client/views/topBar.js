Template.topBar.onRendered(function () {
	$("html").click(function () {
		var acc = $(".accountActions");
		if (acc.css("display") !== "none") {
			acc.fadeOut("fast");
		}
	});
});

Template.topBar.events({
	"click #accountActionsToggle": function (event, template) {
		event.preventDefault();
		event.stopPropagation();
		$(".accountActions").fadeToggle("fast");
	},
	"click .accountActions": function (event, template) {
		event.stopPropagation();
	}
});
