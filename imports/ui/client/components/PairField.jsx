import React from "react";
import IconButton from "material-ui/IconButton";

import Icon from "/imports/ui/client/components/Daikon/Icon";
import TextField from "/imports/ui/client/components/TextField";

export default React.createClass({
  getInitialState() {
    return {
      label: this.props.defaultLabel || "",
      value: this.props.defaultValue || ""
    };
  },
  handleLabel(e) {
    const label = e.target.value;
    this.setState({
      label: label
    });
    this.props.onChange(this.props.uniqueId, label, this.state.value);
  },
  handleValue(e) {
    const value = e.target.value;
    this.setState({
      value: value
    });
    this.props.onChange(this.props.uniqueId, this.state.label, value);
  },
  handleRemove(e) {
    this.props.onRemove(this.props.uniqueId);
  },
  render() {
    return <li className="pairField">
      <div className="labelField">
        <TextField
          value={this.state.label}
          label="Label"
          autoFocus={this.props.autoFocus}
          onChange={this.handleLabel}
        />
      </div>
      <div className="valueField">
        <TextField
          value={this.state.value}
          label="Value"
          onChange={this.handleValue}
        />
      </div>
      <IconButton className="remove" tabIndex={-1} onTouchTap={this.handleRemove}>
        <Icon>close</Icon>
      </IconButton>
    </li>;
  }
});
