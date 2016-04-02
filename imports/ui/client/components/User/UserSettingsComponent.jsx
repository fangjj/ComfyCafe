import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import goBack from "/imports/ui/client/utils/goBack";

import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import Powerless from "../Powerless";
import Actions from "../Actions";
import CancelButton from "/imports/ui/client/components/Button/CancelButton";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import PostFilters from "../Post/PostFilters";

import {
  TextField,
  SelectField,
  MenuItem,
  Toggle,
  RaisedButton,
  Snackbar
} from "material-ui";

const UserSettingsComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      currentUser: Meteor.user()
    };
  },
  getInitialState() {
    return {
      snackbarOpen: false,
      defaultPage: "art",
      defaultFilter: "sfw",
      uploadAction: "redirect",
      autoWatch: false,
      patternSeed: "",
    };
  },
  handleSnackbarRequestClose() {
    this.setState({
      snackbarOpen: false
    });
  },
  handleDefaultPage(event, index, value) {
    this.setState({defaultPage: value})
  },
  handleDefaultFilter(event, index, value) {
    this.setState({defaultFilter: value})
  },
  handleUploadAction(event, index, value) {
    this.setState({uploadAction: value})
  },
  handleAutoWatch(event) {
    this.setState({autoWatch: event.target.checked})
  },
  handlePatternSeed(event) {
    this.props.setPattern(event.target.value);
    this.setState({patternSeed: event.target.value})
  },
  submit(event) {
    var self = this;
    Meteor.call("updateSettings", {
      defaultPage: this.state.defaultPage,
      defaultFilter: this.state.defaultFilter,
      uploadAction: this.state.uploadAction,
      autoWatch: this.state.autoWatch,
      patternSeed: this.state.patternSeed
    }, () => {
	    this.setState({snackbarOpen: true});
    });
  },
  cancel(event) {
    goBack();
  },
  componentWillMount() {
    let obj = {};

    if (this.data.currentUser && _.has(this.data.currentUser, "settings")) {
      if (_.has(this.data.currentUser.settings, "defaultPage")) {
        obj.defaultPage = this.data.currentUser.settings.defaultPage;
      }

      if (_.has(this.data.currentUser.settings, "defaultFilter")) {
        obj.defaultFilter = this.data.currentUser.settings.defaultFilter;
      }

      if (_.has(this.data.currentUser.settings, "uploadAction")) {
        obj.uploadAction = this.data.currentUser.settings.uploadAction;
      }

      if (_.has(this.data.currentUser.settings, "autoWatch")) {
        obj.autoWatch = this.data.currentUser.settings.autoWatch;
      }

      if (_.has(this.data.currentUser.settings, "patternSeed")) {
        obj.patternSeed = this.data.currentUser.settings.patternSeed;
      }

      this.setState(obj);
    }
  },
  render() {
    if (! this.data.currentUser) {
      return <Powerless />;
    }

    if (! _.has(this.data.currentUser, "profile")) {
      return <LoadingSpinner />;
    }

    return <div className="settings content">
      <SelectField
        value={this.state.defaultPage}
        onChange={this.handleDefaultPage}
        floatingLabelText="Default Page"
      >
        <MenuItem value="art" primaryText="Images" />
        <MenuItem value="blog" primaryText="Blog" />
      </SelectField>
      <br />
      <PostFilters
        value={this.state.defaultFilter}
        floatingLabelText="Default Filter"
        onChange={this.handleDefaultFilter}
      />
      <br />
      <SelectField
        value={this.state.uploadAction}
        onChange={this.handleUploadAction}
        floatingLabelText="After creating a post..."
      >
        <MenuItem value="redirect" primaryText="Redirect to the post" />
        <MenuItem value="tab" primaryText="Open post in a new tab" />
        <MenuItem value="nothing" primaryText="Do nothing" />
      </SelectField>

      <Toggle
        label="Auto-watch topics you post in"
        defaultToggled={this.state.autoWatch}
        onToggle={this.handleAutoWatch}
      />

      <TextField
        defaultValue={this.state.patternSeed}
        floatingLabelText="Pattern Seed"
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={1}
        onChange={this.handlePatternSeed}
        fullWidth={true}
      />

      <br />

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
        message="Settings saved successfully."
        autoHideDuration={4000}
        onRequestClose={this.handleSnackbarRequestClose}
        bodyStyle={{backgroundColor: "#237B4C"}}
      />
    </div>;
  }
});

export default UserSettingsComponent;
