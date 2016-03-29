import React from "react";

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
    return <div className="userLink" style={{display: "inline"}}>
      <a href={path} title={user.profile.blurb}>
        {user.profile.displayName || user.username}
      </a>
    </div>;
  }
});
