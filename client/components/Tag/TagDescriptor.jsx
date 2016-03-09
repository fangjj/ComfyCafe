TagDescriptor = React.createClass({
  render() {
    var descriptor = this.props.descriptor;
    var adjectives;
    var showAdjectives = ! _.isEmpty(descriptor.adjectives);
    if (showAdjectives) {
      adjectives = <TagAdjective adjectives={descriptor.adjectives} />;
    }
    return <li className="descriptor">
      {adjectives}
      <TagNoun noun={descriptor} />
    </li>;
  }
});
