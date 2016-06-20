import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";

import metaBuilder from "/imports/ui/utils/metaBuilder";
import Layout from "./Layout";

let doneCallback;
if (Meteor.isClient) {
  doneCallback = require("/imports/startup/client/accounts").default;
}

export default createContainer(({ params }) => {
  metaBuilder({
    title: "ComfyCafé",
    description: "The image site for cool kids."
  });

  return {
    currentUser: Meteor.user(),
    passwordResetToken: Session.get("passwordResetToken"),
    doneCallback
  };
}, Layout);
