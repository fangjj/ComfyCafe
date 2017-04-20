import _ from "lodash";
import React from "react";

import "/imports/api/blog/methods";
import { initialStateBuilder, dataBuilder } from "/imports/ui/utils/forms";
import reasonBuilder from "/imports/ui/utils/reasonBuilder";
import Form from "/imports/ui/components/Form";
import VisibilitySelector from "/imports/ui/components/VisibilitySelector";
import TextField from "/imports/ui/components/TextField";
import TextArea from "/imports/ui/components/TextArea";
import ReportFormGuts from "/imports/ui/components/Report/ReportFormGuts";
import Snackbar from "/imports/ui/components/Snackbar";
import DangerButton from "/imports/ui/components/Button/DangerButton";

const defaultState = {
  name: "",
  visibility: "public",
  body: ""
};

function isReblog(props) {
  return props.reblogOf || _.get(props.post, "reblogOf");
}

export default React.createClass({
  getInitialState() {
    const state = initialStateBuilder(this.props.post, defaultState);
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
  handleSubmit() {
    const data = dataBuilder(this.state, defaultState);

    if (isReblog(this.props)) {
      if (! this.props.post) {
        Meteor.call("addReblog", this.props.reblogOf._id, data.body, (err) => {
          if (err) {
            prettyPrint(err);
          }
        });
      } else {
        Meteor.call("updateReblog", this.props.post._id, data.body, (err) => {
          if (err) {
            prettyPrint(err);
          }
        });
      }

      return;
    }

    if (this.props.mod) {
      const reason = reasonBuilder(this.state);
      Meteor.call("modUpdateBlogPost", this.props.post._id, data, reason, (err) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
          this.setState({ snackbarOpen: true });
        }
      });
    } else if (! this.props.post) {
      Meteor.call("addBlogPost", data, (err) => {
        if (err) {
          prettyPrint(err);
        }
      });
    } else {
      Meteor.call("updateBlogPost", this.props.post._id, data, (err, slug) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.redirect) {
            const path = FlowRouter.path("blogPost", {
              username: this.props.post.owner.username,
              slug: slug
            });
            FlowRouter.go(path);
          }
        }
      });
    }
  },
  handleModDelete() {
    const reason = reasonBuilder(this.state);
    Meteor.call("modDeleteBlogPost", this.props.post._id, reason, (err) => {
      if (err) {
        prettyPrint(err);
      } else {
        FlowRouter.go(FlowRouter.path("adminPanel", { panel: "blog" }));
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
  renderTitle() {
    if (! isReblog(this.props)) {
      return <TextField
        label="Title"
        defaultValue={this.state.name}
        onChange={this.handleName}
      />;
    }
  },
  renderVisibility() {
    if (! isReblog(this.props)) {
      return <VisibilitySelector
        visibility={this.state.visibility}
        onChange={this.handleVisibility}
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
        onClick={this.handleModDelete}
      />}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
      {this.renderReportForm()}

      {this.renderTitle()}
      {this.renderVisibility()}
      <TextArea
        label="Body"
        defaultValue={this.state.body}
        rows={4}

        onChange={this.handleBody}
      />

      <Snackbar
        unexist={! this.props.mod}
        open={this.state.snackbarOpen}
        message="Blog updated successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Form>;
  }
});
