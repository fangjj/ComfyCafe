AccountActionsButton = React.createClass({
  toggleActionsVisbility(event) {
    if (event.button === 1) {
      // Middle mouse click
      var path = FlowRouter.path("profile", {username: this.props.currentUser.username});
      window.open(path);
    } else {
      event.preventDefault();
      event.stopPropagation();
      this.props.action();
    }
  },
  render() {
    return <a id="accountActionsToggle"
      className="ignore-react-onclickoutside waves-effect waves-teal"
      target="_blank"
      onClick={this.toggleActionsVisbility}
    >
      <ReactiveAvatarComponent
        class="topBar"
        id={this.props.currentUser._id}
        avatars={this.props.currentUser.avatars}
        title={this.props.currentUser.username}
      />
    </a>;
  }
});
