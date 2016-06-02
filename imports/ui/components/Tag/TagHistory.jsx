import React from "react";

import Content from "/imports/ui/components/Content";
import List from "/imports/ui/components/List";
import LoadingSpinner from "/imports/ui/components/Spinner/LoadingSpinner";
import TagHistoryItem from "/imports/ui/components/Tag/TagHistoryItem";

export default React.createClass({
  renderList() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    return _.map(this.props.history, (h) => {
      return <TagHistoryItem item={h} key={h._id} />;
    });
  },
  render() {
    return <Content>
      <List>
        {this.renderList()}
      </List>
    </Content>;
  }
});
