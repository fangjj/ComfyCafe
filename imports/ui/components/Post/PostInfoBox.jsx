import _ from "lodash";
import React from "react";

import "/imports/api/posts/methods";
import goBack from "/imports/ui/utils/goBack";
import setPattern from "/imports/ui/utils/setPattern";
import originalMap from "/imports/ui/utils/originalMap";
import safetyLabels from "/imports/api/common/safetyLabels";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import CancelButton from "/imports/ui/components/Button/CancelButton";
import ToggleButton from "/imports/ui/components/Button/ToggleButton";
import SubscriptionButton from "/imports/ui/components/Button/SubscriptionButton";
import ReportButton from "/imports/ui/components/Button/ReportButton";
import DangerButton from "/imports/ui/components/Button/DangerButton";
import ButtonGroup from "/imports/ui/components/Button/ButtonGroup";
import ActionWell from "/imports/ui/components/ActionWell";
import Icon from "/imports/ui/components/Daikon/Icon";
import TextBody from "/imports/ui/components/TextBody";
import FlexHead from "/imports/ui/components/FlexHead";

const verbMap = {
  original: "Created",
  repost: "Uploaded"
};

export default React.createClass({
  reroll() {
    Meteor.call("rerollPost", this.props.post._id, (err, name) => {
      setPattern(name);
      const path = FlowRouter.path("post", { name });
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
      onClick={this.props.showAvatarCropper}
    />;
    if (this.props.isCropping) {
      cropButton = <CancelButton width={149} onClick={this.props.hideAvatarCropper} />;
    }

    const rightGroup = <ButtonGroup>
      {cropButton}
    </ButtonGroup>;

    const owner = this.props.post.owner;
    const isOwner = _.get(this.props, "currentUser._id") === owner._id;
    if (! isOwner) {
      return <ActionWell>
        <ButtonGroup>
          <SubscriptionButton owner={owner} currentUser={this.props.currentUser} />
          <ReportButton onClick={this.props.showReportForm} />
        </ButtonGroup>
        {rightGroup}
      </ActionWell>;
    } else {
      return <ActionWell>
        <ButtonGroup>
          <SubmitButton
            label="Reroll"
            iconName="casino"
            onClick={this.reroll}
          />
          <DangerButton
            label="Delete"
            iconName="delete"
            subtle={true}
            onClick={this.delete}
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
      itemType="image"
      verb={verbMap[originalMap(this.props.post.original)]}
      renderInfo={this.renderInfo}
      renderButtons={this.renderButtons}
      body={this.props.post.description}
      section={true}
    />;
  }
});
