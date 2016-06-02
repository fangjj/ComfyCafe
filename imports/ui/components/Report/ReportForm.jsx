import _ from "lodash";
import React from "react";

import "/imports/api/reports/methods";
import Form from "/imports/ui/components/Form";
import TextArea from "/imports/ui/components/TextArea";
import ViolationSelector from "/imports/ui/components/ViolationSelector";
import ReportFormGuts from "/imports/ui/components/Report/ReportFormGuts";

const defaultState = {
  violation: "spam",
  details: ""
};

export default React.createClass({
  getInitialState() {
    return _.defaults(_.pick(this.props.report, _.keys(defaultState)), defaultState);
  },
  handleViolation(e, index, value) {
    this.setState({ violation: value });
  },
  handleDetails(e) {
    this.setState({ details: e.target.value });
  },
  handleSubmit() {
    const data = _.clone(this.state);
    data.item = {
      _id: this.props.item._id,
      ownerId: expr(() => {
        if (this.props.itemType !== "user") {
          return this.props.item.owner._id;
        } else {
          return this.props.item._id;
        }
      }),
      type: this.props.itemType
    };

    if (! this.props.report) {
      Meteor.call("addReport", data, (err, name) => {
        if (err) {
          prettyPrint(err);
        } else {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
        }
      });
    } else {
      Meteor.call("updateReport", this.props.report._id, data, (err) => {
        if (err) {
          prettyPrint(err);
        }
      });
    }
  },
  render() {
    return <Form
      className="reportForm"
      id={this.props.id}
      actions={this.props.actions}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
      <ReportFormGuts
        itemType={this.props.itemType}
        violation={this.state.violation}
        handleViolation={this.handleViolation}
        details={this.state.details}
        handleDetails={this.handleDetails}
      />
    </Form>;
  }
});
