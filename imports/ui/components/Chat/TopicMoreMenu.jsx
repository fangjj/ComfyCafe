import React from "react";

import "/imports/api/topics/methods";

import TopicUpdateForm from "./TopicUpdateForm";
import Icon from "../Icon";

import {
  IconMenu,
  MenuItem,
  IconButton
} from "material-ui";

const TopicMoreMenu = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showTopicForm() {
    this.setState({showForm: true});
  },
  hideTopicForm() {
    this.setState({showForm: false});
  },
  delete() {
    Meteor.call("deleteTopic", this.props.topic._id, () => {
      if (this.props.redirect) {
        var path = FlowRouter.path("room", {roomId: this.props.topic.room._id});
        FlowRouter.go(path);
      }
    });
  },
  render() {
    var topic = this.props.topic;

    var owner = topic.owner;
    var isOwner = this.props.currentUser && this.props.currentUser._id === owner._id;

    var moreBtn = <IconButton>
      <Icon>more_horiz</Icon>
    </IconButton>;

    return <div className="more">
      <IconMenu
        iconButtonElement={moreBtn}
        anchorOrigin={{horizontal: "right", vertical: "top"}}
        targetOrigin={{horizontal: "right", vertical: "top"}}
      >
        <MenuItem primaryText="Edit" onTouchTap={this.showTopicForm} />
        <MenuItem primaryText="Delete" onTouchTap={this.delete} />
      </IconMenu>
      <TopicUpdateForm
        topic={this.props.topic}
        handleClose={this.hideTopicForm}
        open={this.state.showForm}
      />
    </div>;
  }
});

export default TopicMoreMenu;
