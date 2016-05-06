import _ from "lodash";
import React from "react";

import List from "/imports/ui/client/components/List";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";
import ReportListItem from "/imports/ui/client/components/Report/ReportListItem";

export default React.createClass({
  renderItems() {
    if (this.props.loading) {
      return <InlineLoadingSpinner />;
    }

    return _.map(this.props.reports, (report) => {
      return <ReportListItem report={report} key={report._id} />;
    });
  },
  render() {
    return <List>
      {this.renderItems()}
    </List>;
  }
});
