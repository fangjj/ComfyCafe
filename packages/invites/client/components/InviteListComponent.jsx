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
    if (this.data.invites.length) {
      return <ul className="list">
        {this.renderInvites()}
      </ul>;
    } else {
      return <Uhoh>
        You don't have any open invites.
      </Uhoh>;
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    if (! this.data.currentUser) {
      return <PowerlessComponent />;
    }

    return <div className="content">
      {this.renderInner()}
      <InviteFAB />
    </div>;
  }
});
