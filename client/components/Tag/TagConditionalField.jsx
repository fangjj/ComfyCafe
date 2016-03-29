import React from "react";

let {
  TextField
} = mui;

TagConditionalField = React.createClass({
  getInitialState() {
    return {
      cond: this.props.defaultCondition || "",
      impl: this.props.defaultImplications || ""
    };
  },
  handleCond(e) {
    this.setState({
      cond: e.target.value
    });
    this.props.onChange(this.props.condImplId, e.target.value, this.state.impl);
  },
  handleImpl(value) {
    this.setState({
      impl: value
    });
    this.props.onChange(this.props.condImplId, this.state.cond, value);
  },
  render() {
    return <li className="condImplicationField">
      <div className="condField">
        <TextField
          defaultValue={this.props.defaultCondition}
          floatingLabelText="Condition"
          floatingLabelStyle={{fontSize: "20px"}}
          onChange={this.handleCond}
        />
      </div>
      <div className="implicationField">
        <TagField
          inheritFrom={this.props.inheritFrom}
          noExpand={true}
          injectRoot={this.props.injectRoot}
          injectDescriptors={this.state.cond}
          defaultValue={this.props.defaultImplications}
          floatingLabelText="Implications"
          onChange={this.handleImpl}
        />
      </div>
    </li>;
  }
});
