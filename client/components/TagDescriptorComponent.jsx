TagDescriptorComponent = React.createClass({
  render() {
    var descriptor = this.props.descriptor;
    var adjectives;
    var showAdjectives = ! _.isEmpty(descriptor.adjectives) || this.props.editable;
    if (showAdjectives) {
      adjectives = <TagAdjectivesComponent adjectives={descriptor.adjectives} editable={this.props.editable} />;
    }
    return <li className="descriptor">
      {adjectives}
      <TagNounComponent noun={descriptor} editable={this.props.editable} />
    </li>;
  }
});
