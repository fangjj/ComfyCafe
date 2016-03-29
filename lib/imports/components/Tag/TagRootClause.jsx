import React from "react";

const TagRootClause = React.createClass({
  render() {
    return <div className="root">
      <TagNoun noun={this.props.noun} />
    </div>;
  }
});

export default TagRootClause;
