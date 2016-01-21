Template.settings.events({
	"click .submit": function (event, template) {
		Meteor.call("applySettings", {
      privateByDefault: ! template.$("input[name=privateByDefault]").is(":checked")
    });
	}
});
