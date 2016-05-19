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

    return _.map(this.props.messages, (message) => {
      const url = FlowRouter.path("adminView", {
        panel: "messages",
        id: message._id
      });
      return <li key={message._id}>
        <a href={url}>{message.owner.username + "/" + message._id}</a>
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
