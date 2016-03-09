TagRoot = React.createClass({
  componentWillMount() {
    this.ids = {};
    this.props.noun.descriptors.map((descriptor) => {
      this.ids[descriptor.name] = _.uniqueId();
    });
  },
  renderDescriptors(descriptors) {
    return descriptors.map((descriptor) => {
      return <TagDescriptor
        descriptor={descriptor}
        key={this.ids[descriptor.name]}
      />;
    });
  },
  render() {
    var noun = this.props.noun;
    return <li>
      <TagRootClause noun={noun} />
      <ul>
        {this.renderDescriptors(noun.descriptors)}
      </ul>
    </li>;
  }
});
