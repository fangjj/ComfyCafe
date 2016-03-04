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
      defaultPage: "art",
      uploadAction: "redirect",
      nsfwNameGen: false,
      autoWatch: false,
      patternSeed: "",
      preservePattern: false
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
  handleUploadAction(event, index, value) {
    this.setState({uploadAction: value})
  },
  handleNsfwNameGen(event) {
    this.setState({nsfwNameGen: event.target.checked})
  },
  handleAutoWatch(event) {
    this.setState({autoWatch: event.target.checked})
  },
  handlePatternSeed(event) {
    this.setState({patternSeed: event.target.value})
  },
  handlePreservePattern(event) {
    this.setState({preservePattern: event.target.checked})
  },
  submit(event) {
    var self = this;
    Meteor.call("updateSettings", {
      defaultPage: this.state.defaultPage,
      uploadAction: this.state.uploadAction,
      nsfwNameGen: this.state.nsfwNameGen,
      autoWatch: this.state.autoWatch,
      patternSeed: this.state.patternSeed,
      preservePattern: this.state.preservePattern
    }, () => {
	    this.setState({snackbarOpen: true});
    });
  },
  cancel(event) {
    goBack();
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

      if (_.has(this.data.currentUser.settings, "autoWatch")) {
        obj.autoWatch = this.data.currentUser.settings.autoWatch;
      }

      if (_.has(this.data.currentUser.settings, "patternSeed")) {
        obj.patternSeed = this.data.currentUser.settings.patternSeed;
      }

      if (_.has(this.data.currentUser.settings, "preservePattern")) {
        obj.preservePattern = this.data.currentUser.settings.preservePattern;
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

    return <div className="settings content">
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
      <Toggle
        label="Auto-watch topics you post in"
        defaultToggled={this.state.autoWatch}
        onToggle={this.handleAutoWatch}
      />

      <TextField
        defaultValue={this.state.patternSeed}
        floatingLabelText="Pattern Seed"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={1}
        onChange={this.handlePatternSeed}
        fullWidth={true}
      />

      <Toggle
        label="Preserve post patterns across navigation"
        defaultToggled={this.state.preservePattern}
        onToggle={this.handlePreservePattern}
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
