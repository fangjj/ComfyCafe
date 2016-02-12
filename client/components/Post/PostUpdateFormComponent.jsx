let {
  Dialog,
  FlatButton,
  RaisedButton,
  TextField,
  SelectField,
  MenuItem
} = mui;

PostUpdateFormComponent = React.createClass({
  getInitialState() {
    return {
      visibility: this.props.post.visibility,
      description: this.props.post.description,
      tags: this.props.post.tags.text
    };
  },
  handleOpen() {
    this.setState({open: true});
  },
  handleClose() {
    this.setState({open: false});
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
    Meteor.call("updatePost", this.props.post._id, {
      visibility: this.state.visibility,
      description: this.state.description,
      tags: this.state.tags
    }, (err) => {
      this.props.close();
    });
  },
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return <Dialog title="Edit Post" actions={actions} modal={true} open={this.props.open}>
      <form>
        <div>
          <SelectField value={this.state.visibility} onChange={this.handleVisibility}>
            <MenuItem value="public" primaryText="Public" />
            <MenuItem value="friends" primaryText="Friends" />
            <MenuItem value="unlisted" primaryText="Unlisted" />
          </SelectField>
        </div>
        <br />
        <TextField
          hintText="Description"
          defaultValue={this.state.description}
          floatingLabelText="Description"
          multiline={true}
          rows={4}
          onChange={this.handleDescription}
        />
        <br />
        <TextField
          hintText="Tags"
          defaultValue={this.state.tags}
          floatingLabelText="Tags"
          multiline={true}
          rows={4}
          onChange={this.handleTags}
        />
      </form>
    </Dialog>;
  }
});
