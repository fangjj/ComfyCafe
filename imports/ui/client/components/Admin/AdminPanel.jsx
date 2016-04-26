import React from "react";

import DenseContent from "/imports/ui/client/components/DenseContent";
import ReportListContainer from "/imports/ui/client/components/Report/ReportListContainer";

export default () => {
  return <DenseContent>
    <header>
      <h2>Admin panel</h2>
    </header>
    <section>
      <header>
        <h3>Reports</h3>
      </header>
      <ReportListContainer />
    </section>
  </DenseContent>;
};
