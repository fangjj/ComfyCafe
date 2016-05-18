import React from "react";

import violationMap from "/imports/api/common/violationMap";
import TypeIcon from "/imports/ui/client/components/Daikon/TypeIcon";

export default React.createClass({
  render() {
    const report = this.props.report;
    const url = FlowRouter.path("adminView", {
      panel: "reports",
      id: report._id
    });
    return <li>
      <a href={url}>
        <TypeIcon className="sigil" value={report.item.type} />
        <span className="violation">{violationMap[report.violation]}</span>
        :&nbsp;
        <span className="details">{report.details}</span>
      </a>
    </li>;
  }
});
