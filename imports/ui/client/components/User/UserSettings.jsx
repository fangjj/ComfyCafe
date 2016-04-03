import _ from "lodash";
import React from "react";

import "/imports/api/users/methods";
import {
  validateUsername
} from "/imports/api/users/validators";
import strings from  "/imports/api/users/strings";
import goBack from "/imports/ui/client/utils/goBack";
import Colors from "/imports/ui/client/utils/colors";

import Content from "/imports/ui/client/components/Content";
import Powerless from "/imports/ui/client/components/Powerless";
import Actions from "/imports/ui/client/components/Actions";
import CancelButton from "/imports/ui/client/components/Button/CancelButton";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import PostFilters from "/imports/ui/client/components/Post/PostFilters";

import {
  TextField,
  SelectField,
  MenuItem,
  Toggle,
  RaisedButton,
  Snackbar
} from "material-ui";

const UserSettings = React.createClass({
  getInitialState() {
    return {
      snackbarOpen: false,
      username: this.props.currentUser.username,
      defaultPage: _.get(this.props.currentUser, "settings.defaultPage", "art"),
      defaultFilter: _.get(this.props.currentUser, "settings.defaultFilter", "sfw"),
      uploadAction: _.get(this.props.currentUser, "settings.uploadAction", "redirect"),
      autoWatch: _.get(this.props.currentUser, "settings.autoWatch", false),
      patternSeed: _.get(this.props.currentUser, "settings.patternSeed", "")
    };
  },
  componentWillReceiveProps(nextProps) {
    if (! this.state.usernameError) {
      if (nextProps.user !== this.props.user) {
        if (nextProps.user) {
          this.setState({
            usernameError: strings.usernameTaken
          });
        } else {
          this.setState({
            usernameError: undefined
          });
        }
      }
    }
  },
  handleSnackbarRequestClose() {
    this.setState({
      snackbarOpen: false
    });
  },
  handleUsername(e) {
    const doc = {};

    doc.username = e.target.value;

    if (! validateUsername(doc.username)) {
      doc.usernameError = strings.usernameInvalid;
    } else {
      doc.usernameError = null;
    }

    this.setState(doc, () => {
      this.props.setUsername(doc.username);
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
      username: this.state.username,
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
  render() {
    if (! this.props.currentUser) {
      return <Powerless />;
    }

    return <Content className="settings">
      <TextField
        defaultValue={this.state.username}
        floatingLabelText="Username"
        floatingLabelStyle={{fontSize: "20px"}}
        errorText={this.state.usernameError}
        errorStyle={{
          fontSize: "16px",
          color: Colors.poisonPink
        }}
        fullWidth={true}
        onChange={this.handleUsername}
      />

      <SelectField
        value={this.state.defaultPage}
        floatingLabelText="Default Page"
        fullWidth={true}
        onChange={this.handleDefaultPage}
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
        floatingLabelText="After creating a post..."
        fullWidth={true}
        onChange={this.handleUploadAction}
      >
        <MenuItem value="redirect" primaryText="Redirect to the post" />
        <MenuItem value="tab" primaryText="Open post in a new tab" />
        <MenuItem value="nothing" primaryText="Do nothing" />
      </SelectField>
      <br />
      <br />
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
    </Content>;
  }
});

export default UserSettings;
