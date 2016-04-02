import _ from "lodash";
import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";

import UserLink from "./UserLink";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";
import Avatar from "../Avatar/Avatar";

const UserList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    let handle = Meteor.subscribe("users", this.props.userIds);
    return {
      loading: ! handle.ready(),
      users: Meteor.users.find(
  			{ _id: { $in: this.props.userIds } }
  		).fetch()
    };
  },
  renderUsers() {
    if (this.props.userIds && this.props.userIds.length) {
      return this.props.userIds.map((userId) => {
        const user = Meteor.users.findOne({ _id: userId });
        const userUrl = FlowRouter.path("profile", {username: user.username});
        return <li key={userId}>
          <a href={userUrl} style={{float: "left"}}>
            <Avatar size="icon" user={user} />
          </a>
          <UserLink
            user={user}
          />
        </li>;
      });
    }
  },
  render() {
    if (this.data.loading) {
      return <InlineLoadingSpinner />;
    }

    const classes = classConcat("userList list", this.props.className);

    return <ul className={classes}>
      {this.renderUsers()}
    </ul>;
  }
});

export default UserList;
