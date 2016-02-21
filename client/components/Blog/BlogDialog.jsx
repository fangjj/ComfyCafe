let {
  Dialog,
  FlatButton,
  RaisedButton
} = mui;

const defaultState = {
  visibility: "public",
  body: ""
};

BlogDialog = React.createClass({
  getInitialState() {
    if (this.props.post) {
      return {
        visibility: this.props.post.visibility,
        body: this.props.post.body
      };
    } else {
      return defaultState;
    }
  },
  handleVisibility(event, index, value) {
    this.setState({visibility: value});
  },
  handleBody(event) {
    this.setState({body: event.target.value});
  },
  handleSubmit() {
    this.props.handleSubmit({
      visibility: this.state.visibility,
      body: this.state.body
    });

    if (! this.props.post) {
      this.setState(defaultState);
    }
  },
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        labelStyle={{fontSize: "18px"}}
        secondary={true}
        onTouchTap={this.props.handleClose}
      />,
      <FlatButton
        label="Submit"
        labelStyle={{fontSize: "18px"}}
        primary={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return <Dialog
      className="postForm"
      title={this.props.title}
      actions={actions}
      modal={this.props.modal}
      open={this.props.open}
      autoScrollBodyContent={true}
      onRequestClose={this.props.handleClose}
    >
      <BlogInnerForm
        visibility={this.state.visibility}
        handleVisibility={this.handleVisibility}
        body={this.state.body}
        handleBody={this.handleBody}
      />
    </Dialog>;
  }
});
