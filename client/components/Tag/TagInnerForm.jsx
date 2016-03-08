let {
  TextField
} = mui;

TagInnerForm = React.createClass({
  render() {
    return <div>
      <TextField
        defaultValue={this.props.name}
        floatingLabelText="Name"
        floatingLabelStyle={{fontSize: "20px"}}
        onChange={this.props.handleName}
        fullWidth={true}
      />
      <br />
      <TextField
        defaultValue={this.props.definition}
        floatingLabelText="Definition"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={3}
        rowsMax={10}
        onChange={this.props.handleDefinition}
        fullWidth={true}
      />
  </div>;
  }
});
