function setTitle(title) {
  if (! title) {
    title = "ComfyCafé";
  }
  if (Meteor.isClient) {
    Session.set("pageTitle", title);
  } else {
    DocHead.setTitle(title);
  }
};

export default setTitle;
