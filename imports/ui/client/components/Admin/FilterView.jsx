import _ from "lodash";
import React from "react";

import DenseContent from "/imports/ui/client/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";
import FilterForm from "/imports/ui/client/components/Filter/FilterForm";

export default React.createClass({
  render() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    return <DenseContent>
      <FilterForm
        filter={this.props.filter}
        global={! _.has(this.props.filter, "owner")}
        actions={true}
      />
    </DenseContent>;
  }
});
