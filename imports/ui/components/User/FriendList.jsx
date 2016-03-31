import React from "react";

import UserList from "./UserList";

const FriendList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      currentUser: Meteor.user()
    };
  },
  render() {
    return <div className="content">
      <header>
        <h2>Friends</h2>
      </header>
      <UserList userIds={this.data.currentUser.friends || []} />
    </div>;
  }
});

export default FriendList;
