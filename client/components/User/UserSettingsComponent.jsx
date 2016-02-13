let {
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
      defaultPage: "art",
      nsfwNameGen: false
    };
  },
  handleSnackbarRequestClose() {
    this.setState({
      snackbarOpen: false
    });
  },
  handleDefaultPage(event, index, value) {
    this.setState({defaultPage: value})
  },
  handleNsfwNameGen(event) {
    this.setState({nsfwNameGen: event.target.checked})
  },
  submit(event) {
    var self = this;
    Meteor.call("applySettings", {
      defaultPage: this.state.defaultPage,
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
      if (_.has(this.data.currentUser.profile, "defaultPage")) {
        obj.defaultPage = this.data.currentUser.profile.defaultPage;
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
      <SelectField
        value={this.state.defaultPage}
        onChange={this.handleDefaultPage}
        floatingLabelText="Default Page"
      >
        <MenuItem value="art" primaryText="Art" />
        <MenuItem value="blog" primaryText="Blog" />
      </SelectField>

      <Toggle
        label="Enable NSFW name generation"
        defaultToggled={this.state.nsfwNameGen}
        onToggle={this.handleNsfwNameGen}
      />

      <div className="actions">
        <CancelButton
          onTouchTap={this.cancel}
        />
        <RaisedButton
          label="Submit"
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
        bodyStyle={{backgroundColor: "#ABEDAE"}}
      />
    </div>;
  }
});
