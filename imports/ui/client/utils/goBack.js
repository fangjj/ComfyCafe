import _ from "lodash";

export default function (exclude) {
  const prev = Session.get("previousPath");
  const current = FlowRouter.current().path;
  let go = prev;
  if (! prev || prev === current || (exclude && _.includes(exclude, prev))) {
    go = "/";
  }
  console.log(go);
  FlowRouter.go(go);
};
