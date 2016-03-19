let {
  DropDownMenu,
  MenuItem
} = mui;

Suggestions = React.createClass({
  lookup: {},
  getInitialState() {
    return {
      selected: undefined
    };
  },
  handleSelect(event, index, value) {
    this.setState({
      selected: value
    });
    this.props.onSelect(this.lookup[value]);
  },
  renderSuggestions() {
    if (this.props.suggestions && this.props.suggestions.length) {
      return this.props.suggestions.map((s) => {
        this.lookup[s._id] = s;
        return <MenuItem
          key={s._id}
          value={s._id}
          primaryText={s.name}
        />;
      });
    }
  },
  renderInner() {
    if (this.props.suggestions && this.props.suggestions.length) {
      return <DropDownMenu
        className="suggestions"
        value={this.state.selected}
        openImmediately={true}
        onChange={this.handleSelect}
      >
        {this.renderSuggestions()}
      </DropDownMenu>;
    }
  },
  render() {
    return <div className="suggestionContainer">
      {this.renderInner()}
    </div>;
  }
});
