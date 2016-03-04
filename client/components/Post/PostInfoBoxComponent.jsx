let {
  RaisedButton,
  FontIcon
} = mui;

PostInfoBoxComponent = React.createClass({
  reroll() {
    Meteor.call("rerollPost", this.props.post._id, (err, name) => {
      const path = FlowRouter.path("post", {
        username: this.props.currentUser.username,
        postName: name
      });
      FlowRouter.go(path);
    });
  },
  delete() {
    Meteor.call("deletePost", this.props.post._id, function () {
      goBack();
    });
  },
  render() {
    var post = this.props.post;

    var owner = post.owner;
    var ownerUrl = FlowRouter.path("profile", {username: owner.username});
    var isOwner = this.props.currentUser && this.props.currentUser._id === owner._id;

    var subButton;
    if (! isOwner) {
      subButton = <SubscriptionButton owner={owner} currentUser={this.props.currentUser} />;
    } else {
      subButton = <div>
        <SubmitButton
          label="Reroll"
          iconName="casino"
          onTouchTap={this.reroll}
        />
        <SubtleDangerButton
          label="Delete"
          iconName="delete"
          onTouchTap={this.delete}
        />
      </div>;
    }

    let verb = "uploaded";
    if (post.original) {
      verb = "created";
    }

    return <section className="infoBox content">
      <div className="flexColumn">
        <div className="flexLayout">
          <div className="leftSIde">
            <a href={ownerUrl}>
              <AvatarComponent size="small" user={owner} />
            </a>
          </div>
          <div className="rightSide">
            <div className="top">
              <div className="info">
                {verb} by <UserLink user={owner} /> <Moment time={post.createdAt} />
              </div>
              {/*this.renderMoreMenu()*/}
            </div>
            <div className="action">
              {subButton}
            </div>
          </div>
        </div>
        <TextBody text={this.props.post.description} className="body" />
      </div>
    </section>;
  }
});
