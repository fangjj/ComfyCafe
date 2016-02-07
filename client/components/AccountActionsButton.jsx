AccountActionsButton = React.createClass({
  toggleActionsVisbility(event) {
    if (event.button === 1) {
      // Middle mouse click
      var path = FlowRouter.path("profile", {username: Meteor.user().username});
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
        id={Meteor.userId()}
        avatars={Meteor.user().avatars}
        title={Meteor.user().username}
      />
    </a>;
  }
});
