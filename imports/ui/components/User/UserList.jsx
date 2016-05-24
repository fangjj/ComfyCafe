import _ from "lodash";
import React from "react";

import classConcat from "/imports/ui/utils/classConcat";

import UserLink from "./UserLink";
import InlineLoadingSpinner from "/imports/ui/components/Spinner/InlineLoadingSpinner";
import Avatar from "/imports/ui/components/Avatar/Avatar";

export default React.createClass({
  renderUsers() {
    return this.props.users.map((user) => {
      const userUrl = FlowRouter.path("profile", { username: user.username });
      return <li key={user._id}>
        <a href={userUrl} style={{ float: "left" }}>
          <Avatar size="icon" user={user} />
        </a>
        <UserLink user={user} />
      </li>;
    });
  },
  render() {
    if (this.props.loading) {
      return <InlineLoadingSpinner />;
    }

    const classes = classConcat("userList list", this.props.className);

    return <ul className={classes}>
      {this.renderUsers()}
    </ul>;
  }
});
