let {
  TextField
} = mui;

TagField = React.createClass({
  mixins: [ReactMeteorData],
  condExpanded: {},
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
      const re = new RegExp("^" + _.escapeRegExp(this.state.search));
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
  componentWillMount() {
    this.condExpanded = this.props.condExpanded || {};
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.injectDescriptors !== nextProps.injectDescriptors) {
      this.setState({
        parsed: tagParser(this.injectTags(this.state.text, nextProps))
      });
    }

    if (this.props.inheritFrom !== nextProps.inheritFrom) {
      const patched = tagPatcher(
        this.props.inheritFrom,
        nextProps.inheritFrom,
        this.state.parsed
      );
      const stringifed = tagChunkStringify(
        patched,
        nextProps.injectRoot,
        tagDescriptorTokenizer(nextProps.injectDescriptors)
      );
      this.setState({
        text: stringifed,
        parsed: patched
      });
    }
  },
  hasExpanded(rootNoun, cond) {
    return _.has(this.condExpanded, rootNoun)
      && _.includes(this.condExpanded[rootNoun], cond);
  },
  handleParse(tagStr, doc) {
    doc.parsed = tagParser(this.injectTags(tagStr));
    doc.text = tagStr;

    if (! this.props.noExpand) {
      _.each(this.condExpanded, (expanded, rootNoun) => {
        if (! _.has(doc.parsed.subjects, rootNoun)) {
          prettyPrint(rootNoun, this.condExpanded);
          delete this.condExpanded[rootNoun];
        } else {
          _.each(expanded, (cond) => {
            if (! _.has(doc.parsed.subjects[rootNoun], cond)) {
              const idx = this.condExpanded[rootNoun].indexOf(cond);
              this.condExpanded[rootNoun].splice(idx, 1);
            }
          });
        }
      });

      _.each(doc.parsed.subjects, (descriptors, rootNoun) => {
        const rootTag = Tags.findOne({ name: rootNoun });
        if (rootTag) {
          _.each(rootTag.condImplications, (condImpl, cond) => {
            if (! this.hasExpanded(rootNoun, cond)
              && _.has(doc.parsed.subjects[rootNoun], cond)
            ) {
              const patched = tagPatcher(rootTag.implications, condImpl, doc.parsed);
              doc.parsed = patched;
              doc.text = patched.text;
              if (! _.has(this.condExpanded, rootNoun)) {
                this.condExpanded[rootNoun] = [cond];
              } else {
                this.condExpanded[rootNoun].push(cond);
              }
            }
          });
        }
      });
    }
  },
  afterChange(doc, value) {
    this.handleParse(value, doc);
    this.setState(doc);
    this.props.onChange(doc.text, doc.parsed, this.condExpanded);
  },
  onChange(e) {
    const value = e.target.value;
    const split = whiteSplit(value);
    const body = _.initial(split);
    const last = _.last(split);
    this.afterChange({
      search: last
    }, value);
  },
  onSelect(tag) {
    const split = whiteSplit(his.state.text);
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
