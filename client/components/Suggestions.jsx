Suggestions = React.createClass({
  renderSuggestions() {
    if (this.props.suggestions && this.props.suggestions.length) {
      return this.props.suggestions.map((s) => {
        return <li key={_.uniqueId()}>{s}</li>;
      });
    }
  },
  render() {
    return <ul>
      {this.renderSuggestions()}
    </ul>;
  }
});
