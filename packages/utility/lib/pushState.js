pushState = function (where) {
  var lastState = Session.get("lastHistState");
  if (where !== lastState) {
    window.history.pushState(FlowRouter.current().context, Session.get("pageTitle"), where);
    Session.set("lastHistState", where);
  }
}
