import React from "react";

import DenseContent from "/imports/ui/client/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";
import List from "/imports/ui/client/components/List";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

export default React.createClass({
  renderList() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    return _.map(this.props.communities, (community) => {
      const url = FlowRouter.path("adminView", {
        panel: "communities",
        id: community._id
      });
      return <li key={community._id}>
        <a href={url}>{community.name} {community.system ? "[SYSTEM]" : null}</a>
      </li>;
    });
  },
  render() {
    return <DenseContent>
      <List>
        {this.renderList()}
      </List>
    </DenseContent>;
  }
});
