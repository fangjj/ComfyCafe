TagRootComponent = React.createClass({
  componentWillMount() {
    var state = {};
    this.props.noun.descriptors.map((descriptor) => {
      state[descriptor.name + "Id"] = _.uniqueId();
    });
    this.setState(state);
  },
  renderDescriptors(descriptors) {
    return descriptors.map((descriptor) => {
      return <TagDescriptorComponent
        descriptor={descriptor}
        key={this.state[descriptor.name + "Id"]}
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
