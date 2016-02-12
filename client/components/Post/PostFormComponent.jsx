let {
  Dialog,
  FlatButton,
  RaisedButton,
  TextField,
  SelectField,
  MenuItem
} = mui;

PostFormComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.withoutBar.subscribe("media", Meteor.userId());
    return {
      loading: ! handle.ready(),
      medium: media.findOne({ _id: new Mongo.ObjectID(this.props.mediumId) }),
      currentUser: Meteor.user()
    };
  },
  getInitialState() {
    return {
      open: true,
      visibility: "public",
      description: "",
      tags: "tagme"
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
    Meteor.call("addPost", {
      mediumId: this.props.mediumId,
      visibility: this.state.visibility,
      description: this.state.description,
      tags: this.state.tags
    }, (err, name) => {
      this.props.destroy();
      var path = FlowRouter.path("post", {
        username: this.data.currentUser.username,
        postName: name
      });
      FlowRouter.go(path);
    });
  },
  render() {
    if (this.data.loading) {
      return <RainbowSpinnerComponent />;
    }

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

    return <Dialog title="Create Post" actions={actions} modal={true} open={this.state.open}>
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
          floatingLabelText="Description"
          multiline={true}
          rows={4}
          onChange={this.handleDescription}
        />
        <br />
        <TextField
          hintText="Tags"
          defaultValue="tagme"
          floatingLabelText="Tags"
          multiline={true}
          rows={4}
          onChange={this.handleTags}
        />
      </form>
    </Dialog>;
  }
});
