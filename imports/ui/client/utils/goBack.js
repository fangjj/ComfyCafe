export default function () {
  const prev = Session.get("previousPath");
  const current = FlowRouter.current().path;
  let go = prev;
  if (! prev || prev === current) {
    go = "/";
  }
  FlowRouter.go(go);
};
