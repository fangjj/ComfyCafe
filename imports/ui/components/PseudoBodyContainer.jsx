import { createContainer } from "meteor/react-meteor-data";

import Posts from "/imports/api/posts/collection";
import PseudoBody from "./PseudoBody";

export default createContainer(({ params }) => {
  const username = FlowRouter.getParam("username");
  const name = FlowRouter.getParam("postName");
  if (username && name) {
    const handle = Meteor.subscribe("postColor", username, name);
    const post = Posts.findOne(
      {
        "owner.normalizedUsername": username.toLowerCase(),
        name
      },
      { fields: { name: 1, bgColor: 1, complement: 1 } }
    );
    if (post) {
      return {
        seed: post.name,
        color: post.bgColor || post.complement
      };
    }
  }
  return {};
}, PseudoBody);
