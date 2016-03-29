import React from "react";

const iconMap = {
  original: "star",
  derivative: "device_hub",
  repost: "repeat"
};

const OriginalityIcon = React.createClass({
  render() {
    return <Icon
      className="originalityIcon"
      title={_.capitalize(this.props.originality)}
      style={{fontSize: 18}}
    >
      {iconMap[this.props.originality]}
    </Icon>;
  }
});

export default OriginalityIcon;
