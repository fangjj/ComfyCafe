let {
  TextField
} = mui;

TagField = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      text: this.props.defaultValue || "",
      suggestions: []
    };
  },
  getMeteorData() {
    const handle = Meteor.subscribe("allTags");
    return {
      loading: ! handle.ready(),
      tags: Tags.find({}, { fields: { name: 1, implicationStr: 1 } }).fetch(),
      currentUser: Meteor.user()
    };
  },
  onChange(e) {
    const value = e.target.value;
    const split = value.split(/\s+/);
    const body = _.initial(split);
    const last = _.last(split);
    if (last) {
      this.setState({
        text: value,
        suggestions: _.compact(
          _.map(this.data.tags, (tag) => {
            if (tag.name.substr(0, last.length) === last) {
              return tag;
            }
          })
        )
      });
    } else {
      this.setState({
        text: value,
        suggestions: []
      });
    }
    this.props.onChange(value);
  },
  onSelect(tag) {
    const split = this.state.text.split(/\s+/);
    const body = _.initial(split);
    const last = _.last(split);
    const text = (body.join(" ") + " " + tag.name + ": " + tag.implicationStr + ";").trim();
    this.setState({
      text: text,
      suggestions: []
    });
    this.props.onChange(text);
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
      <Suggestions
        suggestions={this.state.suggestions}
        onSelect={this.onSelect}
      />
    </div>;
  }
});
