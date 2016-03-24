TagRoot = React.createClass({
  renderDescriptors(descriptors) {
    return _.map(_.omit(descriptors, ["_pre"]), (adjs, descNoun) => {
      return <TagDescriptor
        noun={descNoun}
        adjs={adjs}
        key={_.uniqueId()}
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
