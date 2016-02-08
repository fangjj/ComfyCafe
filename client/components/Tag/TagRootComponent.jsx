TagRootComponent = React.createClass({
  componentWillMount() {
    this.ids = {};
    this.props.noun.descriptors.map((descriptor) => {
      this.ids[descriptor.name] = _.uniqueId();
    });
  },
  renderDescriptors(descriptors) {
    return descriptors.map((descriptor) => {
      return <TagDescriptorComponent
        descriptor={descriptor}
        key={this.ids[descriptor.name]}
      />;
    });
  },
  render() {
    var noun = this.props.noun;
    return <li>
      <TagRootClauseComponent noun={noun} />
      <ul>
        {this.renderDescriptors(noun.descriptors)}
      </ul>
    </li>;
  }
});
