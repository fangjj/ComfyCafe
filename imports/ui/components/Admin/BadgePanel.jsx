import _ from "lodash";
import React from "react";

import Badges from "/imports/api/badges/collection";
import "/imports/api/badges/methods";
import DenseContent from "/imports/ui/components/DenseContent";
import List from "/imports/ui/components/List";
import FAB from "/imports/ui/components/FAB";
import Dialog from "/imports/ui/components/Dialog";
import Form from "/imports/ui/components/Form";
import TextField from "/imports/ui/components/TextField";

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return { showForm: false };
  },
  getMeteorData() {
    const handle = Meteor.subscribe("allBadges");
    return {
      loading: ! handle.ready(),
      badges: Badges.find(
        {},
        { sort: { name: 1 } }
      ).fetch()
    };
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
    this.setState({ showForm: false });
  },
  handleIcon(e) {
    this.setState({ icon: e.target.value });
  },
  handleName(e) {
    this.setState({ name: e.target.value });
  },
  handleType(e) {
    this.setState({ type: e.target.value });
  },
  handleSubmit() {
    Meteor.call("addBadge", _.omit(this.state, ["showForm"]));
  },
  renderList() {
    return _.map(this.data.badges, (badge) => {
      const path = FlowRouter.path("adminView", {
        panel: "badges",
        id: badge._id
      });
      return <li key={badge._id}>
        <a href={path}>{badge.name}</a>
      </li>;
    });
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Create Badge"
        formId="formNewBadge"
        open={true}
        onClose={this.hideForm}
      >
        <Form id="formNewBadge" onSubmit={this.handleSubmit} onClose={this.hideForm}>
          <TextField label="Icon" onChange={this.handleIcon} />
          <TextField label="Name" onChange={this.handleName} />
          <TextField label="Type" onChange={this.handleType} />
        </Form>
      </Dialog>;
    }
  },
  render() {
    return <DenseContent>
      <List>
        {this.renderList()}
      </List>
      <FAB iconName="add" onTouchTap={this.showForm} />
      {this.renderForm()}
    </DenseContent>;
  }
});
