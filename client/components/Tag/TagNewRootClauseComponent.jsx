TagNewRootClauseComponent = React.createClass({
  render() {
    return <div className="root new">
      <TagAdjectivesComponent new={true} editable={this.props.editable} />
      <TagNounComponent new={true} editable={this.props.editable} />
    </div>;
  }
});
