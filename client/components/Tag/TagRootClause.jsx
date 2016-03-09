TagRootClause = React.createClass({
  render() {
    const noun = this.props.noun;
    return <div className="root">
      <TagNoun noun={noun} />
    </div>;
  }
});
