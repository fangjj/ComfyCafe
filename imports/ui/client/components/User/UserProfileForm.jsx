import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";

import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import Powerless from "../Powerless";
import Actions from "../Actions";
import CancelButton from "/imports/ui/client/components/Button/CancelButton";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

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
      displayName: "",
      blurb: ""
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
  submit(event) {
    var self = this;
    Meteor.call("updateProfile", {
      displayName: this.state.displayName,
      blurb: this.state.blurb
    }, () => {
	    this.setState({snackbarOpen: true});
    });
  },
  cancel(event) {
    var path = FlowRouter.path("profile", {username: this.props.currentUser.username});
    FlowRouter.go(path);
  },
  componentWillMount() {
    let obj = {};

    if (this.props.currentUser && _.has(this.props.currentUser, "profile")) {
      if (_.has(this.props.currentUser.profile, "displayName")) {
        obj.displayName = this.props.currentUser.profile.displayName;
      }

      if (_.has(this.props.currentUser.profile, "blurb")) {
        obj.blurb = this.props.currentUser.profile.blurb;
      }

      this.setState(obj);
    }
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
        onChange={this.handleDisplayName}
        fullWidth={true}
      />

      <TextField
        defaultValue={this.state.blurb}
        floatingLabelText="Blurb"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={1}
        onChange={this.handleBlurb}
        fullWidth={true}
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
