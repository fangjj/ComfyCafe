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
    const handle = () => {
      if (this.props.constrainType) {
        return Meteor.subscribe("allTags", this.props.constrainType);
      } return Meteor.subscribe("allTags");
    }();
    let doc = {};
    if (this.props.constrainType) {
      doc.type = this.props.constrainType;
    }
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
        { fields: { name: 1, implicationStr: 1, origin: 1 } }
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
    const tokens = fancySplit(value);
    // we have our lovely needle
    const needle = tf.selectionStart;
    // now find what token needle touches
    // needle touches token if...
    // - needle is at start of token
    // - needle is in token
    // - needle is at end of token
    const searchPair = _.find(tokens, (pair, index) => {
      const token = pair[0];
      const offset = pair[1];
      return _.inRange(needle, offset, offset + token.length + 1); // [start, end)
    });
    const search = searchPair[0].trim();

    this.afterChange({
      text: value,
      search: search
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
