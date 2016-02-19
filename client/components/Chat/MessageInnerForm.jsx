let {
  TextField
} = mui;

MessageInnerForm = React.createClass({
  render() {
    return <div>
      <TextField
        hintText="Body"
        defaultValue={this.props.body}
        floatingLabelText="Body"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={4}
        onChange={this.props.handleBody}
        fullWidth={true}
        autoFocus={true}
      />
    </div>;
  }
});
