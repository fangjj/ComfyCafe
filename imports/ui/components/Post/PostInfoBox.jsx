import _ from "lodash";
import React from "react";

import "/imports/api/posts/methods";

import TextBody from "../TextBody";
import SubmitButton from "../SubmitButton";
import ToggleButton from "../ToggleButton";
import SubscriptionButton from "../SubscriptionButton";
import SubtleDangerButton from "../SubtleDangerButton";
import OriginalityIcon from "../OriginalityIcon";
import PrivacyIcon from "../PrivacyIcon";
import Moment from "../Moment";
import Avatar from "../Avatar/Avatar";
import UserLink from "../User/UserLink";

import {
  RaisedButton,
  FontIcon
} from "material-ui";

const verbMap = {
  original: "Created",
  derivative: "Remixed",
  repost: "Uploaded"
};

const PostInfoBox = React.createClass({
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
  bookmark() {
    const bookmarked = this.props.currentUser
      && _.includes(this.props.currentUser.bookmarks, this.props.post._id);
    Meteor.call("bookmarkPost", this.props.post._id, ! bookmarked);
  },
  renderButtons() {
    if (! this.props.currentUser) {
      return;
    }

    const cropButton = <SubmitButton
      label="Set Avatar"
      iconName="crop"
      onTouchTap={this.props.showAvatarCropper}
    />;
    const owner = this.props.post.owner;
    const isOwner = _.get(this.props, "currentUser._id") === owner._id;
    if (! isOwner) {
      const bookmarked = _.includes(
        _.get(this.props, "currentUser.bookmarks", []),
        this.props.post._id
      );
      return <div>
        <SubscriptionButton owner={owner} currentUser={this.props.currentUser} />
        <ToggleButton
          active={bookmarked}
          activate={this.bookmark}
          deactivate={this.bookmark}
          labelActivate="Bookmark"
          iconActivate="bookmark_outline"
          labelActivated="Bookmarked"
          iconActivated="bookmark"
          labelDeactivate="Unbookmark"
          iconDeactivate="bookmark_outline"
          width={174}
        />
        <br />
        {cropButton}
      </div>;
    } else {
      return <div>
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
        <br />
        {cropButton}
      </div>;
    }
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

    const verb = verbMap[post.originality];

    return <section className="infoBox content">
      <div className="flexColumn">
        <div className="flexLayout">
          <div className="leftSIde">
            <a href={ownerUrl}>
              <Avatar size="small" user={owner} />
            </a>
          </div>
          <div className="rightSide">
            <div className="top">
              <div className="genericCol">
                <div className="info">
                  <OriginalityIcon originality={post.originality} />
                  {verb} by <UserLink user={owner} /> <Moment time={post.createdAt} />
                </div>
                <div className="privacy">
                  <PrivacyIcon privacy={post.visibility} /> {_.capitalize(post.visibility)}
                </div>
                {this.renderSource()}
              </div>
              <div className="action">
                {this.renderButtons()}
              </div>
            </div>
          </div>
        </div>
        <TextBody text={this.props.post.description} className="body" />
      </div>
    </section>;
  }
});

export default PostInfoBox;
