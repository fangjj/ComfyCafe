let {
  TextField
} = mui;

/*
Conditional expansions are rather tricky, but fortunately, we have a good set of tools!

Since a live parsing preview (and validation) is important regardless, we'll parse a tree onChange.
We already have the tag object for our rootNoun, and thus the list of conditions. Checking if a
condition is met is fairly easy, and can be done through the subjects obj.

When a condition's met, what do we do?
patched = tagPatcher(parsed, condImpl, parsed)
See what I meant by "good set of tools"? Granted, tagPatcher(a, b, a) could be optimized...

We still need to apply our patched tag doc, though. This is stupidly easy, since we just need to
shove patched.text into our state. Pretty easy, right?
*/

TagField = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      text: this.props.defaultValue || "",
      search: "",
      parsed: this.handleParse(this.props.defaultValue || "")
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
  handleParse(tagStr) {
    const parsed = tagParser(tagStr);

    return parsed;
  },
  onChange(e) {
    const value = e.target.value;
    const split = value.split(/\s+/);
    const body = _.initial(split);
    const last = _.last(split);
    this.setState({
      text: value,
      search: last,
      parsed: this.handleParse(value)
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
      search: "",
      parsed: this.handleParse(text)
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
  renderTagTree() {
    if (! _.isEmpty(this.state.parsed)) {
      return <TagTree tags={this.state.parsed} />;
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
        fullWidth={true}
        onChange={this.onChange}
      />
      {this.renderSuggestions()}
      {this.renderTagTree()}
    </div>;
  }
});
