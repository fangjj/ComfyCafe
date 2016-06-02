import _ from "lodash";
import React from "react";
import { DragSource } from "react-dnd";

const ListItem = React.createClass({
  render() {
    return <li>{this.props.post}</li>;
  }
});

export default React.createClass({
  handleSort(items, dragging) {
    console.log(items, dragging);
  },
  renderItems() {
    return _.map(this.props.posts, (post) => {
      return <ListItem
        post={post}
        onSort={this.handleSort}
        key={post}
      />;
    });
  },
  render() {
    return <ul>
      {this.renderItems()}
    </ul>;
  }
});
