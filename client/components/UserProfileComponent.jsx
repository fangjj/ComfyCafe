UserProfileComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("user", FlowRouter.getParam("username"));
    return {
      loading: ! handle.ready(),
      user: Meteor.users.findOne({ username: FlowRouter.getParam("username") }),
      currentUser: Meteor.user()
    };
  },
  getInitialState() {
    return {
      isChangingAvatar: false
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinnerComponent />;
    }

    var user = this.data.user;
    var isOwner = this.data.currentUser && this.data.currentUser._id === user._id;

    var toolbox;
    if (! isOwner) {
      toolbox = <div className="toolbox">
        <SubscriptionButton owner={user} currentUser={this.data.currentUser} />
      </div>;
    } else {
      var hasAvatar = _.has(user, "avatar");

      var deleteButton;
      if (hasAvatar) {
        deleteButton = <a className="deleteAvatar waves-effect waves-light btn red darken-3">
          <i className="material-icons left">delete</i>
          Delete Avatar
        </a>;
      }

      toolbox = <div className="toolbox">
        <a className="toggleChangeAvatar waves-effect waves-light btn">
          <i className="material-icons left">image</i>
          Change Avatar
        </a>
        {deleteButton}
      </div>;
    }

    var content;
    if (! this.state.isChangingAvatar) {
      content = <div className="content">
        <ReactiveAvatarComponent class="large"
          id={user._id} avatars={user.avatars} title={user.username}
        />
        {toolbox}
      </div>;
    } else {
      content = <div className="content">
        <AvatarCropperComponent />
      </div>;
    }

    return <article>
      <header>
  			<h2>{user.username}</h2>
  		</header>
			{content}
    </article>;
  }
});
