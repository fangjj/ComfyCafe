import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";

import Layout from "./MainLayout";

export default createContainer(({ params }) => {
  return { currentUser: Meteor.user() };
}, Layout);
