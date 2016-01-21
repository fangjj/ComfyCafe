Template.settings.helpers({
	privateByDefaultChecked: function () {
    if (! Meteor.user().profile.privateByDefault) {
      return "checked";
    }
	}
});

Template.settings.events({
	"click .submit": function (event, template) {
		Meteor.call("applySettings", {
      privateByDefault: ! template.$("input[name=privateByDefault]").is(":checked")
    }, function () {
      Router.go("profile", {username: Meteor.user().username});
    });
	},
	"click .cancel": function (event, template) {
		Router.go("profile", {username: Meteor.user().username});
	}
});
