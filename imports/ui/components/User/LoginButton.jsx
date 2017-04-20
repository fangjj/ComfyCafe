import React from "react";

import SubmitButton from "/imports/ui/components/Button/SubmitButton";

export default React.createClass({
  render() {
    const path = FlowRouter.path("login");
    return <a href={path}>
      <SubmitButton
        label="Login"
        iconName="directions_bike"
        onClick={this.goLogin}
      />
    </a>;
  }
});
