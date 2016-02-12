let {
  Dialog,
  FlatButton,
  RaisedButton
} = mui;

PostDialog = React.createClass({
  getInitialState() {
    if (this.props.post) {
      return {
        visibility: this.props.post.visibility,
        description: this.props.post.description,
        tags: this.props.post.tags.text
      };
    } else {
      return {
        visibility: "public",
        description: "",
        tags: "tagme"
      };
    }
  },
  handleVisibility(event, index, value) {
    this.setState({visibility: value});
  },
  handleDescription(event) {
    this.setState({description: event.target.value});
  },
  handleTags(event) {
    this.setState({tags: event.target.value});
  },
  handleSubmit() {
    this.props.handleSubmit({
      visibility: this.state.visibility,
      description: this.state.description,
      tags: this.state.tags
    });
  },
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.props.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return <Dialog title="Edit Post" actions={actions} modal={true} open={this.props.open}>
      <PostInnerFormComponent
        visibility={this.state.visibility}
        handleVisibility={this.handleVisibility}
        description={this.state.description}
        handleDescription={this.handleDescription}
        tags={this.state.tags}
        handleTags={this.handleTags}
      />
    </Dialog>;
  }
});
