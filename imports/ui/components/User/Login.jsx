import _ from "lodash";
import React from "react";

import setTitle from "/imports/ui/utils/setTitle"
import {
  validateUsername,
  validateEmail
} from "/imports/api/users/validators";
import strings from "/imports/api/users/strings";
import goBack from "/imports/ui/utils/goBack"
import { errorMapper } from "/imports/ui/utils/error"
import Content from "/imports/ui/components/Content";
import Actions from "/imports/ui/components/Actions";
import Error from "/imports/ui/components/Error";
import Countdown from "/imports/ui/components/Countdown";
import TextField from "/imports/ui/components/TextField";
import Checkbox from "/imports/ui/components/Checkbox";
import CancelButton from "/imports/ui/components/Button/CancelButton";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import FlatButton from "/imports/ui/components/Button/FlatButton";

function errorBuilder(obj) {
  const base = {
    generalError: undefined,
    waitError: undefined,
    usernameError: undefined,
    passwordError: undefined,
    emailError: undefined,
    betaKeyError: undefined,
    tosAcceptedError: undefined
  };

  _.each(obj, (v, k) => {
    base[k] = v;
  });

  return base;
}

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      register: Boolean(this.props.register)
    };
  },
  getMeteorData() {
    if (this.state.register && this.state.username) {
      const handle = Meteor.subscribe("user", this.state.username);
      return {
        loading: ! handle.ready(),
        user: Meteor.users.findOne(
          { username: this.state.username },
          { fields: { username: 1 } }
        )
      };
    } return { loading: false };
  },
  componentWillMount() {
    if (this.state.register) {
      this.handleRegister();
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.state.register && ! this.state.usernameError) {
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
  hasErrors() {
    return _.reduce(
      [
        this.state.generalError,
        this.state.usernameError,
        this.state.passwordError,
        this.state.emailError,
        this.state.betaKeyError
      ],
      (result, value) => {
        return result || Boolean(value);
      },
      false
    );
  },
  handleUsername(e) {
    const username = e.target.value;

    this.setState({
      username: username
    });

    if (this.state.register) {
      if (! validateUsername(username)) {
        this.setState({
          usernameError: strings.usernameInvalid
        });
      } else {
        this.setState({
          usernameError: undefined
        });
      }
      this.props.setUsername(username);
    }
  },
  handlePassword(e) {
    this.setState({
      password: e.target.value,
      passwordError: undefined
    });
  },
  handleEmail(e) {
    const email = e.target.value;

    this.setState({
      email: email
    });

    if (! validateEmail(email)) {
      this.setState({
        emailError: strings.emailInvalid
      });
    } else {
      this.setState({
        emailError: undefined
      });
    }
  },
  handleBetaKey(e) {
    this.setState({
      betaKey: e.target.value,
      betaKeyError: undefined
    });
  },
  handleAccept(e) {
    this.setState({
      tosAccepted: e.target.checked,
      tosAcceptedError: undefined,
      generalError: undefined
    });
  },
  handleCancel(e) {
    if (this.state.register) {
      FlowRouter.go(FlowRouter.path("login"));
      this.setState(errorBuilder({
        register: false
      }));
      this.props.setUsername();
    } else {
      goBack();
    }
  },
  handleRegister(first) {
    FlowRouter.go(FlowRouter.path("register"));
    this.setState(errorBuilder({
      register: true
    }), () => {
      this.props.setUsername(this.state.username);
    });
  },
  enforceRequired() {
    const errors = {};
    if (! this.state.username) {
      errors.usernameError = strings.usernameRequired;
    }
    if (! this.state.password) {
      errors.passwordError = strings.passwordRequired;
    }
    if (this.state.register) {
      if (! this.state.email) {
        errors.emailError = strings.emailRequired;
      }
      if (! this.state.betaKey && _.get(Meteor.settings, "public.requireInvite", false)) {
        errors.betaKeyError = strings.betaKeyRequired;
      }
    }
    if (! _.isEmpty(errors)) {
      this.setState(errors);
      return false;
    }
    return true;
  },
  handleSubmitLogin() {
    Meteor.loginWithPassword(
      this.state.username,
      this.state.password,
    (err) => {
      if (err) {
        this.error = err;

        const errorMap = {
          "403": {
            "User not found": () => {
              this.setState(errorBuilder({
                usernameError: strings.usernameRejected
              }));
            },
            "Incorrect password": () => {
              this.setState(errorBuilder({
                passwordError: strings.passwordRejected
              }));
            }
          },
          "too-many-requests": () => {
            this.setState(errorBuilder({
              generalError: true,
              waitError: true
            }));
          }
        };

        errorMapper(errorMap, err);
      } else {
        goBack(["/register"]);
      }
    });
  },
  handleSubmitRegister() {
    if (! this.state.tosAccepted) {
      this.setState(errorBuilder({
        generalError: true,
        tosAcceptedError: true
      }));
      return;
    }

    const userObject = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      profile: {
        key: this.state.betaKey
      }
    };

    Accounts.createUser(userObject, (err) => {
      if (err) {
        this.error = err;

        const errorMap = {
          "403": {
            "Username already exists.": () => {
              this.setState(errorBuilder({
                usernameError: strings.usernameTaken
              }));
            },
            "Email already exists.": () => {
              this.setState(errorBuilder({
                emailError: strings.emailTaken
              }));
            }
          },
          "invalid-username": () => {
            // Already handled by onChange validation.
          },
          "invalid-email": () => {
            // Already handled by onChange validation.
          },
          "invalid-betakey": () => {
            this.setState(errorBuilder({
              betaKeyError: strings.betaKeyRejected
            }));
          },
          "too-many-requests": () => {
            this.setState(errorBuilder({
              generalError: true,
              waitError: true
            }));
          }
        };

        errorMapper(errorMap, err);
      } else {
        goBack(["/login"]);
      }
    });
  },
  handleSubmit(e) {
    e.preventDefault();
    if (this.hasErrors() || ! this.enforceRequired()) {
      return;
    }
    if (! this.state.register) {
      this.handleSubmitLogin();
    } else {
      this.handleSubmitRegister();
    }
  },
  renderError() {
    if (this.state.generalError) {
      if (this.state.waitError) {
        return this.renderWait();
      } else if (this.state.tosAcceptedError) {
        return this.renderTosAcceptedError();
      }
    }
  },
  renderWait() {
    const path = FlowRouter.path("forgotPassword");
    return <Error>
      Slow down! Are you some sort of creepy hacker,
      or do you just need to <a href={path}>reset your password?</a>
      <br />
      You have to wait <Countdown ms={this.error.details.timeToReset} /> before trying again.
    </Error>;
  },
  renderTosAcceptedError() {
    return <Error>
      You need to accept the <a className="acceptTosLabel" href={FlowRouter.path("legal")}>Terms of Service</a>!
    </Error>;
  },
  renderForgot() {
    if (! this.state.register) {
      const url = FlowRouter.path("forgotPassword");
      return <a className="authLink" href={url}>Forgot Password?</a>;
    }
  },
  renderEmail() {
    if (this.state.register) {
      return <TextField
        id="email"
        name="email"
        label="Email"
        errorText={this.state.emailError}
        onChange={this.handleEmail}
      />;
    }
  },
  renderBetaKey() {
    if (this.state.register && _.get(Meteor.settings, "public.requireInvite", false)) {
      return <TextField
        id="betaKey"
        label="Beta Key"
        errorText={this.state.betaKeyError}
        onChange={this.handleBetaKey}
      />;
    }
  },
  renderAccept() {
    if (this.state.register) {
      return <div className="acceptTosContainer">
        <Checkbox
          id="acceptTos"
          label="I accept the"
          defaultChecked={this.state.tosAccepted}
          onCheck={this.handleAccept}
        />
        <a className="acceptTosLabel" href={FlowRouter.path("legal")}>Terms of Service</a>
      </div>;
    }
  },
  renderCancel() {
    if (this.state.register) {
      return <CancelButton
        onClick={this.handleCancel}
      />;
    }
  },
  render() {
    let title = "Login";
    if (this.state.register) {
      title = "Register";
    }
    setTitle(title);

    let left;
    if (! this.state.register) {
      left = <FlatButton
        label="Register"
        onClick={this.handleRegister}
      />;
    }

    return <Content className="loginForm">
      <header>
        <h2>{title}</h2>
      </header>
      {this.renderError()}
      <form onSubmit={this.handleSubmit}>
        <TextField
          id="username"
          name="username"
          label="Username"
          errorText={this.state.usernameError}
          onChange={this.handleUsername}
        />
        <TextField
          id="password"
          name="password"
          type="password"
          label="Password"
          errorText={this.state.passwordError}
          onChange={this.handlePassword}
        />
        {this.renderForgot()}
        {this.renderEmail()}
        {this.renderBetaKey()}
        {this.renderAccept()}
        <Actions left={left}>
          {this.renderCancel()}
          <SubmitButton
            type="submit"
            label={title}
            iconName="directions_bike"
          />
        </Actions>
      </form>
    </Content>;
  }
});
