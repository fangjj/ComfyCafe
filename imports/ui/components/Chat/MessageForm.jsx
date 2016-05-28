import _ from "lodash";
import React from "react";

import "/imports/api/messages/methods";
import generateMessageHint from "/imports/api/messages/nameGen/hintGenerator";
import { initialStateBuilder, dataBuilder } from "/imports/ui/utils/forms";
import Form from "/imports/ui/components/Form";
import TextArea from "/imports/ui/components/TextArea";
import reasonBuilder from "/imports/ui/utils/reasonBuilder";
import ReportFormGuts from "/imports/ui/components/Report/ReportFormGuts";
import Snackbar from "/imports/ui/components/Snackbar";
import DangerButton from "/imports/ui/components/Button/DangerButton";

const defaultState = {
  body: ""
};

export default React.createClass({
  getInitialState() {
    const state = initialStateBuilder(this.props.message, defaultState);
    if (this.props.mod) {
      state.violation = "spam";
      state.details = "";
    }
    state.snackbarOpen = false;
    return state;
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
  handleBody(e) {
    if (this.props.directValue) {
      this.props.handleBody(e);
    } else {
      this.setState({ body: e.target.value });
    }
  },
  handleSubmit() {
    const data = dataBuilder(this.state, defaultState);

    if (this.props.mod) {
      const reason = reasonBuilder(this.state);

      const method = expr(() => {
        const slug = FlowRouter.getParam("roomSlug");
        if (! slug) {
          // Global
          return "modUpdateMessage";
        } else {
          // Community-level
          return "communityModUpdateMessage";
        }
      });

      Meteor.call(method, this.props.message._id, data, reason, (err) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
          this.setState({ snackbarOpen: true });
        }
      });
    } else if (! this.props.message) {
      Meteor.call("addMessage", this.props.topic._id, data, (err, name) => {
        if (err) {
          prettyPrint(err);
        }
      });
    } else {
      Meteor.call("updateMessage", this.props.message._id, data, (err) => {
        if (err) {
          prettyPrint(err);
        }
      });
    }
  },
  handleModDelete() {
    const reason = reasonBuilder(this.state);
    const slug = FlowRouter.getParam("roomSlug");

    const cfg = expr(() => {
      const slug = FlowRouter.getParam("roomSlug");
      if (! slug) {
        // Global
        return {
          method: "modDeleteMessage",
          urlBuilder: () => {
            return FlowRouter.path("adminPanel", { panel: "messages" });
          }
        };
      } else {
        // Community-level
        return {
          method: "communityModDeleteMessage",
          urlBuilder: () => {
            return FlowRouter.path("communityAdminPanel", { roomSlug: slug, panel: "messages" });
          }
        };
      }
    });

    Meteor.call(cfg.method, this.props.message._id, reason, (err) => {
      if (err) {
        prettyPrint(err);
      } else {
        FlowRouter.go(cfg.urlBuilder());
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
    const value = {};
    if (this.props.directValue) {
      value.value = this.props.body;
    } else {
      value.defaultValue = _.get(this.props, "message.body");
    }
    return <Form
      className="messageInput"
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

      <TextArea
        {...value}
        id={"msgBody" + _.get(this.props, "message._id", "New" + _.get(this.props, "topic._id"))}
        hintText={generateMessageHint()}
        rows={3}
        rowsMax={10}
        onChange={this.handleBody}
      />

      <Snackbar
        unexist={! this.props.mod}
        open={this.state.snackbarOpen}
        message="Message updated successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Form>;
  }
});
