import { createContainer } from "meteor/react-meteor-data";

import Messages from "/imports/api/messages/collection";
import MessageView from "./MessageView";

export default createContainer(({ params }) => {
  const messageId = FlowRouter.getParam("id");
  const handle = Meteor.subscribe("modMessage", messageId);
  return {
    loading: ! handle.ready(),
    message: Messages.findOne({ _id: messageId })
  };
}, MessageView);
