import { createContainer } from "meteor/react-meteor-data";

import Pages from "/imports/api/pages/collection";
import PagePanel from "./PagePanel";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("modAllPages");
  return {
    loading: ! handle.ready(),
    pages: Pages.find(
      {},
      { sort: { createdAt: -1, name: 1 } }
    ).fetch()
  };
}, PagePanel);
