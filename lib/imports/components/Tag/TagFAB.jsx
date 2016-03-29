import React from "react";

import {
  FloatingActionButton,
  FontIcon
} from "material-ui";

TagFAB = React.createClass({
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
    return <div className="fixed-action-btn">
      <FloatingActionButton secondary={true} onTouchTap={this.showTagForm}>
        <FontIcon className="material-icons">add</FontIcon>
      </FloatingActionButton>
      <TagForm
        handleClose={this.hideTagForm}
        open={this.state.showForm}
      />
    </div>;
  }
});
