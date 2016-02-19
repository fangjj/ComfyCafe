let {
  TextField,
  SelectField,
  MenuItem,
  Toggle,
  RaisedButton,
  FontIcon,
  Snackbar
} = mui;

UserSettingsComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      currentUser: Meteor.user()
    };
  },
  getInitialState() {
    return {
      snackbarOpen: false,
      displayName: "",
      blurb: "",
      defaultPage: "art",
      uploadAction: "redirect",
      nsfwNameGen: false
    };
  },
  handleSnackbarRequestClose() {
    this.setState({
      snackbarOpen: false
    });
  },
  handleDisplayName(event) {
    this.setState({displayName: event.target.value})
  },
  handleBlurb(event) {
    this.setState({blurb: event.target.value})
  },
  handleDefaultPage(event, index, value) {
    this.setState({defaultPage: value})
  },
  handleUploadAction(event, index, value) {
    this.setState({uploadAction: value})
  },
  handleNsfwNameGen(event) {
    this.setState({nsfwNameGen: event.target.checked})
  },
  submit(event) {
    var self = this;
    Meteor.call("applySettings", {
      displayName: this.state.displayName,
      blurb: this.state.blurb,
      defaultPage: this.state.defaultPage,
      uploadAction: this.state.uploadAction,
      nsfwNameGen: this.state.nsfwNameGen
    }, () => {
	    this.setState({snackbarOpen: true});
    });
  },
  cancel(event) {
    // should go to last
    var path = FlowRouter.path("profile", {username: this.data.currentUser.username});
    FlowRouter.go(path);
  },
  componentWillMount() {
    let obj = {};

    if (this.data.currentUser && _.has(this.data.currentUser, "profile")) {
      if (_.has(this.data.currentUser.profile, "displayName")) {
        obj.displayName = this.data.currentUser.profile.displayName;
      }

      if (_.has(this.data.currentUser.profile, "blurb")) {
        obj.blurb = this.data.currentUser.profile.blurb;
      }

      if (_.has(this.data.currentUser.profile, "defaultPage")) {
        obj.defaultPage = this.data.currentUser.profile.defaultPage;
      }

      if (_.has(this.data.currentUser.profile, "uploadAction")) {
        obj.uploadAction = this.data.currentUser.profile.uploadAction;
      }

      if (_.has(this.data.currentUser.profile, "nsfwNameGen")) {
        obj.nsfwNameGen = this.data.currentUser.profile.nsfwNameGen;
      }

      this.setState(obj);
    }
  },
  render() {
    if (! this.data.currentUser) {
      return <PowerlessComponent />;
    }

    if (! _.has(this.data.currentUser, "profile")) {
      return <LoadingSpinnerComponent />;
    }

    return <div className="settings">
      <TextField
        hintText="Display Name"
        defaultValue={this.state.displayName}
        floatingLabelText="Display Name"
        floatingLabelStyle={{fontSize: "20px"}}
        onChange={this.handleDisplayName}
        fullWidth={true}
      />

      <TextField
        hintText="Blurb"
        defaultValue={this.state.blurb}
        floatingLabelText="Blurb"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={4}
        onChange={this.handleBlurb}
        fullWidth={true}
      />

      <SelectField
        value={this.state.defaultPage}
        onChange={this.handleDefaultPage}
        floatingLabelText="Default Page"
      >
        <MenuItem value="art" primaryText="Art" />
        <MenuItem value="blog" primaryText="Blog" />
      </SelectField>
      <br />
      <SelectField
        value={this.state.uploadAction}
        onChange={this.handleUploadAction}
        floatingLabelText="After creating a post..."
      >
        <MenuItem value="redirect" primaryText="Redirect to the post" />
        <MenuItem value="tab" primaryText="Open post in a new tab" />
        <MenuItem value="nothing" primaryText="Do nothing" />
      </SelectField>

      <Toggle
        label="Enable NSFW name generation"
        defaultToggled={this.state.nsfwNameGen}
        onToggle={this.handleNsfwNameGen}
      />
      <br />
      <div className="actions">
        <CancelButton
          onTouchTap={this.cancel}
        />
        <RaisedButton
          label="Submit"
          labelStyle={{fontSize: "18px"}}
          secondary={true}
          icon={<FontIcon className="material-icons">done</FontIcon>}
          onTouchTap={this.submit}
        />
      </div>

      <Snackbar
        className="snackbar"
        open={this.state.snackbarOpen}
        message="Settings saved successfully."
        autoHideDuration={4000}
        onRequestClose={this.handleSnackbarRequestClose}
        bodyStyle={{backgroundColor: "#237B4C"}}
      />
    </div>;
  }
});
