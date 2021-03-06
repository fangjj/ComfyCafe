import _ from "lodash";
import React from "react";

import Actions from "/imports/ui/components/Actions";
import CancelButton from "/imports/ui/components/Button/CancelButton";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";

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
      return <Actions left={this.props.left}>
        <CancelButton
          onClick={this.handleCancel}
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
      id={this.props.id}
      className={this.props.className}
    >
      {children}
      {this.renderActions(actions)}
    </form>;
  }
});
