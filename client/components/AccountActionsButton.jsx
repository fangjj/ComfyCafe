AccountActionsButton = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      currentUser: Meteor.user()
    };
  },
  toggleActionsVisbility(event) {
    if (event.button === 1) {
      // Middle mouse click
      var path = FlowRouter.path("profile", {username: this.data.currentUser.username});
      window.open(path);
    } else {
      event.preventDefault();
      event.stopPropagation();
      this.props.action();
    }
  },
  render() {
    return <a id="accountActionsToggle" className="waves-effect waves-teal" onClick={this.toggleActionsVisbility}>
      <ReactiveAvatarComponent
        class="topBar"
        id={this.data.currentUser._id}
        avatars={this.data.currentUser.avatars}
        title={this.data.currentUser.username}
      />
    </a>;
  }
});
