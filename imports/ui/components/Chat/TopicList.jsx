import React from "react";

import Topics from "/imports/api/topics/collection";
import Rooms from "/imports/api/rooms/collection";
import TopicButton from "/imports/ui/components/Chat/TopicButton";
import TopicListItem from "/imports/ui/components/Chat/TopicListItem";
import List from "/imports/ui/components/List";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import Icon from "/imports/ui/components/Daikon/Icon";
import TextField from "/imports/ui/components/TextField";

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return { search: null };
  },
  getMeteorData() {
    if (! this.props.dm) {
      const roomSlug = FlowRouter.getParam("roomSlug");
      const handleRoom = Meteor.subscribe("room", roomSlug);
      const handleTopics = Meteor.subscribe("roomTopics", roomSlug);

      const query = { "room.slug": roomSlug };
      if (this.state.search) {
        query.name = { $regex: this.state.search, $options: "i" };
      }

      return {
        loading: ! handleRoom.ready() || ! handleTopics.ready(),
        room: Rooms.findOne({ slug: roomSlug }),
        topics: Topics.find(
          query,
          { sort: { lastActivity: -1, createdAt: -1 } }
        ).fetch()
      };
    } else {
      const handle = Meteor.subscribe("directMessageTopics");

      const query = { relationship: { $exists: true } };
      if (this.state.search) {
        const reg  = { $regex: this.state.search, $options: "i" };
        query.$or = [
          { "owner0.username": reg },
          { "owner0.normalizedUsername": reg },
          { "owner0.profile.displayName": reg },
          { "owner1.username": reg },
          { "owner1.normalizedUsername": reg },
          { "owner1.profile.displayName": reg }
        ];
      }

      return {
        loading: ! handle.ready(),
        room: {
          _id: null,
          name: "Direct Messages"
        },
        topics: Topics.find(
          query,
          { sort: { lastActivity: -1, createdAt: -1 } }
        ).fetch()
      };
    }
  },
  handleSearch(e) {
    this.setState({ search: e.target.value });
  },
  renderTopics() {
    if (this.data.topics.length) {
      return this.data.topics.map((topic) => {
        return <TopicListItem
          topic={topic}
          deactivateLeft={this.props.deactivateLeft}
          dm={this.props.dm}
          key={topic._id}
        />;
      });
    }
    if (! this.props.dm) {
      return <li>No topics.</li>;
    } else {
      return <li>No conversations.</li>;
    }
  },
  render() {
    if (this.data.loading || ! this.data.room || ! this.data.topics) {
      return <DenseLoadingSpinner />;
    }

    const url = expr(() => {
      if (! this.props.dm) {
        return FlowRouter.path("room", { roomSlug: this.data.room.slug });
      } else {
        return FlowRouter.path("dmList");
      }
    });

    return <List ordered={true} className="topicList">
      <li className="roomHead">
        <div className="closedog hide-on-med-and-up" onTouchTap={this.props.deactivateLeft}>
          <Icon>arrow_back</Icon>
        </div>
        <a href={url} onTouchTap={this.props.deactivateLeft}>
          <header>
            <h2>{this.data.room.name}</h2>
          </header>
        </a>
      </li>
      <li className="roomTools">
        <TopicButton dm={this.props.dm} room={this.data.room} />
        <TextField
          id={"topicSearch" + this.data.room._id}
          hintText="Search"
          onChange={this.handleSearch}
        />
      </li>
      {this.renderTopics()}
    </List>;
  }
});
