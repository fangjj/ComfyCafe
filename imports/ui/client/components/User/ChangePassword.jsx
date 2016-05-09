import _ from "lodash";
import React from "react";

import strings from "/imports/api/users/strings";
import { errorMapper } from "/imports/ui/client/utils/error"
import Content from "/imports/ui/client/components/Content";
import Actions from "/imports/ui/client/components/Actions";
import Error from "/imports/ui/client/components/Error";
import TextField from "/imports/ui/client/components/TextField";
import Snackbar from "/imports/ui/client/components/Snackbar";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

export default React.createClass({
  getInitialState() {
    return { snackbarOpen: false };
  },
  handleSnackbarRequestClose() {
    this.setState({ snackbarOpen: false });
  },
  hasErrors() {
    return _.reduce(
      [
        this.state.oldPasswordError,
        this.state.newPasswordError
      ],
      (result, value) => {
        return result || Boolean(value);
      },
      false
    );
  },
  handleOldPassword(e) {
    this.setState({
      oldPassword: e.target.value,
      oldPasswordError: undefined
    });
  },
  handleNewPassword(e) {
    this.setState({
      newPassword: e.target.value,
      newPasswordError: undefined
    });
  },
  enforceRequired() {
    const errors = {};
    if (! this.state.oldPassword) {
      errors.oldPasswordError = strings.passwordRequired;
    }
    if (! this.state.newPassword) {
      errors.newPasswordError = strings.passwordRequired;
    }
    if (! _.isEmpty(errors)) {
      this.setState(errors);
      return false;
    }
    return true;
  },
  handleSubmit(e) {
    e.preventDefault();
    if (this.hasErrors() || ! this.enforceRequired()) {
      return;
    }

    Accounts.changePassword(this.state.oldPassword, this.state.newPassword, (err) => {
      if (err) {
        this.error = err;
        const errorMap = {
          "403": {
            "Incorrect password": () => {
              this.setState({ oldPasswordError: strings.passwordRejected });
            }
          }
        };
        errorMapper(errorMap, err);
      } else {
        this.setState({ snackbarOpen: true });
      }
    });
  },
  renderError() {
    if (this.state.generalError) {
      if (this.state.tokenError) {
        return this.renderTokenError();
      }
    }
  },
  renderTokenError() {
    return <Error>{strings.tokenExpired}</Error>;
  },
  render() {
    return <Content className="loginForm">
      <header>
        <h2>Change Password</h2>
      </header>
      {this.renderError()}
      <form onSubmit={this.handleSubmit}>
        <TextField
          name="password"
          type="password"
          label="Old Password"
          errorText={this.state.oldPasswordError}
          onChange={this.handleOldPassword}
        />
        <TextField
          type="password"
          label="New Password"
          errorText={this.state.newPasswordError}
          onChange={this.handleNewPassword}
        />
        <Actions>
          <SubmitButton type="submit" />
        </Actions>
      </form>

      <Snackbar
        open={this.state.snackbarOpen}
        message="Password changed successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Content>;
  }
});
