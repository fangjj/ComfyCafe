Router.route("/invites/", {
  name: "invites",
  loadingTemplate: "loading",
  waitOn: function () {
    return Meteor.subscribe("invites");
  },
  action: function () {
    setTitle("Invites");
    this.render("invites", {
      data: {
        invites: function () {
          return Invites.find();
        }
      }
    });
  }
});
