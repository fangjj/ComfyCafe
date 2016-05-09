import _ from "lodash";
import React from "react";

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
    return {};
  },
  hasErrors() {
    return _.reduce(
      [
        this.state.passwordError
      ],
      (result, value) => {
        return result || Boolean(value);
      },
      false
    );
  },
  handlePassword(e) {
    this.setState({
      password: e.target.value,
      passwordError: undefined
    });
  },
  enforceRequired() {
    const errors = {};
    if (! this.state.password) {
      errors.passwordError = strings.passwordRequired;
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

    Accounts.resetPassword(this.props.passwordResetToken, this.state.password, (err) => {
      if (err) {
        this.error = err;
        const errorMap = {
          "403": {
            "Token expired": () => {
              this.setState(errorBuilder({
                generalError: true,
                tokenError: true
              }));
            }
          }
        };
        errorMapper(errorMap, err);
      } else {
        this.props.doneCallback();
        Session.set("passwordResetToken", null);
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
        <h2>Reset Password</h2>
      </header>
      {this.renderError()}
      <form onSubmit={this.handleSubmit}>
        <TextField
          name="password"
          type="password"
          label="New Password"
          errorText={this.state.passwordError}
          onChange={this.handlePassword}
        />
        <Actions>
          <SubmitButton type="submit" />
        </Actions>
      </form>
    </Content>;
  }
});
