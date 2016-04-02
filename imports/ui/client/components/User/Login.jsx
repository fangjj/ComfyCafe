import React from "react";

import goBack from "/imports/ui/client/utils/goBack"
import Content from "/imports/ui/client/components/Content";
import Actions from "/imports/ui/client/components/Actions";
import CancelButton from "/imports/ui/client/components/Button/CancelButton";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

import {
  TextField,
  Checkbox,
  FlatButton
} from "material-ui";

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
    Meteor.loginWithPassword(this.state.username, this.state.password, () => {
      goBack();
    });
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
      <form onSubmit={this.handleSubmit}>
        <TextField
          name="username"
          floatingLabelText="Username"
          floatingLabelStyle={{fontSize: "20px"}}
          fullWidth={true}
          onChange={this.handleUsername}
        />
        <TextField
          name="password"
          type="password"
          floatingLabelText="Password"
          floatingLabelStyle={{fontSize: "20px"}}
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
