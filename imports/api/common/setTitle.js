function setTitle(title) {
  if (Meteor.isClient) {
    if (! title) {
      title = "ComfyCafé";
    }
    Session.set("pageTitle", title);
  }
};

export default setTitle;
