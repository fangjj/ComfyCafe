TagRootClauseComponent = React.createClass({
  render() {
    var noun = this.props.noun;

    var adjectives;
    var showAdjectives = ! _.isEmpty(noun.adjectives) || this.props.editable;
    if (showAdjectives) {
      adjectives = <TagAdjectivesComponent adjectives={noun.adjectives} editable={this.props.editable} />;
    }

    var classes = "root";
    if (this.props.new) {
      classes += " new";
    }

    return <div className="root">
      {adjectives}
      <TagNounComponent noun={noun} editable={this.props.editable} />
    </div>;
  }
});
