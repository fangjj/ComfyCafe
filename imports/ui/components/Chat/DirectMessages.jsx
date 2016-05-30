import React from "react";

import Topics from "/imports/api/topics/collection";
import "/imports/api/topics/methods";
import { isMember } from "/imports/api/common/persimmons";
import setTitle from "/imports/ui/utils/setTitle";
import MessageList from "./MessageList";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import DangerButton from "/imports/ui/components/Button/DangerButton";
import ButtonGroup from "/imports/ui/components/Button/ButtonGroup";
import ActionWell from "/imports/ui/components/ActionWell";
import Moment from "/imports/ui/components/Moment";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import Icon from "/imports/ui/components/Daikon/Icon";
import Err404 from "/imports/ui/components/Err404";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const handle = Meteor.subscribe("directMessageTopic", this.props.dmWith);
    return {
      loading: ! handle.ready(),
      topic: Topics.findOne(
        {
          relationship: Meteor.userId()
        }
      )
    };
  },
  updateTitle(n) {
    const body = this.props.dmWith;
    let pre = "";
    if (n) {
      pre = "(" + n + ") ";
    }
    setTitle(pre + body);
  },
  render() {
    if (this.data.loading) {
      return <DenseLoadingSpinner />;
    }

    if (! this.data.topic) {
      setTitle("Topic not found");
      return <Err404 />;
    }

    return <section className="msgList">
      <header>
        <div className="hotdog hide-on-med-and-up" onTouchTap={this.props.activateLeft}>
          <Icon>menu</Icon>
        </div>
        <h2>{this.props.dmWith}</h2>
      </header>
      <MessageList
        topic={this.data.topic}
        updateTitle={this.updateTitle}
        dmWith={this.props.dmWith}
      />
    </section>;
  }
});
