import React from "react";

import Invites from "/imports/api/invites/collection";

import InviteComponent from "./InviteComponent";
import InviteFAB from "./InviteFAB";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import Powerless from "../Powerless";
import Uhoh from "../Uhoh";
import Content from "../Content";

export default React.createClass({
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
      return <Powerless />;
    }

    if (this.data.invites.length) {
      return <Content>
        {this.renderInner()}
        <InviteFAB />
      </Content>;
    } else {
      return <Uhoh>
        You don't have any open invites.
        <InviteFAB />
      </Uhoh>;
    }
  }
});
