import { createContainer } from "meteor/react-meteor-data";

import Messages from "/imports/api/messages/collection";
import MessagePanel from "./MessagePanel";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("modAllMessages");
  return {
    loading: ! handle.ready(),
    messages: Messages.find(
      {},
      { sort: { createdAt: -1 } }
    ).fetch()
  };
}, MessagePanel);
