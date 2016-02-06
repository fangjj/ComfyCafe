Router.route("/invites/", {
  name: "invites",
  loadingTemplate: "loading",
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
