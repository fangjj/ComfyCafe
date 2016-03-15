TagRoot = React.createClass({
  renderDescriptors(descriptors) {
    return _.map(descriptors, (adjs, descNoun) => {
      return <TagDescriptor
        noun={descNoun}
        adjs={adjs}
        key={_.uniqueId()}
      />;
    });
  },
  renderInjected() {
    if (this.props.injectDescriptors) {
      const rawDescriptors = this.props.injectDescriptors.split(/\s*,\s*/);
      let descriptors = {};
      _.each(rawDescriptors, (raw) => {
        const split = raw.split(/\s+/);
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
