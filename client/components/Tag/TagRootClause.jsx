TagRootClause = React.createClass({
  render() {
    var noun = this.props.noun;

    var adjectives;
    var showAdjectives = ! _.isEmpty(noun.adjectives);
    if (showAdjectives) {
      adjectives = <TagAdjective adjectives={noun.adjectives} />;
    }

    var classes = "root";

    return <div className="root">
      {adjectives}
      <TagNoun noun={noun} />
    </div>;
  }
});
