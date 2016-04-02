import React from "react";
import isEmail from "validator/lib/isEmail";

import setTitle from "/imports/api/common/setTitle"
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
    passwordError: undefined
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
  componentWillReceiveProps(nextProps) {
    if (this.state.register) {
      if (nextProps.user !== this.props.user) {
        if (nextProps.user) {
          this.setState({
            usernameError: "This username is already taken!"
          });
        } else {
          this.setState({
            usernameError: undefined
          });
        }
      }
    }
  },
  handleUsername(e) {
    const username = e.target.value;

    this.setState({
      username: username
    });

    if (this.state.register) {
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

    if (! isEmail(email)) {
      this.setState({
        emailError: "Do you really thing that's a valid email?"
      });
    } else {
      this.setState({
        emailError: undefined
      });
    }
  },
  handleBetaKey(e) {
    this.setState({
      betaKey: e.target.value
    });
  },
  handleCancel(e) {
    if (this.state.register) {
      this.setState({
        register: false
      });
    } else {
      goBack();
    }
  },
  handleRegister(e) {
    this.setState({
      register: true
    });

    this.props.setUsername(this.state.username);
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
                usernameError: "You don't exist! Perhaps you'd like to register?"
              }));
            },
            "Incorrect password": () => {
              this.setState(errorBuilder({
                passwordError: "That isn't your password, dingus!"
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
      } else {
        goBack();
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
        prettyPrint(err);
      } else {
        goBack();
      }
    });
  },
  handleSubmit(e) {
    e.preventDefault();
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
