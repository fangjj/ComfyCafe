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
    Meteor.call("updateSettings", {
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
    FlowRouter.go(Session.get("previousPath"));
  },
  componentWillMount() {
    let obj = {};

    if (this.data.currentUser && _.has(this.data.currentUser, "settings")) {
      if (_.has(this.data.currentUser.settings, "defaultPage")) {
        obj.defaultPage = this.data.currentUser.settings.defaultPage;
      }

      if (_.has(this.data.currentUser.settings, "uploadAction")) {
        obj.uploadAction = this.data.currentUser.settings.uploadAction;
      }

      if (_.has(this.data.currentUser.settings, "nsfwNameGen")) {
        obj.nsfwNameGen = this.data.currentUser.settings.nsfwNameGen;
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
        <SubmitButton
          label="Save"
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
