import _ from "lodash";
import React from "react";

import Icon from "./Icon";

const iconMap = {
  public: "public",
  friends: "people",
  unlisted: "visibility_off"
};

const PrivacyIcon = React.createClass({
  render() {
    return <Icon
      className="privacyIcon"
      title={_.capitalize(this.props.privacy)}
      style={{fontSize: 18}}
    >
      {iconMap[this.props.privacy]}
    </Icon>;
  }
});

export default PrivacyIcon;
