PostInfoBoxComponent = React.createClass({
  delete() {
    Meteor.call("deletePost", this.props.post._id, function () {
      FlowRouter.go("/");
    });
  },
  renderDescription() {
    var para = this.props.post.description.split("\n").map((line) => {
      return <p>{line}</p>;
    });
    return <div className="description">
      {para}
    </div>;
  },
  render() {
    var post = this.props.post;

    var owner = post.uploader;
    var ownerUrl = FlowRouter.path("profile", {username: owner.username});
    var isOwner = this.props.currentUser && this.props.currentUser._id === owner._id;

    var isoDate = moment(post.createdAt).toISOString();
    var prettyDate = moment(post.createdAt).fromNow();

    var subButton;
    if (! isOwner) {
      subButton = <SubscriptionButton owner={owner} currentUser={this.props.currentUser} />;
    } else {
      subButton = <SublteDangerButton
        label="Delete Post"
        iconName="delete"
        onTouchTap={this.delete}
      />;
    }

    return <section className="infoBox">
      <div className="meta">
        <a href={ownerUrl}>
          <AvatarComponent class="small" id={owner._id} profile={owner.profile} title={owner.username} />
        </a>
        <div className="info">
          by <a href={ownerUrl}>{owner.username}</a> <time dateTime={isoDate}>{prettyDate}</time>
          <br />
          <div className="action">
            {subButton}
          </div>
        </div>
      </div>
      {this.renderDescription()}
    </section>;
  }
});
