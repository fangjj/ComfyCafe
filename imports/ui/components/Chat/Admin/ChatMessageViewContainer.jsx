import { createContainer } from "meteor/react-meteor-data";

import Messages from "/imports/api/messages/collection";
import MessageView from "/imports/ui/components/Admin/MessageView";

export default createContainer(({ params }) => {
  const slug = FlowRouter.getParam("roomSlug");
  const messageId = FlowRouter.getParam("id");
  const handle = Meteor.subscribe("communityModMessage", slug, messageId);
  return {
    loading: ! handle.ready(),
    message: Messages.findOne({ _id: messageId })
  };
}, MessageView);
