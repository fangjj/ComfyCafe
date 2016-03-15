TagRoot = React.createClass({
  renderDescriptors() {
    return _.map(this.props.descriptors, (adjs, descNoun) => {
      return <TagDescriptor
        noun={descNoun}
        adjs={adjs}
        key={_.uniqueId()}
      />;
    });
  },
  render() {
    return <li>
      <TagRootClause noun={this.props.noun} />
      <ul>
        {this.renderDescriptors()}
      </ul>
    </li>;
  }
});
