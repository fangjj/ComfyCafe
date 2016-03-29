import React from "react";

InviteListComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("invites");
    return {
      loading: ! handle.ready(),
      invites: Invites.find().fetch(),
      currentUser: Meteor.user()
    };
  },
  renderInvites() {
    return this.data.invites.map((invite) => {
      return <InviteComponent invite={invite} key={invite._id} />;
    });
  },
  renderInner() {
    return <ul className="list">
      {this.renderInvites()}
    </ul>;
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinner />;
    }

    if (! this.data.currentUser) {
      return <PowerlessComponent />;
    }

    if (this.data.invites.length) {
      return <div className="content">
        {this.renderInner()}
        <InviteFAB />
      </div>;
    } else {
      return <Uhoh>
        You don't have any open invites.
        <InviteFAB />
      </Uhoh>;
    }
  }
});
