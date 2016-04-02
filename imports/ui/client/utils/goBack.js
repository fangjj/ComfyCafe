export default function () {
  FlowRouter.go(Session.get("previousPath") || "/");
};
