import { createContainer } from "meteor/react-meteor-data";

import Reports from "/imports/api/reports/collection";
import ReportList from "/imports/ui/components/Report/ReportList";

export default createContainer(({ params }) => {
  const slug = FlowRouter.getParam("roomSlug");
  const handle = Meteor.subscribe("communityModAllReports", slug);
  return {
    loading: ! handle.ready(),
    reports: Reports.find({ "community.slug": slug }, { sort: { createdAt: -1 } }).fetch()
  };
}, ReportList);
