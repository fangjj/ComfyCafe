import React from "react";

TagletAuthor = React.createClass({
  render() {
    const name = this.props.name;
    return <a
      className="taglet author"
      href={"/q/by+" + name}
    >{name}</a>;
  }
});
