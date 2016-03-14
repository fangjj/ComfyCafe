let {
  TextField
} = mui;

TagField = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      text: this.props.defaultValue || "",
      search: ""
    };
  },
  getMeteorData() {
    const handle = Meteor.subscribe("allTags");
    let doc = {};
    if (this.state.search) {
      const re = new RegExp("^" + this.state.search);
      doc = { $or: [
        { name: re },
        { aliases: re }
      ] };
    }
    return {
      loading: ! handle.ready(),
      tags: Tags.find(
        doc,
        { fields: { name: 1, implicationStr: 1 } }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },
  onChange(e) {
    const value = e.target.value;
    const split = value.split(/\s+/);
    const body = _.initial(split);
    const last = _.last(split);
    this.setState({
      text: value,
      search: last
    });
    this.props.onChange(value);
  },
  onSelect(tag) {
    const split = this.state.text.split(/\s+/);
    const body = _.initial(split);
    const last = _.last(split);
    const text = (body.join(" ") + " " + tag.name + ": " + tag.implicationStr + ";").trim();
    this.setState({
      text: text,
      search: ""
    });
    this.props.onChange(text);
  },
  renderSuggestions() {
    if (this.state.search) {
      return <Suggestions
        suggestions={this.data.tags}
        onSelect={this.onSelect}
      />;
    }
  },
  render() {
    if (this.data.loading) {
      return <InlineLoadingSpinner />;
    }

    return <div>
      <TextField
        value={this.state.text}
        floatingLabelText={this.props.floatingLabelText || "Tags"}
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={1}
        rowsMax={5}
        onChange={this.onChange}
        fullWidth={true}
      />
      {this.renderSuggestions()}
    </div>;
  }
});
