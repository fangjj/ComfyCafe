import React from "react";

import TagUpdateForm from "./TagUpdateForm";
import FAB from "../FAB";

const TagEditFAB = React.createClass({
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
    return <FAB iconName="edit" onTouchTap={this.showTagForm}>
      <TagUpdateForm
        tag={this.props.tag}
        handleClose={this.hideTagForm}
        open={this.state.showForm}
      />
    </FAB>;
  }
});

export default TagEditFAB;
