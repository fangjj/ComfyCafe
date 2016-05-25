import { createContainer } from "meteor/react-meteor-data";

import ChatMemberView from "./ChatMemberView";

export default createContainer(({ params }) => {
  const slug = FlowRouter.getParam("roomSlug");
  const userId = FlowRouter.getParam("id");
  const handle = Meteor.subscribe("communityModMember", slug, userId);
  return {
    loading: ! handle.ready(),
    user: Meteor.users.findOne({ _id: userId })
  };
}, ChatMemberView);
