UserLink = React.createClass({
  getInitialState() {
    return {
      open: false
    }
  },
  handleTouchTap(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  },
  handleRequestClose() {
    this.setState({
      open: false
    });
  },
  render() {
    var user = this.props.user;
    var path = FlowRouter.path("profile", {username: user.username});
    return <div style={{display: "inline"}}>
      <a
        href={path}
        onMouseEnter={this.handleTouchTap}
        onMouseLeave={this.handleRequestClose}
      >
        {user.profile.displayName || user.username}
      </a>
      <UserPopover
        user={this.props.user}
        open={this.state.open}
        anchorEl={this.state.anchorEl}
        onRequestClose={this.handleRequestClose}
      />
    </div>;
  }
});
