import { createContainer } from "meteor/react-meteor-data";

import Posts from "/imports/api/posts/collection";
import PseudoBody from "./PseudoBody";

export default createContainer(({ params }) => {
  const name = FlowRouter.getParam("name");
  if (name) {
    const handle = Meteor.subscribe("postColor", name);
    const post = Posts.findOne(
      { name },
      { fields: { name: 1, bgColor: 1, complement: 1 } }
    );
    if (post) {
      const obj = {
        seed: post.name,
        color: post.bgColor || post.complement
      };
      if (Meteor.isClient) {
        this.last = obj;
      }
      return obj;
    }
  } else if (this.last) {
    return this.last;
  }
  return {};
}, PseudoBody);
