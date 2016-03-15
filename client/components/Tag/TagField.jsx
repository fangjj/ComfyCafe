let {
  TextField
} = mui;

/*
Conditional expansions are rather tricky, but fortunately, we have a good set of tools!

Since a live parsing preview (and validation) is important regardless, we'll parse a tree onChange.
We already have the tag object for our rootNoun, and thus the list of conditions. Checking if a
condition is met is fairly easy, and can be done through the subjects obj.

When a condition's met, what do we do?
patched = tagPatcher(parsed, condImpl, parsed, { noRemove: true })
See what I meant by "good set of tools"? Granted, tagPatcher(a, b, a) could be optimized...

We still need to apply our patched tag doc, though. This is stupidly easy, since we just need to
shove patched.text into our state. Pretty easy, right?

c = patch(a, b, a)
a = `fluttershy: funny hat`
b = `fluttershy: huge breasts`
c = `fluttershy: huge breasts`
This is bad!
diff(a, b) interprets `funny hat` as removed from b, so it doesn't make it into c.
Therefore, we need the noRemove flag, preventing this from happening.
Are there downsides to this approach? I hope not!
*/

TagField = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      text: this.props.defaultValue || "",
      search: "",
      parsed: tagParser(this.props.defaultValue || "")
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
    let text = this.state.text;
    let clean = true;

    const rootNoun = "fluttershy";
    if (_.has(parsed.subjects, rootNoun)) {
      const rootTag = Tags.findOne({ name: rootNoun });
      if (rootTag) {
        _.each(rootTag.condImplications, (impl, cond) => {
          if (_.has(parsed.subjects[rootNoun], cond)) {
            clean = false;
            const patched = tagPatcher(parsed, impl, parsed, { noRemove: true });
            text = patched.text;
            this.setState({
              parsed: patched,
              text: patched.text
            });
          }
        });
      }
    }

    if (clean) {
      this.setState({
        parsed: parsed
      });
    }

    this.props.onChange(text);
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
    this.handleParse(value);
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
    this.handleParse(text);
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
