import { createContainer } from "meteor/react-meteor-data";

import ChatMemberPanel from "./ChatMemberPanel";

export default createContainer(({ params }) => {
  const slug = FlowRouter.getParam("roomSlug");
  const handle = Meteor.subscribe("communityModAllMembers", slug);
  const group = "community_" + slug;
  const doc = {};
  doc["roles." + group] = "member";
  return {
    loading: ! handle.ready(),
    users: Meteor.users.find(
      doc,
      { sort: { username: 1 } }
    ).fetch()
  };
}, ChatMemberPanel);
