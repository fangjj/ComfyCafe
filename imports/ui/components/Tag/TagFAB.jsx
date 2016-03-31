import React from "react";

import TagForm from "./TagForm";
import FAB from "../FAB";

const TagFAB = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showTagForm() {
    this.setState({showForm: true});
  },
  hideTagForm() {
    this.setState({showForm: false});
  },
  render() {
    return <FAB iconName="add" onTouchTap={this.showTagForm}>
      <TagForm
        handleClose={this.hideTagForm}
        open={this.state.showForm}
      />
    </FAB>;
  }
});

export default TagFAB;
