import _ from "lodash";
import React from "react";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

import "/imports/api/users/methods";
import { validateUsername } from "/imports/api/users/validators";
import strings from  "/imports/api/users/strings";
import { initialStateBuilder, dataBuilder } from "/imports/ui/client/utils/forms";
import goBack from "/imports/ui/client/utils/goBack";
import Content from "/imports/ui/client/components/Content";
import Powerless from "/imports/ui/client/components/Powerless";
import Actions from "/imports/ui/client/components/Actions";
import CancelButton from "/imports/ui/client/components/Button/CancelButton";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import FlatButton from "/imports/ui/client/components/Button/FlatButton";
import PostFilters from "/imports/ui/client/components/Post/PostFilters";
import VisibilitySelector from "/imports/ui/client/components/VisibilitySelector";
import OriginalitySelector from "/imports/ui/client/components/OriginalitySelector";
import TextField from "/imports/ui/client/components/TextField";
import Toggle from "/imports/ui/client/components/Toggle";
import Snackbar from "/imports/ui/client/components/Snackbar";

const defaultState = {
  username: null,
  defaultPage: "art",
  defaultFilter: null,
  uploadAction: "redirect",
  autoWatch: true,
  defaultImageVisibility: "public",
  defaultImageOriginality: "original",
  defaultAlbumVisibility: "unlisted"
};

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    defaultState.defaultFilter = this.props.defaultFilterId;
    const state = initialStateBuilder(this.context.currentUser.settings, defaultState);
    state.username = this.context.currentUser.username;
    state.snackbarOpen = false;
    return state;
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultFilterId !== this.props.defaultFilterId) {
      if (! this.state.defaultFilter) {
        this.setState({ defaultFilter: nextProps.defaultFilterId });
      }
    }

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
  handleDefaultPage(e, index, value) {
    this.setState({ defaultPage: value });
  },
  handleDefaultFilter(e, index, value) {
    this.setState({ defaultFilter: value });
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
  handleDefaultAlbumVisibility(value) {
    this.setState({ defaultAlbumVisibility: value });
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

      <PostFilters
        filters={this.props.filters}
        value={this.state.defaultFilter}
        floatingLabelText="Default Filter"
        onChange={this.handleDefaultFilter}
      />
      <br />
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

      <VisibilitySelector
        label="Default album visibility"
        visibility={this.state.defaultAlbumVisibility}
        onChange={this.handleDefaultAlbumVisibility}
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
        open={this.state.snackbarOpen}
        message="Settings saved successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Content>;
  }
});
