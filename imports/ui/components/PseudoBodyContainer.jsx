import { createContainer } from "meteor/react-meteor-data";

import Posts from "/imports/api/posts/collection";
import PseudoBody from "./PseudoBody";

export default createContainer(({ params }) => {
  if (Meteor.isServer) {
    const post = Posts.findOne(
      {
        "owner.username": FlowRouter.getParam("username"),
        name: FlowRouter.getParam("postName")
      }
    );
    if (post) {
      return {
        seed: post.name,
        color: post.bgColor || post.complement
      };
    } return {};
  } else {
    return {
      seed: Session.get("patternSeed"),
      color: Session.get("patternColor")
    };
  }
}, PseudoBody);
