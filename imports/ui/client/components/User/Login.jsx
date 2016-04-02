import React from "react";

import goBack from "/imports/ui/client/utils/goBack"
import Colors from "/imports/ui/client/utils/colors"
import Content from "/imports/ui/client/components/Content";
import Actions from "/imports/ui/client/components/Actions";
import Error from "/imports/ui/client/components/Error";
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
    usernameError: undefined,
    passwordError: undefined
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
  handleUsername(e) {
    this.setState({
      username: e.target.value
    });
  },
  handlePassword(e) {
    this.setState({
      password: e.target.value
    });
  },
  handleCancel(e) {
    goBack();
  },
  handleSubmit(e) {
    e.preventDefault();
    Meteor.loginWithPassword(
      this.state.username,
      this.state.password,
    (err) => {
      if (err) {
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
              generalError: "Slow down! Are you some sort of creepy hacker, "
                + "or do you need to reset your password? "
                + _.last(err.reason.split(". "))
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
  renderError() {
    if (this.state.generalError) {
      return <Error>
        {this.state.generalError}
      </Error>;
    }
  },
  render() {
    const left = <FlatButton
      label="Register"
      labelStyle={{fontSize: "18px"}}
    />;
    return <Content className="loginForm">
      <header>
        <h2>Login</h2>
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
        <Actions left={left}>
          <CancelButton
            onTouchTap={this.handleCancel}
          />
          <SubmitButton
            type="submit"
            label="Login"
            iconName="directions_bike"
            onTouchTap={this.handleSubmit}
          />
        </Actions>
      </form>
    </Content>;
  }
});
