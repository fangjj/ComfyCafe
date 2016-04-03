import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";

import Powerless from "/imports/ui/client/components/Powerless";
import Actions from "/imports/ui/client/components/Actions";
import MultiField from "/imports/ui/client/components/MultiField";
import CancelButton from "/imports/ui/client/components/Button/CancelButton";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";

import {
  TextField,
  SelectField,
  MenuItem,
  Toggle,
  RaisedButton,
  Snackbar
} from "material-ui";

const UserProfileForm = React.createClass({
  getInitialState() {
    return {
      snackbarOpen: false,
      displayName: _.get(this.props.currentUser, "profile.displayName", ""),
      blurb: _.get(this.props.currentUser, "profile.blurb", ""),
      info: _.get(this.props.currentUser, "profile.info", {})
    };
  },
  handleSnackbarRequestClose() {
    this.setState({
      snackbarOpen: false
    });
  },
  handleDisplayName(event) {
    this.setState({displayName: event.target.value})
  },
  handleBlurb(event) {
    this.setState({blurb: event.target.value})
  },
  handleInfo(id, label, value) {
    const obj = _.clone(this.state.info);
    obj[id] = [label, value];
    this.setState({info: obj});
  },
  submit(event) {
    var self = this;
    Meteor.call("updateProfile", {
      displayName: this.state.displayName,
      blurb: this.state.blurb,
      info: this.state.info
    }, () => {
	    this.setState({snackbarOpen: true});
    });
  },
  cancel(event) {
    var path = FlowRouter.path("profile", {username: this.props.currentUser.username});
    FlowRouter.go(path);
  },
  render() {
    if (! this.props.currentUser) {
      return <Powerless />;
    }

    if (! _.has(this.props.currentUser, "profile")) {
      return <LoadingSpinner />;
    }

    return <div>
      <TextField
        defaultValue={this.state.displayName}
        floatingLabelText="Display Name"
        floatingLabelStyle={{fontSize: "20px"}}
        fullWidth={true}
        onChange={this.handleDisplayName}
      />

      <TextField
        defaultValue={this.state.blurb}
        floatingLabelText="Sassy Catchphrase"
        floatingLabelStyle={{fontSize: "20px"}}
        fullWidth={true}
        onChange={this.handleBlurb}
      />

      <MultiField
        label="Random Information"
        defaultValue={this.state.info}
        defaultQty={1}
        onChange={this.handleInfo}
      />

      <Actions>
        <CancelButton
          onTouchTap={this.cancel}
        />
        <SubmitButton
          label="Save"
          onTouchTap={this.submit}
        />
      </Actions>

      <Snackbar
        className="snackbar"
        open={this.state.snackbarOpen}
        message="Profile saved successfully."
        autoHideDuration={4000}
        onRequestClose={this.handleSnackbarRequestClose}
        bodyStyle={{backgroundColor: "#237B4C"}}
      />
    </div>;
  }
});

export default UserProfileForm;
