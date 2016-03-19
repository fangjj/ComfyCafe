let {
  Menu,
  MenuItem
} = mui;

Suggestions = React.createClass({
  renderSuggestions() {
    if (this.props.suggestions && this.props.suggestions.length) {
      return this.props.suggestions.map((s) => {
        return <MenuItem
          key={s._id}
          onTouchTap={() => {
            this.props.onSelect(s);
          }}
        >{s.name}</MenuItem>;
      });
    }
  },
  renderInner() {
    if (this.props.suggestions && this.props.suggestions.length) {
      return <Menu className="suggestions list">
        {this.renderSuggestions()}
      </Menu>;
    }
  },
  render() {
    return <div className="suggestionContainer">
      {this.renderInner()}
    </div>;
  }
});
