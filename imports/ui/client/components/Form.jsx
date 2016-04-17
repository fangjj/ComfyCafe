import _ from "lodash";
import React from "react";

import Actions from "/imports/ui/client/components/Actions";
import CancelButton from "/imports/ui/client/components/Button/CancelButton";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

export default React.createClass({
  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit();
    if (_.isFunction(this.props.onClose)) {
      this.props.onClose();
    }
  },
  handleCancel(e) {
    if (_.isFunction(this.props.onClose)) {
      this.props.onClose();
    }
  },
  renderActions(actions) {
    if (actions) {
      return <Actions>
        <CancelButton
          onTouchTap={this.handleCancel}
        />
        <SubmitButton
          type="submit"
          label="Save"
        />
      </Actions>;
    }
  },
  render() {
    const { children, actions, onSubmit, onClose, ...leftoverProps } = this.props;

    return <form
      onSubmit={this.handleSubmit}
      {...leftoverProps}
    >
      {children}
      {this.renderActions(actions)}
    </form>;
  }
});
