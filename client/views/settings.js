Template.settings.helpers({
	dummyChecked: function () {
    if (! Meteor.user().profile.dummy) {
      return "checked";
    }
	}
});

Template.settings.events({
	"click .submit": function (event, template) {
		Meteor.call("applySettings", {
      dummy: ! template.$("input[name=dummy]").is(":checked")
    }, function () {
			var path = FlowRouter.path("profile", {username: Meteor.user().username});
      FlowRouter.go(path);
    });
	},
	"click .cancel": function (event, template) {
		var path = FlowRouter.path("profile", {username: Meteor.user().username});
		FlowRouter.go(path);
	}
});
