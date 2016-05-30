import _ from "lodash";
import React from "react";

import "/imports/api/topics/methods";
import Messages from "/imports/api/messages/collection";
import statusInjector from "/imports/ui/utils/statusInjector";
import fancyCommaJoin from "/imports/api/common/fancyCommaJoin";
import MessageListItem from "./MessageListItem";
import MessageInlineForm from "./MessageInlineForm";
import EllipsisAnimation from "/imports/ui/components/EllipsisAnimation";
import InlineLoadingSpinner from "/imports/ui/components/Spinner/InlineLoadingSpinner";

export default React.createClass({
  mixins: [ReactMeteorData],
  contextTypes: { currentUser: React.PropTypes.object },
  getMeteorData() {
    const id = this.props.topic._id;
    const subName = (this.props.dmWith ? "directMessages" : "topicMessages");
    const handle = Meteor.subscribe(subName, id);
    const sort = (this.props.comments ? -1 : 1);
    return {
      loading: ! handle.ready(),
      messages: Messages.find(
        { "topic._id": id },
        { sort: { createdAt: sort } }
      ).fetch(),
      userStatuses: _.reduce(
        Meteor.users.find(
          {},
          { fields: { "status.online": 1, "status.idle": 1 } }
        ).fetch(),
        (result, v, k) => {
          result[v._id] = v.status;
          return result;
        },
        {}
      )
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
      this.setState({ initialCount });
    }

    const difference = Math.max(this.data.messages.length - initialCount, 0);
    this.setState({ difference });
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
    if (this.context.currentUser) {
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
        statusInjector(msg.owner, this.data.userStatuses || {});
        return <MessageListItem
          message={msg}
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
        if (! this.context.currentUser) {
          return true;
        }
        return x._id !== this.context.currentUser._id;
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
    if (this.context.currentUser) {
      return <li>
        <MessageInlineForm
          topic={this.props.topic}
          afterSubmit={this.decrementDifference}
          dmWith={this.props.dmWith}
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
