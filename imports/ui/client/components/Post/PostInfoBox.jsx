import _ from "lodash";
import React from "react";

import "/imports/api/posts/methods";
import goBack from "/imports/ui/client/utils/goBack";
import TextBody from "/imports/ui/client/components/TextBody";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import CancelButton from "/imports/ui/client/components/Button/CancelButton";
import ToggleButton from "/imports/ui/client/components/Button/ToggleButton";
import BookmarkButton from "/imports/ui/client/components/Button/BookmarkButton";
import SubscriptionButton from "/imports/ui/client/components/Button/SubscriptionButton";
import DangerButton from "/imports/ui/client/components/Button/DangerButton";
import ButtonGroup from "/imports/ui/client/components/Button/ButtonGroup";
import OriginalityIcon from "/imports/ui/client/components/Daikon/OriginalityIcon";
import PrivacyIcon from "/imports/ui/client/components/Daikon/PrivacyIcon";
import ActionWell from "/imports/ui/client/components/ActionWell";
import Moment from "/imports/ui/client/components/Moment";
import Avatar from "/imports/ui/client/components/Avatar/Avatar";
import UserLink from "/imports/ui/client/components/User/UserLink";
import setPattern from "/imports/ui/client/utils/setPattern";

const verbMap = {
  original: "Created",
  derivative: "Derived",
  repost: "Uploaded"
};

export default React.createClass({
  reroll() {
    Meteor.call("rerollPost", this.props.post._id, (err, name) => {
      setPattern(name);
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
  renderButtons() {
    if (! this.props.currentUser) {
      return;
    }

    let cropButton = <SubmitButton
      label="Set Avatar"
      iconName="crop"
      onTouchTap={this.props.showAvatarCropper}
    />;
    if (this.props.isCropping) {
      cropButton = <CancelButton onTouchTap={this.props.hideAvatarCropper} />;
    }

    const owner = this.props.post.owner;
    const isOwner = _.get(this.props, "currentUser._id") === owner._id;
    if (! isOwner) {
      return <ActionWell>
        <ButtonGroup>
          <BookmarkButton post={this.props.post} currentUser={this.props.currentUser} />
          <SubscriptionButton owner={owner} currentUser={this.props.currentUser} />
        </ButtonGroup>
        <ButtonGroup>
          {cropButton}
        </ButtonGroup>
      </ActionWell>;
    } else {
      return <ActionWell>
        <ButtonGroup>
          <SubmitButton
            label="Reroll"
            iconName="casino"
            onTouchTap={this.reroll}
          />
          <DangerButton
            label="Delete"
            iconName="delete"
            subtle={true}
            onTouchTap={this.delete}
          />
        </ButtonGroup>
        <ButtonGroup>
          {cropButton}
        </ButtonGroup>
      </ActionWell>;
    }
  },
  renderSource() {
    if (this.props.post.source) {
      return <TextBody text={"Source: " + this.props.post.source} className="source" />;
    }
  },
  renderDescription() {
    if (this.props.post.description) {
      return <TextBody text={this.props.post.description} className="body" />;
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
          <div className="leftSide">
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
            </div>
          </div>
        </div>
        {this.renderButtons()}
        {this.renderDescription()}
      </div>
    </section>;
  }
});
