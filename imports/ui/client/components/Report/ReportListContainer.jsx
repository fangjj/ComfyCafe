import { createContainer } from "meteor/react-meteor-data";

import Reports from "/imports/api/reports/collection";
import ReportList from "./ReportList";

export default createContainer(({ params }) => {
  const handle = Meteor.subscribe("adminAllReports", Meteor.userId());

  return {
    loading: ! handle.ready(),
    reports: Reports.find({}, { sort: { createdAt: -1 } }).fetch()
  };
}, ReportList);
