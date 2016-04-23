import _ from "lodash";
import React from "react";

import "/imports/api/topics/methods";
import Messages from "/imports/api/messages/collection";
import fancyCommaJoin from "/imports/api/common/fancyCommaJoin";
import MessageListItem from "./MessageListItem";
import MessageInlineForm from "./MessageInlineForm";
import EllipsisAnimation from "/imports/ui/client/components/EllipsisAnimation";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";

const MessageList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const id = this.props.topic._id;
    let handle = Meteor.subscribe("topicMessages", id);
    let sort = 1;
    if (this.props.comments) {
      sort = -1;
    }
    return {
      loading: ! handle.ready(),
      messages: Messages.find(
        { "topic._id": id },
        { sort: { createdAt: sort } }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },
  getInitialState() {
    return {
      initialCount: 0,
      difference: 0
    };
  },
  componentWillReceiveProps() {
    let initialCount = this.state.initialCount;
    if (initialCount === 0) {
      initialCount = this.data.messages.length;
      this.setState({
        initialCount: initialCount
      });
    }

    const difference = Math.max(this.data.messages.length - initialCount, 0);
    this.setState({
      difference: difference
    });
  },
  decrementDifference() {
    this.setState({
      initialCount: this.state.initialCount + 1,
      difference: this.state.difference - 1
    });
  },
  clearDifference() {
    if (this.state.difference) {
      this.setState({
        initialCount: this.data.messages.length,
        difference: 0
      });
    }

    // Clear notifications
    if (this.data.currentUser) {
      Meteor.call("viewTopic", this.props.topic._id);
    }
  },
  componentDidMount() {
    window.addEventListener("focus", this.clearDifference);
  },
  componentWillUnmount() {
    window.removeEventListener("focus", this.clearDifference);
  },
  renderMsg() {
    if (this.data.messages.length) {
      return this.data.messages.map((msg) => {
        return <MessageListItem
          message={msg}
          currentUser={this.props.currentUser}
          key={msg._id}
          onVisible={this.decrementDifference}
        />;
      });
    }
    if (! this.props.comments) {
      return <li>No messages.</li>;
    } else {
      return <li>No comments.</li>;
    }
  },
  renderTyping() {
    if (this.props.topic.typing) {
      var typing = _.filter(this.props.topic.typing, (x) => {
        if (! this.props.currentUser) {
          return true;
        }
        return x._id !== this.props.currentUser._id;
      });
      if (typing.length) {
        let verb = "is";
        if (typing.length > 1) {
          verb = "are";
        }
        return <li>
          {fancyCommaJoin(typing, (x) => {
            return x.profile.displayName || x.username;
          })} {verb} typing<EllipsisAnimation />
        </li>;
      }
    }
  },
  renderInput() {
    if (this.props.currentUser) {
      return <li>
        <MessageInlineForm
          topic={this.props.topic}
          afterSubmit={this.decrementDifference}
        />
      </li>;
    }
  },
  renderInputTop() {
    if (this.props.comments) {
      return this.renderInput();
    }
  },
  renderInputBottom() {
    if (! this.props.comments) {
      return this.renderInput();
    }
  },
  render() {
    if (this.data.loading) {
      return <InlineLoadingSpinner />;
    }

    this.props.updateTitle(this.state.difference);

    return <ol className="list">
      {this.renderInputTop()}
      {this.renderMsg()}
      {this.renderTyping()}
      {this.renderInputBottom()}
    </ol>;
  }
});

export default MessageList;
