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
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    if (! this.data.currentUser) {
      return <PowerlessComponent />;
    }

    if (this.data.invites.length) {
      return <div className="inviteList">
          <ul className="invites">
          {this.renderInvites()}
        </ul>
      </div>;
    } else {
      return <div className="inviteList">
        <div className="uhoh">
          You don't have any open invites.
        </div>
      </div>;
    }
  }
});
