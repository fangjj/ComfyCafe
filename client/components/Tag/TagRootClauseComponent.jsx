TagRootClauseComponent = React.createClass({
  render() {
    var noun = this.props.noun;

    var adjectives;
    var showAdjectives = ! _.isEmpty(noun.adjectives);
    if (showAdjectives) {
      adjectives = <TagAdjectivesComponent adjectives={noun.adjectives} />;
    }

    var classes = "root";

    return <div className="root">
      {adjectives}
      <TagNounComponent noun={noun} />
    </div>;
  }
});
