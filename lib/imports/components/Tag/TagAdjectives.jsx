import React from "react";

const TagAdjective = React.createClass({
  render() {
    return <a
      className="taglet adj"
      href={"/q/" + this.props.adj + "+" + this.props.noun}
    >{this.props.adj}</a>;
  }
});

export default TagAdjective;
