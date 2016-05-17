import React from "react";

import "/imports/api/rooms/methods";
import generateRoom from "/imports/api/rooms/nameGen/generator";
import { initialStateBuilder, dataBuilder } from "/imports/ui/client/utils/forms";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import TextArea from "/imports/ui/client/components/TextArea";
import Toggle from "/imports/ui/client/components/Toggle";
import Checkbox from "/imports/ui/client/components/Checkbox";

const defaultState = {
  name: generateRoom,
  description: "",
  rules: "",

  requireInvite: false,
  membersCanInvite: true,
  moderatorsCanInvite: true,
  adminsCanInvite: true,
  membersOnlyView: false,
  membersOnlyPost: false,
  membersOnlyCreate: false
};

export default React.createClass({
  getInitialState() {
    const state = initialStateBuilder(this.props.room, defaultState);
    state.nameGenerated = ! this.props.room;
    return state;
  },
  componentWillReceiveProps() {
    if (this.state.nameGenerated) {
      this.setState({ name: generateRoom() });
    }
  },
  handleName(e) {
    this.setState({
      name: e.target.value,
      nameGenerated: false
    });
  },
  handleVisibility(value) {
    this.setState({ visibility: value });
  },
  handleDescription(e) {
    this.setState({ description: e.target.value });
  },
  handleRules(e) {
    this.setState({ rules: e.target.value });
  },
  redirect(slug) {
    if (this.props.redirect) {
      const url = FlowRouter.path("blogPost", {
        username: this.props.post.owner.username,
        slug: slug
      });
      FlowRouter.go(url);
    }
  },
  handleSubmit(e) {
    const data = dataBuilder(this.state, defaultState);

    if (! this.props.room) {
      Meteor.call("addRoom", data, (err, roomSlug) => {
        if (err) {
          prettyPrint(err);
        } else {
          this.redirect(roomSlug);
        }
      });
    } else {
      Meteor.call("updateRoom", this.props.room._id, data, (err, roomSlug) => {
        if (err) {
          prettyPrint(err);
        } else {
          this.redirect(roomSlug);
        }
      });
    }
  },
  render() {
    return <Form
      id={this.props.id}
      actions={this.props.actions}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
      <TextField
        defaultValue={this.state.name}
        label="Name"
        onChange={this.handleName}
      />
      <TextArea
        defaultValue={this.state.description}
        label="Description"
        rows={3}
        rowsMax={10}
        onChange={this.handleDescription}
      />
      <TextArea
        defaultValue={this.state.rules}
        label="Rules"
        rows={3}
        rowsMax={10}
        onChange={this.handleRules}
      />

      <Toggle
        label="Require invite to join"
        value={this.state.requireInvite}
        onChange={(e) => { this.setState({ requireInvite: e.target.checked }); }}
      />

      <section>
        <header>
          <h3>Invites can be made by...</h3>
        </header>
        <Checkbox
          label="Members"
          checked={this.state.membersCanInvite}
          onCheck={(e) => { this.setState({ membersCanInvite: e.target.checked }); }}
        />
        <Checkbox
          label="Community Moderators"
          checked={this.state.moderatorsCanInvite}
          onCheck={(e) => { this.setState({ moderatorsCanInvite: e.target.checked }); }}
        />
        <Checkbox
          label="Community Admins"
          checked={this.state.adminsCanInvite}
          onCheck={(e) => { this.setState({ adminsCanInvite: e.target.checked }); }}
        />
      </section>

      <section>
        <header>
          <h3>Require membership to...</h3>
        </header>
        <Checkbox
          label="View topics"
          checked={this.state.membersOnlyView}
          onCheck={(e) => { this.setState({ membersOnlyView: e.target.checked }); }}
        />
        <Checkbox
          label="Post in topics"
          checked={this.state.membersOnlyPost}
          onCheck={(e) => { this.setState({ membersOnlyPost: e.target.checked }); }}
        />
        <Checkbox
          label="Create topics"
          checked={this.state.membersOnlyCreate}
          onCheck={(e) => { this.setState({ membersOnlyCreate: e.target.checked }); }}
        />
      </section>
    </Form>;
  }
});
