import _ from "lodash";
import React from "react";

import Filters from "/imports/api/filters/collection";
import UserSettings from "./UserSettings";

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {};
  },
  getMeteorData() {
    const filterHandle = Meteor.subscribe("globalFilters");
    const defaultFilter = Filters.findOne(
      {
        owner: { $exists: false },
        default: true
      }
    );
    const defaultFilterId = _.get(defaultFilter, "_id");

    if (this.state.username) {
      const handle = Meteor.subscribe("user", this.state.username);
      return {
        loading: ! handle.ready(),
        filterLoading: ! filterHandle.ready(),
        user: Meteor.users.findOne(
          {
            _id: { $ne: Meteor.userId() },
            username: this.state.username
          },
          { fields: { username: 1 } }
        ),
        filters: Filters.find({ owner: { $exists: false } }).fetch(),
        defaultFilterId,
        currentUser: Meteor.user()
      };
    } else {
      return {
        loading: false,
        filterLoading: ! filterHandle.ready(),
        filters: Filters.find({ owner: { $exists: false } }).fetch(),
        defaultFilterId,
        currentUser: Meteor.user()
      };
    }
  },
  setUsername(value) {
    this.setState({ username: value });
  },
  render() {
    return <UserSettings
      setUsername={this.setUsername}
      {...this.data}
    />;
  }
});
