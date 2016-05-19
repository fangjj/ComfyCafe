import React from "react";

import DenseContent from "/imports/ui/client/components/DenseContent";
import ReportListContainer from "/imports/ui/client/components/Report/ReportListContainer";

export default () => {
  return <DenseContent>
    <header>
      <h2>Reports</h2>
    </header>
    <ReportListContainer />
  </DenseContent>;
};
