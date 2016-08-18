import _ from "lodash";
import React from "react";

import "/imports/api/pages/methods";
import { initialStateBuilder, dataBuilder } from "/imports/ui/utils/forms";
import Form from "/imports/ui/components/Form";
import TextField from "/imports/ui/components/TextField";
import TextArea from "/imports/ui/components/TextArea";
import VisibilitySelector from "/imports/ui/components/VisibilitySelector";
import reasonBuilder from "/imports/ui/utils/reasonBuilder";
import ReportFormGuts from "/imports/ui/components/Report/ReportFormGuts";
import Snackbar from "/imports/ui/components/Snackbar";
import DangerButton from "/imports/ui/components/Button/DangerButton";

const defaultState = {
  name: "",
  visibility: "public",
  body: ""
};

export default React.createClass({
  getInitialState() {
    const state = initialStateBuilder(this.props.page, defaultState);
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
  handleName(e) {
    this.setState({ name: e.target.value });
  },
  handleVisibility(value) {
    this.setState({ visibility: value });
  },
  handleBody(e) {
    this.setState({ body: e.target.value });
  },
  redirect(slug) {
    if (! this.props.noRedirect) {
      const path = FlowRouter.path("page", {
        username: _.get(this.props, "page.owner.username", this.props.currentUser.username),
        slug: slug
      });
      FlowRouter.go(path);
    }
  },
  handleSubmit() {
    const data = dataBuilder(this.state, defaultState);

    if (this.props.mod) {
      const reason = reasonBuilder(this.state);
      Meteor.call("modUpdatePage", this.props.page._id, data, reason, (err) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
          this.setState({ snackbarOpen: true });
        }
      });
    } else if (! this.props.page) {
      Meteor.call("addPage", data, (err, slug) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
          this.redirect(slug);
        }
      });
    } else {
      Meteor.call("updatePage", this.props.page._id, data, (err, slug) => {
        if (err) {
          prettyPrint(err);
        } else {
          this.redirect(slug);
        }
      });
    }
  },
  handleModDelete() {
    const reason = reasonBuilder(this.state);
    Meteor.call("modDeletePage", this.props.page._id, reason, (err) => {
      if (err) {
        prettyPrint(err);
      } else {
        FlowRouter.go(FlowRouter.path("adminPanel", { panel: "pages" }));
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
      <VisibilitySelector
        visibility={this.state.visibility}
        onChange={this.handleVisibility}
      />
      <TextArea
        defaultValue={this.state.body}
        label="Body"
        rows={3}

        onChange={this.handleBody}
      />

      <Snackbar
        unexist={! this.props.mod}
        open={this.state.snackbarOpen}
        message="Page updated successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Form>;
  }
});
