import _ from "lodash";
import React from "react";

import setTitle from "/imports/api/common/setTitle"
import {
  validateUsername,
  validateEmail
} from "/imports/api/users/validators";
import goBack from "/imports/ui/client/utils/goBack"
import Colors from "/imports/ui/client/utils/colors"
import Content from "/imports/ui/client/components/Content";
import Actions from "/imports/ui/client/components/Actions";
import Error from "/imports/ui/client/components/Error";
import Countdown from "/imports/ui/client/components/Countdown";
import CancelButton from "/imports/ui/client/components/Button/CancelButton";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

import {
  TextField,
  Checkbox,
  FlatButton
} from "material-ui";

function errorBuilder(obj) {
  const base = {
    generalError: undefined,
    waitError: undefined,
    usernameError: undefined,
    passwordError: undefined,
    emailError: undefined,
    betaKeyError: undefined
  };

  _.each(obj, (v, k) => {
    base[k] = v;
  });

  return base;
}

function errorMapper(errorMap, err) {
  const subMap = errorMap[err.error];
  if (subMap) {
    if (_.isFunction(subMap)) {
      subMap();
    } else {
      const func = subMap[err.reason];
      if (func) {
        func();
      } else {
        prettyPrint(err);
      }
    }
  } else {
    prettyPrint(err);
  }
}

const strings = {
  usernameTaken: "This username is already taken!",
  usernameInvalid: "Usernames cannot contain spaces!",
  usernameRequired: "Just who the hell do you think you are?",
  usernameRejected: "You don't exist! Perhaps you'd like to register?",
  passwordRequired: "Password, please!",
  passwordRejected: "That isn't your password, dingus!",
  emailInvalid: "Do you really thing that's a valid email?",
  emailRequired: "Are you some sort of privacy nut?",
  emailTaken: "This email address is already taken!",
  betaKeyRequired: "You can't just barge in uninvited!",
  betaKeyRejected: "That key doesn't exist. Are you trying to trick me?"
};

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      register: false
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
    if (window.location.pathname === "/register") {
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
      password: e.target.value
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
      if (! this.state.betaKey) {
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
      }
    }
  },
  renderWait() {
    const path = FlowRouter.path("forgot-password");
    return <Error>
      Slow down! Are you some sort of creepy hacker,
      or do you just need to <a href={path}>reset your password?</a>
      <br />
      You have to wait <Countdown ms={this.error.details.timeToReset} /> before trying again.
    </Error>;
  },
  renderEmail() {
    if (this.state.register) {
      return <TextField
        name="email"
        value={this.state.email}
        floatingLabelText="Email"
        floatingLabelStyle={{fontSize: "20px"}}
        errorText={this.state.emailError}
        errorStyle={{
          fontSize: "16px",
          color: Colors.poisonPink
        }}
        fullWidth={true}
        onChange={this.handleEmail}
      />;
    }
  },
  renderBetaKey() {
    if (this.state.register) {
      return <TextField
        value={this.state.betaKey}
        floatingLabelText="Beta Key"
        floatingLabelStyle={{fontSize: "20px"}}
        errorText={this.state.betaKeyError}
        errorStyle={{
          fontSize: "16px",
          color: Colors.poisonPink
        }}
        fullWidth={true}
        onChange={this.handleBetaKey}
      />;
    }
  },
  renderCancel() {
    if (this.state.register) {
      return <CancelButton
        onTouchTap={this.handleCancel}
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
        labelStyle={{fontSize: "18px"}}
        onTouchTap={this.handleRegister}
      />;
    }

    return <Content className="loginForm">
      <header>
        <h2>{title}</h2>
      </header>
      {this.renderError()}
      <form onSubmit={this.handleSubmit}>
        <TextField
          name="username"
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
        <TextField
          name="password"
          type="password"
          floatingLabelText="Password"
          floatingLabelStyle={{fontSize: "20px"}}
          errorText={this.state.passwordError}
          errorStyle={{
            fontSize: "16px",
            color: Colors.poisonPink
          }}
          fullWidth={true}
          onChange={this.handlePassword}
        />
        {this.renderEmail()}
        {this.renderBetaKey()}
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
