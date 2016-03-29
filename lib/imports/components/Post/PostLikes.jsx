import React from "react";

import UserList from "../User/UserList";

const PostLikes = React.createClass({
  render() {
    return <section className="likes content">
      <header>
        <h4>Liked by</h4>
      </header>
      <UserList userIds={this.props.likes} />
    </section>;
  }
});

export default PostLikes;
