import React from "react";

import UserListContainer from "/imports/ui/components/User/UserListContainer";

export default React.createClass({
  render() {
    return <section className="likes content">
      <header>
        <h4>Liked by</h4>
      </header>
      <UserListContainer id={this.props.id} userIds={this.props.likes} />
    </section>;
  }
});
