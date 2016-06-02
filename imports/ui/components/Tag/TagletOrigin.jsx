import React from "react";

const TagletOrigin = React.createClass({
  render() {
    const name = this.props.name;
    return <a
      className="taglet origin"
      href={"/q/from+" + name}
    >{name}</a>;
  }
});

export default TagletOrigin;
