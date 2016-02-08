TagRootComponent = React.createClass({
  renderDescriptors(descriptors) {
    var self = this;
    return descriptors.map((descriptor) => {
      return <TagDescriptorComponent descriptor={descriptor} editable={self.props.editable} />;
    });
  },
  render() {
    var noun = this.props.noun;

    var adjectives;
    var showAdjectives = ! _.isEmpty(noun.adjectives) || this.props.editable;
    if (showAdjectives) {
      adjectives = <TagAdjectivesComponent adjectives={noun.adjectives} editable={this.props.editable} />;
    }

    var addNoun;
    if (this.props.editable) {
      addNoun = <li className="descriptor">
        <a className="taglet noun addNoun" title="Add noun"><i className="material-icons">add</i></a>
      </li>;
    }

    return <li>
      <div className="root">
        {adjectives}
        <TagNounComponent noun={noun} editable={this.props.editable} />
      </div>
      <ul>
        {this.renderDescriptors(noun.descriptors)}
        {addNoun}
      </ul>
    </li>;
  }
});
