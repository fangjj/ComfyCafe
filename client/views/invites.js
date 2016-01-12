Template.invites.onRendered(function () {
	setTitle("Invites");

	$(".tooltipped").tooltip({delay: 50});
});

Template.invites.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});

Template.invites.events({
  "click #fabInvite": function (event, template) {
    Meteor.call("addInvite", function () {});
  },
  "click .deleteInvite": function (event, template) {
    var key = $(event.currentTarget).siblings(".key").text();
    Meteor.call("deleteInvite", key, function () {});
  }
});
