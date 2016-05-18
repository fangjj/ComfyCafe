import _ from "lodash";
import { createContainer } from "meteor/react-meteor-data";

import Reports from "/imports/api/reports/collection";
import ReportView from "./ReportView";

export default createContainer(({ params }) => {
  const reportId = FlowRouter.getParam("id");
  const handle = Meteor.subscribe("adminReport", Meteor.userId(), reportId);
  return {
    loading: ! handle.ready(),
    report: Reports.findOne({ _id: reportId })
  };
}, ReportView);
