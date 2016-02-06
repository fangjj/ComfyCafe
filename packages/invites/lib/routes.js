FlowRouter.route("/invites/", {
  name: "invites",
  action: function () {
    setTitle("Invites");
    BlazeLayout.render("layout", {content: "invites"});
  }
});
