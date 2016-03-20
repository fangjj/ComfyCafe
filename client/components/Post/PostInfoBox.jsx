let {
  RaisedButton,
  FontIcon
} = mui;

const verbMap = {
  original: "created",
  derivative: "remixed",
  repost: "uploaded"
};

PostInfoBox = React.createClass({
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
  renderSource() {
    if (this.props.post.source) {
      return <TextBody text={"Source: " + this.props.post.source} className="source" />;
    }
  },
  render() {
    const post = this.props.post;

    const owner = post.owner;
    const ownerUrl = FlowRouter.path("profile", {username: owner.username});
    const isOwner = this.props.currentUser && this.props.currentUser._id === owner._id;

    let subButton;
    if (! isOwner) {
      subButton = <SubscriptionButton owner={owner} currentUser={this.props.currentUser} />;
    } else {
      subButton = <div>
        <SubtleDangerButton
          label="Delete"
          iconName="delete"
          onTouchTap={this.delete}
        />
        <SubmitButton
          label="Reroll"
          iconName="casino"
          onTouchTap={this.reroll}
        />
      </div>;
    }

    const verb = verbMap[post.originality];

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
                <OriginalityIcon originality={post.originality} />
                {verb} by <UserLink user={owner} /> <Moment time={post.createdAt} />
              </div>
              <div className="action">
                {subButton}
              </div>
            </div>
            <div className="privacy">
              <PrivacyIcon privacy={post.visibility} /> {_.capitalize(post.visibility)}
            </div>
            {this.renderSource()}
          </div>
        </div>
        <TextBody text={this.props.post.description} className="body" />
      </div>
    </section>;
  }
});
