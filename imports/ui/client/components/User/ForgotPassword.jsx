import _ from "lodash";
import React from "react";
import Snackbar from "material-ui/Snackbar";

import { validateEmail } from "/imports/api/users/validators";
import strings from "/imports/api/users/strings";
import { errorMapper } from "/imports/ui/client/utils/error"
import Content from "/imports/ui/client/components/Content";
import Actions from "/imports/ui/client/components/Actions";
import Error from "/imports/ui/client/components/Error";
import TextField from "/imports/ui/client/components/TextField";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

function errorBuilder(obj) {
  const base = {
    emailError: undefined
  };

  _.each(obj, (v, k) => {
    base[k] = v;
  });

  return base;
}

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
        this.state.emailError
      ],
      (result, value) => {
        return result || Boolean(value);
      },
      false
    );
  },
  handleEmail(e) {
    const email = e.target.value;

    this.setState({ email: email });

    if (! validateEmail(email)) {
      this.setState({ emailError: strings.emailInvalid });
    } else {
      this.setState({ emailError: undefined });
    }
  },
  enforceRequired() {
    const errors = {};
    if (! this.state.email) {
      errors.emailError = strings.emailRequired;
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

    Accounts.forgotPassword({ email: this.state.email }, (err) => {
      if (err) {
        this.error = err;
        const errorMap = {
          "403": {
            "User not found": () => {
              this.setState(errorBuilder({
                emailError: strings.emailUnused
              }));
            }
          }
        };
        errorMapper(errorMap, err);
      } else {
        this.setState({ snackbarOpen: true });
      }
    });
  },
  render() {
    return <Content className="loginForm">
      <header>
        <h2>Forgot Password</h2>
      </header>
      <form onSubmit={this.handleSubmit}>
        <TextField
          name="email"
          defaultValue={this.state.email}
          label="Email"
          errorText={this.state.emailError}
          onChange={this.handleEmail}
        />
        <Actions>
          <SubmitButton
            type="submit"
            label="Send"
            iconName="send"
          />
        </Actions>
      </form>

      <Snackbar
        open={this.state.snackbarOpen}
        message="Password reset link sent successfully."
        autoHideDuration={4000}
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </Content>;
  }
});
