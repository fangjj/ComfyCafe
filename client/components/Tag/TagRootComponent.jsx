TagRootComponent = React.createClass({
  renderDescriptors(descriptors) {
    return descriptors.map((descriptor) => {
      return <TagDescriptorComponent descriptor={descriptor} />;
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
