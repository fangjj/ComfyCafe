import _ from "lodash";
import React from "react";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

import "/imports/api/users/methods";
import { validateUsername } from "/imports/api/users/validators";
import strings from  "/imports/api/users/strings";
import { initialStateBuilder, dataBuilder } from "/imports/ui/utils/forms";
import goBack from "/imports/ui/utils/goBack";
import Content from "/imports/ui/components/Content";
import Powerless from "/imports/ui/components/Powerless";
import Actions from "/imports/ui/components/Actions";
import CancelButton from "/imports/ui/components/Button/CancelButton";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import FlatButton from "/imports/ui/components/Button/FlatButton";
import VisibilitySelector from "/imports/ui/components/VisibilitySelector";
import OriginalitySelector from "/imports/ui/components/OriginalitySelector";
import TextField from "/imports/ui/components/TextField";
import Toggle from "/imports/ui/components/Toggle";
import Snackbar from "/imports/ui/components/Snackbar";

const defaultState = {
  username: null,
  uploadAction: "redirect",
  autoWatch: true,
  defaultImageVisibility: "public",
  defaultImageOriginality: "original"
};

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    const state = initialStateBuilder(this.context.currentUser.settings, defaultState);
    state.username = this.context.currentUser.username;
    state.snackbarOpen = false;
    return state;
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
    this.setState({ snackbarOpen: false });
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
  handleUploadAction(e, index, value) {
    this.setState({ uploadAction: value });
  },
  handleAutoWatch(e) {
    this.setState({ autoWatch: e.target.checked });
  },
  handleDefaultImageVisibility(value) {
    this.setState({ defaultImageVisibility: value });
  },
  handleDefaultImageOriginality(value) {
    this.setState({ defaultImageOriginality: value });
  },
  submit() {
    const data = dataBuilder(this.state, defaultState);

    Meteor.call("updateSettings", data, () => {
	    this.setState({ snackbarOpen: true });
    });
  },
  cancel(e) {
    goBack();
  },

  render() {
    if (! this.props.currentUser) {
      return <Powerless />;
    }

    return <Content className="settings">
      <TextField
        defaultValue={this.state.username}
        label="Username"
        errorText={this.state.usernameError}
        fullWidth={true}
        onChange={this.handleUsername}
      />

      <a
        className="authLink"
        href={FlowRouter.path("changePassword")}
      >Change Password</a>

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
        value={this.state.autoWatch}
        onChange={this.handleAutoWatch}
      />

      <br />

      <VisibilitySelector
        label="Default image visibility"
        visibility={this.state.defaultImageVisibility}
        onChange={this.handleDefaultImageVisibility}
      />

      <OriginalitySelector
        label="Default image originality"
        value={this.state.defaultImageOriginality}
        onChange={this.handleDefaultImageOriginality}
      />

      <br />

      <Actions>
        <CancelButton
          onClick={this.cancel}
        />
        <SubmitButton
          label="Save"
          onClick={this.submit}
        />
      </Actions>

      <Snackbar
        open={this.state.snackbarOpen}
        message="Settings saved successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Content>;
  }
});
