let {
  TextField
} = mui;

TagInlineField = React.createClass({
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
        { fields: { name: 1 } }
      ).fetch(),
      currentUser: Meteor.user()
    };
  },
  afterChange(doc) {
    this.setState(doc);
    this.props.onChange(doc.text);
  },
  onChange(e) {
    const tf = $(this.refs.tfContainer).find("input:not([tabindex=-1])")[0];
    this.setState({
      caretCoords: getCaretCoordinates(tf, tf.selectionStart)
    });

    const value = e.target.value;
    const split = whiteSplit(value);
    const body = _.initial(split);
    const last = _.last(split);
    this.afterChange({
      text: value,
      search: last
    });
  },
  onSelect(tag) {
    const split = whiteSplit(this.state.text);
    const body = _.initial(split);
    const last = _.last(split);
    let text = (body.join(" ") + " " + tag.name + (this.props.delim || "")).trim();
    this.afterChange({
      text: text,
      search: ""
    });
  },
  renderSuggestions() {
    if (! this.data.loading) {
      if (this.state.search) {
        const anchorCoords = $(this.refs.tfContainer).position();
        if (this.props.floatingLabelText) {
          anchorCoords.top += 36; // Account for margin
        } else {
          anchorCoords.top += 16;
        }
        return <Suggestions
          suggestions={this.data.tags}
          anchorCoords={anchorCoords}
          caretCoords={this.state.caretCoords}
          onSelect={this.onSelect}
        />;
      }
    }
  },
  render() {
    return <div ref="tfContainer">
      <TextField
        value={this.state.text}
        hintText={this.props.hintText}
        floatingLabelText={this.props.floatingLabelText}
        floatingLabelStyle={{fontSize: "20px"}}
        fullWidth={true}
        onChange={this.onChange}
      />
      {this.renderSuggestions()}
    </div>;
  }
});
