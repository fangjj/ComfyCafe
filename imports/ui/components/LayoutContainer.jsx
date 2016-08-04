import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";

import Layout from "./Layout";

let doneCallback;
if (Meteor.isClient) {
  doneCallback = require("/imports/startup/client/accounts").default;
}

export default createContainer(({ params }) => {
  return {
    currentUser: Meteor.user(),
    passwordResetToken: Session.get("passwordResetToken"),
    doneCallback
  };
}, Layout);
