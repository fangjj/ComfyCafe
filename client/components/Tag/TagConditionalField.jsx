let {
  TextField
} = mui;

TagConditionalField = React.createClass({
  getInitialState() {
    return {
      cond: "",
      impl: this.props.defaultImplications || ""
    };
  },
  componentWillMount() {
    this.id = _.uniqueId();
  },
  handleCond(e) {
    this.setState({
      cond: e.target.value
    });
    this.props.onChange(this.id, e.target.value, this.state.impl);
  },
  handleImpl(value) {
    this.setState({
      impl: value
    });
    this.props.onChange(this.id, this.state.cond, value);
  },
  render() {
    return <li>
      <TextField
        floatingLabelText="Condition"
        floatingLabelStyle={{fontSize: "20px"}}
        onChange={this.handleCond}
      />
      <TagField
        defaultValue={this.props.defaultImplications}
        floatingLabelText="Implications"
        onChange={this.handleImpl}
      />
    </li>;
  }
});
