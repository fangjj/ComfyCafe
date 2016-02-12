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
      Are you gay?
      <SwitchInputComponent
        name="dummy"
        off="Yes"
        on="Yes"
        checked={this.state.dummyChecked}
        onChange={this.handleDummy}
      />

      <div className="actions">
        <a className="cancel waves-effect waves-light btn grey darken-2" onClick={this.cancel}>
          <i className="material-icons left">cancel</i>
          Cancel
        </a>
        <a className="submit waves-effect waves-light btn" onClick={this.submit}>
          <i className="material-icons left">done</i>
          Submit
        </a>
      </div>
    </div>;
  }
});
