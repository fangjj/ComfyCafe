pushState = function (where) {
  window.history.pushState(FlowRouter.current().context, Session.get("pageTitle"), where);
}
