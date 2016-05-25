import { createContainer } from "meteor/react-meteor-data";

import Messages from "/imports/api/messages/collection";
import ChatMessagePanel from "./ChatMessagePanel";

export default createContainer(({ params }) => {
  const slug = FlowRouter.getParam("roomSlug");
  const handle = Meteor.subscribe("communityModAllMessages", slug);
  return {
    loading: ! handle.ready(),
    messages: Messages.find(
      { "topic.room.slug": slug },
      { sort: { createdAt: -1 } }
    ).fetch()
  };
}, ChatMessagePanel);
