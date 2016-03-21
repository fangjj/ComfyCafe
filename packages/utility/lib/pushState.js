pushState = function (where) {
  var lastState = Session.get("lastHistState");
  if (where !== lastState) {
    window.history.pushState(
      FlowRouter.current().context,
      Session.get("pageTitle"),
      window.location.pathname + where
    );
    Session.set("lastHistState", window.location.pathname + where);
  }
}
