AccountActionsButton = React.createClass({
  toggleActionsVisbility(event) {
    if (event.which === 2) {
      // Middle mouse click
    } else {
      event.preventDefault();
      event.stopPropagation();
      this.props.action();
    }
  },
  render() {
    return <NativeListener onClick={this.toggleActionsVisbility}>
      <a id="accountActionsToggle"
        className="ignore-react-onclickoutside waves-effect waves-teal"
        href={FlowRouter.path("profile", {username: this.props.currentUser.username})}
      >
        <ReactiveAvatarComponent
          class="topBar"
          id={this.props.currentUser._id}
          avatars={this.props.currentUser.avatars}
          title={this.props.currentUser.username}
        />
      </a>
    </NativeListener>;
  }
});
