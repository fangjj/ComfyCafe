let {
  TextField,
  SelectField,
  MenuItem,
  Toggle,
  RaisedButton,
  FontIcon,
  Snackbar
} = mui;

UserProfileForm = React.createClass({
  getInitialState() {
    return {
      snackbarOpen: false,
      displayName: "",
      blurb: ""
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
  submit(event) {
    var self = this;
    Meteor.call("updateProfile", {
      displayName: this.state.displayName,
      blurb: this.state.blurb
    }, () => {
	    this.setState({snackbarOpen: true});
    });
  },
  cancel(event) {
    var path = FlowRouter.path("profile", {username: this.props.currentUser.username});
    FlowRouter.go(path);
  },
  componentWillMount() {
    let obj = {};

    if (this.props.currentUser && _.has(this.props.currentUser, "profile")) {
      if (_.has(this.props.currentUser.profile, "displayName")) {
        obj.displayName = this.props.currentUser.profile.displayName;
      }

      if (_.has(this.props.currentUser.profile, "blurb")) {
        obj.blurb = this.props.currentUser.profile.blurb;
      }

      this.setState(obj);
    }
  },
  render() {
    if (! this.props.currentUser) {
      return <PowerlessComponent />;
    }

    if (! _.has(this.props.currentUser, "profile")) {
      return <LoadingSpinnerComponent />;
    }

    return <div>
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
        message="Profile saved successfully."
        autoHideDuration={4000}
        onRequestClose={this.handleSnackbarRequestClose}
        bodyStyle={{backgroundColor: "#237B4C"}}
      />
    </div>;
  }
});
