AccountActionsButton = React.createClass({
  render() {
    var profileUrl = FlowRouter.path("profile", {username: Meteor.user().username});
    return <a id="accountActionsToggle" className="waves-effect waves-teal" href={profileUrl}>
      <ReactiveAvatarComponent
        class="topBar"
        id={Meteor.userId()}
        avatars={Meteor.user().avatars}
        title={Meteor.user().username}
      />
    </a>;
  }
});
