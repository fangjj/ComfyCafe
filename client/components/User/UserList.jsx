UserList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    let handle = Meteor.subscribe("users", this.props.userIds);
    return {
      loading: ! handle.ready(),
      users: Meteor.users.find(
  			{ _id: { $in: this.props.userIds } }
  		).fetch()
    };
  },
  renderUsers() {
    if (this.props.userIds && this.props.userIds.length) {
      return this.props.userIds.map((userId) => {
        const user = Meteor.users.findOne({ _id: userId });
        const userUrl = FlowRouter.path("profile", {username: user.username});
        return <li key={_.uniqueId()}>
          <a href={userUrl} style={{float: "left"}}>
            <AvatarComponent size="icon" user={user} />
          </a>
          <UserLink
            user={user}
          />
        </li>;
      });
    }
  },
  render() {
    if (this.data.loading) {
      return <InlineLoadingSpinner />;
    }

    const classes = classConcat("userList list", this.props.className);

    return <ul className={classes}>
      {this.renderUsers()}
    </ul>;
  }
});
