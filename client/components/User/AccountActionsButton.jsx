AccountActionsButton = React.createClass({
  toggleActionsVisbility(event) {
    if (event.button === 1) {
      // Middle mouse click
    } else {
      event.nativeEvent.preventDefault();
      event.nativeEvent.stopPropagation();
      this.props.action();
    }
  },
  render() {
    return <a id="accountActionsToggle"
      className="ignore-react-onclickoutside waves-effect waves-teal"
      href={FlowRouter.path("profile", {username: this.props.currentUser.username})}
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
