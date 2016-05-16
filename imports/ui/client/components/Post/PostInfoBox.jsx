import _ from "lodash";
import React from "react";

import "/imports/api/posts/methods";
import goBack from "/imports/ui/client/utils/goBack";
import setPattern from "/imports/ui/client/utils/setPattern";
import safetyLabels from "/imports/api/common/safetyLabels";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import CancelButton from "/imports/ui/client/components/Button/CancelButton";
import ToggleButton from "/imports/ui/client/components/Button/ToggleButton";
import SubscriptionButton from "/imports/ui/client/components/Button/SubscriptionButton";
import ReportButton from "/imports/ui/client/components/Button/ReportButton";
import DangerButton from "/imports/ui/client/components/Button/DangerButton";
import ButtonGroup from "/imports/ui/client/components/Button/ButtonGroup";
import ActionWell from "/imports/ui/client/components/ActionWell";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import TextBody from "/imports/ui/client/components/TextBody";
import FlexHead from "/imports/ui/client/components/FlexHead";

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
  showAlbumSelector() {
    const $albumBtn = $("#albumBtn");
    const offset = $albumBtn.offset();
    this.props.showAlbumSelector({
      left: offset.left,
      top: offset.top + $albumBtn.height()
    });
  },
  renderButtons() {
    if (! this.props.currentUser) {
      return;
    }

    const albumButton = <SubmitButton
      id="albumBtn"
      label="Add to Album"
      iconName="collections"
      onTouchTap={this.showAlbumSelector}
    />;

    let cropButton = <SubmitButton
      label="Set Avatar"
      iconName="crop"
      onTouchTap={this.props.showAvatarCropper}
    />;
    if (this.props.isCropping) {
      cropButton = <CancelButton width={149} onTouchTap={this.props.hideAvatarCropper} />;
    }

    const rightGroup = <ButtonGroup>
      {albumButton}
      {cropButton}
    </ButtonGroup>;

    const owner = this.props.post.owner;
    const isOwner = _.get(this.props, "currentUser._id") === owner._id;
    if (! isOwner) {
      return <ActionWell>
        <ButtonGroup>
          <SubscriptionButton owner={owner} currentUser={this.props.currentUser} />
          <ReportButton onTouchTap={this.props.showReportForm} />
        </ButtonGroup>
        {rightGroup}
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
        {rightGroup}
      </ActionWell>;
    }
  },
  renderInfo() {
    let source;
    if (this.props.post.source) {
      source = <div>
        <Icon className="sigil">copyright</Icon> <TextBody
          text={"Source: " + this.props.post.source} className="source"
        />
      </div>;
    }

    return <div>
      <div>
        <Icon className="sigil">flash_on</Icon> {safetyLabels[this.props.post.safety]}
      </div>
      {source}
    </div>;
  },
  render() {
    return <FlexHead
      className="content"
      item={this.props.post}
      verb={verbMap[this.props.post.originality]}
      renderInfo={this.renderInfo}
      renderButtons={this.renderButtons}
      body={this.props.post.description}
      section={true}
    />;
  }
});
