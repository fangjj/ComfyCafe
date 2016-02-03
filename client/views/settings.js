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
      Router.go("profile", {username: Meteor.user().username});
    });
	},
	"click .cancel": function (event, template) {
		Router.go("profile", {username: Meteor.user().username});
	}
});
