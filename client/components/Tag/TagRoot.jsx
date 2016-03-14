TagRoot = React.createClass({
  componentWillMount() {
    this.ids = {};
    _.each(this.props.descriptors, (adj, descNoun) => {
      this.ids[descNoun] = _.uniqueId();
    });
  },
  renderDescriptors() {
    return _.map(this.props.descriptors, (adjs, descNoun) => {
      return <TagDescriptor
        noun={descNoun}
        adjs={adjs}
        key={this.ids[descNoun]}
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
