let {
  TextField
} = mui;

MessageInnerForm = React.createClass({
  render() {
    let value = {};
    if (this.props.directValue) {
      value.value = this.props.body;
    } else {
      value.defaultValue = this.props.body;
    }
    return <div>
      <TextField
        {...value}
        hintText={generateMessageHint()}
        multiLine={true}
        rows={4}
        onChange={this.props.handleBody}
        fullWidth={true}
        autoFocus={true}
      />
    </div>;
  }
});