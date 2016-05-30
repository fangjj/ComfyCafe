import React from "react";

import classConcat from "/imports/ui/utils/classConcat";
import Room from "/imports/ui/components/Chat/Room";
import Topic from "/imports/ui/components/Chat/Topic";
import TopicList from "/imports/ui/components/Chat/TopicList";
import DirectMessages from "/imports/ui/components/Chat/DirectMessages";
import DenseLayout from "/imports/ui/components/DenseLayout";
import DenseCol from "/imports/ui/components/DenseCol";

export default React.createClass({
  getInitialState() {
    return { activeLeft: false };
  },
  activateLeft() {
    this.setState({ activeLeft: true });
  },
  deactivateLeft() {
    this.setState({ activeLeft: false });
  },
  renderMain() {
    if (this.props.dmList) {
      return <div />;
    } else if (this.props.dmWith) {
      return <DirectMessages dmWith={this.props.dmWith} />;
    } else if (FlowRouter.getParam("topicSlug")) {
      return <Topic activateLeft={this.activateLeft} />;
    } else {
      return <Room activateLeft={this.activateLeft} />;
    }
  },
  render() {
    const leftClasses = classConcat("leftCol", this.state.activeLeft ? "active" : null);
    return <DenseLayout>
      <DenseCol className={leftClasses}>
        <TopicList
          dm={this.props.dmList || this.props.dmWith}
          deactivateLeft={this.deactivateLeft}
        />
      </DenseCol>

      <div className="col mainCol">
        {this.renderMain()}
      </div>
    </DenseLayout>;
  }
});
