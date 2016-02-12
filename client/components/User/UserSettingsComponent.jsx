let {
  Toggle,
  RaisedButton,
  FontIcon
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
      dummyChecked: false
    };
  },
  handleDummy(event) {
    this.setState({dummyChecked: event.target.checked})
  },
  submit(event) {
    var self = this;
    Meteor.call("applySettings", {
      dummy: this.state.dummyChecked
    }, function () {
			var path = FlowRouter.path("profile", {username: self.data.currentUser.username});
      FlowRouter.go(path);
    });
  },
  cancel(event) {
    var path = FlowRouter.path("profile", {username: this.data.currentUser.username});
    FlowRouter.go(path);
  },
  componentWillMount() {
    if (_.has(this.data.currentUser.profile, "dummy")) {
      this.setState({
        dummyChecked: this.data.currentUser.profile.dummy
      });
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
      <Toggle
        label="Receive gay flirtation"
        defaultToggled={this.state.dummyChecked}
        onToggle={this.handleDummy}
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
    </div>;
  }
});
