Suggestions = React.createClass({
  renderSuggestions() {
    if (this.props.suggestions && this.props.suggestions.length) {
      return this.props.suggestions.map((s) => {
        return <li
          key={s._id}
          onTouchTap={() => {
            this.props.onSelect(s);
          }}
        >{s.name}</li>;
      });
    }
  },
  render() {
    return <ul className="suggestions list">
      {this.renderSuggestions()}
    </ul>;
  }
});
