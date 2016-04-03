pushState = function (where) {
  if (Meteor.isServer) {
    return;
  }
  var where = window.location.pathname + where;
  var lastState = Session.get("lastHistState");
  if (where !== lastState) {
    console.log("pushState", where, "lastHistState", lastState);
    window.history.pushState(
      FlowRouter.current().context,
      Session.get("pageTitle"),
      where
    );
    Session.set("lastHistState", where);
  }
}
