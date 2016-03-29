import React from "react";

const iconMap = {
  public: "public",
  friends: "people",
  unlisted: "visibility_off"
};

PrivacyIcon = React.createClass({
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
