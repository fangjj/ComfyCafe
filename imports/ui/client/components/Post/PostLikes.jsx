import React from "react";

import UserList from "/imports/ui/client/components/User/UserList";

export default React.createClass({
  render() {
    return <section className="likes content">
      <header>
        <h4>Liked by</h4>
      </header>
      <UserList userIds={this.props.likes} />
    </section>;
  }
});
