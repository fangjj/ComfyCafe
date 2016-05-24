import _ from "lodash";
import React from "react";

import TagNoun from "./TagNoun";
import TagAdjective from "./TagAdjective";

export default React.createClass({
  renderAdjs() {
    if (! _.isEmpty(this.props.adjs)) {
      return this.props.adjs.map((a) => {
        return <TagAdjective
          adj={a}
          noun={this.props.noun}
          key={"adj " + a}
        />;
      });
    }
  },
  render() {
    return <li className="descriptor">
      {this.renderAdjs()}
      <TagNoun noun={this.props.noun} />
    </li>;
  }
});
