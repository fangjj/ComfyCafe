import React from "react";

TagAdjective = React.createClass({
  render() {
    return <a
      className="taglet adj"
      href={"/q/" + this.props.adj + "+" + this.props.noun}
    >{this.props.adj}</a>;
  }
});
