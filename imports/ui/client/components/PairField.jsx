import React from "react";

import {
  TextField
} from "material-ui";

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
  render() {
    return <li className="pairField">
      <div className="labelField">
        <TextField
          value={this.state.label}
          floatingLabelText="Label"
          floatingLabelStyle={{fontSize: "20px"}}
          fullWidth={true}
          onChange={this.handleLabel}
        />
      </div>
      <div className="valueField">
        <TextField
          value={this.state.value}
          floatingLabelText="Value"
          floatingLabelStyle={{fontSize: "20px"}}
          fullWidth={true}
          onChange={this.handleValue}
        />
      </div>
    </li>;
  }
});
