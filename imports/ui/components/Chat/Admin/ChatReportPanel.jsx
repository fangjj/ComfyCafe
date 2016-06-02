import React from "react";

import DenseContent from "/imports/ui/components/DenseContent";
import ChatReportListContainer from "/imports/ui/components/Chat/Admin/ChatReportListContainer";

export default () => {
  return <DenseContent>
    <header>
      <h2>Reports</h2>
    </header>
    <ChatReportListContainer />
  </DenseContent>;
};
