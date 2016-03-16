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
b = `fluttershy: humanized, huge breasts`
c = `fluttershy: humanized, huge breasts`
This is bad!
diff(a, b) interprets `funny hat` as removed from b, so it doesn't make it into c.
Therefore, we need the noRemove flag, preventing this from happening.
Are there downsides to this approach? I hope not!

d2 = patch(d1, u2, d1)
u1 = `nia-teppelin: medium breasts`
u2 = `nia-teppelin: young, small breasts`
d1 = `nia-teppelin: medium breasts, happy`
d2 = `nia-teppelin: young, medium small breasts, happy`
This is bad too!
While our flattened approach to expanding implications is generally effective, in this case, we
need to differentiate between upstream and downstream.
bridged_net = diff(?) => `medium` removed from `breasts`, `small` added to `breasts`

Second attempt:
tagPatcher1(diff, target) -> output
  Simply apply diff to target.
  This is vastly superior to the logically dubious tagPatcher(a, b, a) pattern.
  frontends:
    tagPatcher(a, b, c)
tagPatcher2(diff, diffPreserve, target) -> output
  Apply diff to target without overwriting changes defined by diffPreserve.
  frontends:
    tagPatcherSyncImpl(u1, u2, d1)
tagPatcher3(diff1, diff2, diff3, target) -> output
  In this context...
  diff1 = diff(u1, u2) => `medium` removed from `breasts`, `small` added to `breasts`
  diff2 = diff(u1, d1) => added `happy`
  diff3 = diff(d1, u2) => `medium` removed from `breasts`, `small` added to `breasts`
*/

TagField = React.createClass({
  mixins: [ReactMeteorData],
  injectTags(base, props) {
    if (typeof props === "undefined") {
      props = this.props;
    }
    let tagStr = base || "";
    if (props.injectDescriptors) {
      tagStr = props.injectDescriptors + ", " + tagStr;
    }
    if (props.injectRoot) {
      tagStr = props.injectRoot + ": " + tagStr;
    }
    return tagStr;
  },
  getInitialState() {
    return {
      text: this.props.defaultValue || "",
      search: "",
      parsed: tagParser(this.injectTags(this.props.defaultValue))
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
  componentWillReceiveProps(nextProps) {
    if (this.props.injectDescriptors !== nextProps.injectDescriptors) {
      this.setState({
        parsed: tagParser(this.injectTags(this.state.text, nextProps))
      });
    }
  },
  handleParse(tagStr, doc) {
    doc.parsed = tagParser(this.injectTags(tagStr));
    doc.text = tagStr;

    if (! this.props.noExpand) {
      _.each(doc.parsed.subjects, (descriptors, rootNoun) => {
        const rootTag = Tags.findOne({ name: rootNoun });
        if (rootTag) {
          _.each(rootTag.condImplications, (impl, cond) => {
            if (_.has(doc.parsed.subjects[rootNoun], cond)) {
              const patched = tagPatcher(doc.parsed, impl, doc.parsed);
              doc.parsed = patched;
              doc.text = patched.text;
            }
          });
        }
      });
    }
  },
  afterChange(doc, value) {
    this.handleParse(value, doc);
    this.setState(doc);
    this.props.onChange(doc.text);
  },
  onChange(e) {
    const value = e.target.value;
    const split = value.split(/\s+/);
    const body = _.initial(split);
    const last = _.last(split);
    this.afterChange({
      search: last
    }, value);
  },
  onSelect(tag) {
    const split = this.state.text.split(/\s+/);
    const body = _.initial(split);
    const last = _.last(split);
    const text = (body.join(" ") + " " + tag.name + ": " + tag.implicationStr + ";").trim();
    this.afterChange({
      search: ""
    }, text);
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
