import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";

import doneCallback from "/imports/startup/client/accounts";
import Layout from "./MainLayout";

export default createContainer(({ params }) => {
  return {
    currentUser: Meteor.user(),
    passwordResetToken: Session.get("passwordResetToken"),
    doneCallback
  };
}, Layout);
