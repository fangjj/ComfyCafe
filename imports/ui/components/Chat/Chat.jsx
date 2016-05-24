import React from "react";

import classConcat from "/imports/ui/utils/classConcat";
import Room from "./Room";
import Topic from "./Topic";
import TopicList from "./TopicList";
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
    if (FlowRouter.getParam("topicSlug")) {
      return <Topic activateLeft={this.activateLeft} />;
    }
    return <Room activateLeft={this.activateLeft} />;
  },
  render() {
    const leftClasses = classConcat("leftCol", this.state.activeLeft ? "active" : null);
    return <DenseLayout>
      <DenseCol className={leftClasses}>
        <TopicList deactivateLeft={this.deactivateLeft} />
      </DenseCol>

      <div className="col mainCol">
        {this.renderMain()}
      </div>
    </DenseLayout>;
  }
});
