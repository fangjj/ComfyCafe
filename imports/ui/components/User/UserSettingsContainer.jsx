import _ from "lodash";
import React from "react";

import Filters from "/imports/api/filters/collection";
import filtersFor from "/imports/api/filters/filtersFor";
import UserSettings from "./UserSettings";

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {};
  },
  getMeteorData() {
    const filterHandle = Meteor.subscribe("filtersFor");
    const defaultFilter = Filters.findOne(
      {
        owner: { $exists: false },
        default: true
      }
    );
    const defaultFilterId = _.get(defaultFilter, "_id");

    const data = {
      loading: false,
      filterLoading: ! filterHandle.ready(),
      filters: filtersFor().fetch(),
      defaultFilterId,
      currentUser: Meteor.user()
    };

    if (this.state.username) {
      const handle = Meteor.subscribe("user", this.state.username);
      return _.defaults({
        loading: ! handle.ready(),
        user: Meteor.users.findOne(
          {
            _id: { $ne: Meteor.userId() },
            username: this.state.username
          },
          { fields: { username: 1 } }
        )
      }, data);
    }

    return data;
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
