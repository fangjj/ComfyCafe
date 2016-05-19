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

    return _.map(this.props.pages, (page) => {
      const url = FlowRouter.path("adminView", {
        panel: "pages",
        id: page._id
      });
      return <li key={page._id}>
        <a href={url}>{page.owner.username + "/" + page.name}</a>
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
