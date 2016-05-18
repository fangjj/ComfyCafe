import React from "react";

import "/imports/api/posts/adminMethods";
import { isAdmin, isDev, isMod } from "/imports/api/common/persimmons";
import violationMap from "/imports/api/common/violationMap";
import DenseContent from "/imports/ui/client/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";
import List from "/imports/ui/client/components/List";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

export default React.createClass({
  render() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    const report = this.props.report;
    return <DenseContent>
      <section>
        {report.details}
        {violationMap[report.violation]}
        {report.item.type}
      </section>

      <section>
        <header>
          <h3>Actions</h3>
        </header>
        <ul>
          <li>Edit</li>
          <li>Delete</li>
        </ul>
      </section>
    </DenseContent>;
  }
});
