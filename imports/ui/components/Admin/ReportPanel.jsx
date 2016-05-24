import React from "react";

import DenseContent from "/imports/ui/components/DenseContent";
import ReportListContainer from "/imports/ui/components/Report/ReportListContainer";

export default () => {
  return <DenseContent>
    <header>
      <h2>Reports</h2>
    </header>
    <ReportListContainer />
  </DenseContent>;
};
