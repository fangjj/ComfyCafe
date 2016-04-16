import _ from "lodash";
import React from "react";

import { tagDescriptorTokenizer } from "/imports/api/tags/tokenizer";
import TagRootClause from "./TagRootClause";
import TagDescriptor from "./TagDescriptor";

export default React.createClass({
  componentWillMount() {
    this.prefix = _.uniqueId();
  },
  renderDescriptors(descriptors) {
    return _.map(_.omit(descriptors, ["_pre"]), (adjs, descNoun) => {
      return <TagDescriptor
        noun={descNoun}
        adjs={adjs}
        key={this.prefix + "_desc_" + descNoun}
      />;
    });
  },
  renderInjected() {
    if (this.props.injectDescriptors) {
      const rawDescriptors = tagDescriptorTokenizer(this.props.injectDescriptors);
      let descriptors = {};
      _.each(rawDescriptors, (raw) => {
        const split = whiteSplit(raw);
        descriptors[split.pop()] = split;
      });
      return this.renderDescriptors(descriptors);
    }
  },
  render() {
    return <li>
      <TagRootClause noun={this.props.noun} />
      <ul>
        {this.renderInjected()}
        {this.renderDescriptors(this.props.descriptors)}
      </ul>
    </li>;
  }
});
