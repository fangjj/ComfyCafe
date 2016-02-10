TagDescriptorComponent = React.createClass({
  render() {
    var descriptor = this.props.descriptor;
    var adjectives;
    var showAdjectives = ! _.isEmpty(descriptor.adjectives);
    if (showAdjectives) {
      adjectives = <TagAdjectivesComponent adjectives={descriptor.adjectives} />;
    }
    return <li className="descriptor">
      {adjectives}
      <TagNounComponent noun={descriptor} />
    </li>;
  }
});
