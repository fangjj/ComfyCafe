import React from "react";

import "/imports/api/rooms/methods";
import generateRoom from "/imports/api/rooms/nameGen/generator";
import { initialStateBuilder, dataBuilder } from "/imports/ui/utils/forms";
import Form from "/imports/ui/components/Form";
import TextField from "/imports/ui/components/TextField";
import TextArea from "/imports/ui/components/TextArea";
import Toggle from "/imports/ui/components/Toggle";
import Checkbox from "/imports/ui/components/Checkbox";
import reasonBuilder from "/imports/ui/utils/reasonBuilder";
import ReportFormGuts from "/imports/ui/components/Report/ReportFormGuts";
import Snackbar from "/imports/ui/components/Snackbar";
import DangerButton from "/imports/ui/components/Button/DangerButton";

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
    if (this.props.mod) {
      state.violation = "spam";
      state.details = "";
    }
    state.snackbarOpen = false;
    return state;
  },
  componentWillReceiveProps() {
    if (this.state.nameGenerated) {
      this.setState({ name: generateRoom() });
    }
  },
  handleSnackbarRequestClose() {
    this.setState({ snackbarOpen: false });
  },
  handleViolation(e, index, value) {
    this.setState({ violation: value });
  },
  handleDetails(e) {
    this.setState({ details: e.target.value });
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
  redirect(roomSlug) {
    if (this.props.redirect) {
      const url = FlowRouter.path("room", { roomSlug });
      FlowRouter.go(url);
    }
  },
  handleSubmit(e) {
    const data = dataBuilder(this.state, defaultState);

    if (this.props.mod) {
      const reason = reasonBuilder(this.state);
      Meteor.call("modUpdateCommunity", this.props.room._id, data, reason, (err) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
          this.setState({ snackbarOpen: true });
        }
      });
    } else if (! this.props.room) {
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
          this.setState({ snackbarOpen: true });
          this.redirect(roomSlug);
        }
      });
    }
  },
  handleModDelete() {
    const reason = reasonBuilder(this.state);
    Meteor.call("modDeleteCommunity", this.props.room._id, reason, (err) => {
      if (err) {
        prettyPrint(err);
      } else {
        FlowRouter.go(FlowRouter.path("adminPanel", { panel: "communities" }));
      }
    });
  },
  renderReportForm() {
    if (this.props.mod) {
      return <ReportFormGuts
        violation={this.state.violation}
        handleViolation={this.handleViolation}
        details={this.state.details}
        handleDetails={this.handleDetails}
      />;
    }
  },
  render() {
    return <Form
      id={this.props.id}
      actions={this.props.actions}
      left={this.props.mod && <DangerButton
        label="Delete"
        iconName="delete"
        subtle={true}
        onTouchTap={this.handleModDelete}
      />}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
      {this.renderReportForm()}

      <TextField
        defaultValue={this.state.name}
        label="Name"
        onChange={this.handleName}
      />
      <TextArea
        defaultValue={this.state.description}
        label="Description"
        rows={3}
        
        onChange={this.handleDescription}
      />
      <TextArea
        defaultValue={this.state.rules}
        label="Rules"
        rows={3}
        
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

      <Snackbar
        unexist={! this.props.mod}
        open={this.state.snackbarOpen}
        message="Community updated successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Form>;
  }
});
