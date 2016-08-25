import _ from "lodash";
import React from "react";

import Content from "/imports/ui/components/Content";
import List from "/imports/ui/components/List";
import LoadingSpinner from "/imports/ui/components/Spinner/LoadingSpinner";
import TagHistoryListItem from "/imports/ui/components/Tag/TagHistoryListItem";

export default React.createClass({
  renderList() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    return _.map(this.props.history, (h) => {
      return <TagHistoryListItem item={h} key={h._id} />;
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
