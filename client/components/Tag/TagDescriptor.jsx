TagDescriptor = React.createClass({
  renderAdjs(descriptor) {
    if (! _.isEmpty(descriptor.adjectives)) {
      return descriptor.adjectives.map((a) => {
        return <TagAdjective adjective={a} />;
      });
    }
  },
  render() {
    const descriptor = this.props.descriptor;
    return <li className="descriptor">
      {this.renderAdjs(descriptor)}
      <TagNoun noun={descriptor} />
    </li>;
  }
});
