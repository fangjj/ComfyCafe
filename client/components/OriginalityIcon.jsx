const iconMap = {
  original: "star",
  derivative: "device_hub",
  repost: "repeat"
};

OriginalityIcon = React.createClass({
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
