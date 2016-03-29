import _ from "lodash";
import React from "react";

import TagNoun from "./TagNoun";
import TagAdjective from "./TagAdjective";

const TagDescriptor = React.createClass({
  componentWillMount() {
    this.prefix = _.uniqueId();
  },
  renderAdjs() {
    if (! _.isEmpty(this.props.adjs)) {
      return this.props.adjs.map((a) => {
        return <TagAdjective
          adj={a}
          noun={this.props.noun}
          key={_.uniqueId()}
          key={this.prefix + "_adj_" + a}
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

export default TagDescriptor;
