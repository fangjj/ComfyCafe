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
    return {
      search: null
    };
  },
  getMeteorData() {
    const roomSlug = FlowRouter.getParam("roomSlug");
    const handleRoom = Meteor.subscribe("room", roomSlug);
    const handleTopics = Meteor.subscribe("roomTopics", roomSlug);

    const query = {
      "room.slug": roomSlug,
      $or: [
        { visibility: { $ne: "unlisted" } },
        { "owner._id": Meteor.userId() }
      ]
    };
    if (this.state.search) {
      query.name = { $regex: this.state.search, $options: "i" };
    }

    return {
      loading: ! handleRoom.ready() || ! handleTopics.ready(),
      room: Rooms.findOne({ slug: roomSlug }),
      topics: Topics.find(
        query,
        { sort: { lastActivity: -1, createdAt: -1 } }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },
  handleSearch(event) {
    this.setState({search: event.target.value})
  },
  renderTopics() {
    if (this.data.topics.length) {
      return this.data.topics.map((topic) => {
        return <TopicListItem
          topic={topic}
          currentUser={this.data.currentUser}
          deactivateLeft={this.props.deactivateLeft}
          key={topic._id}
        />;
      });
    }
    return <li>No topics.</li>;
  },
  render() {
    if (this.data.loading) {
      return <DenseLoadingSpinner />;
    }

    const url = FlowRouter.path("room", { roomSlug: this.data.room.slug });

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
        <TopicButton room={this.data.room} />
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
