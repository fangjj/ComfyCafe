let {
  DropDownMenu,
  MenuItem
} = mui;

Suggestions = React.createClass({
  renderSuggestions() {
    if (this.props.suggestions && this.props.suggestions.length) {
      return this.props.suggestions.map((s) => {
        return <LinkButton key={s._id} primaryText={s.name} onTouchTap={() => {
          this.props.onSelect(s);
        }} />;
      });
    }
  },
  renderInner() {
    if (this.props.suggestions && this.props.suggestions.length) {
      return <ul className="suggestions list">
        {this.renderSuggestions()}
      </ul>;
    }
  },
  render() {
    return <div className="suggestionContainer">
      {this.renderInner()}
    </div>;
  }
});
