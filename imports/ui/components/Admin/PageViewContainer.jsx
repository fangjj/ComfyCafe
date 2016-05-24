import { createContainer } from "meteor/react-meteor-data";

import Pages from "/imports/api/pages/collection";
import PageView from "./PageView";

export default createContainer(({ params }) => {
  const pageId = FlowRouter.getParam("id");
  const handle = Meteor.subscribe("modPage", pageId);
  return {
    loading: ! handle.ready(),
    page: Pages.findOne({ _id: pageId })
  };
}, PageView);
