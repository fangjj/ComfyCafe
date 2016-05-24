import _ from "lodash";
import React from "react";
import getCaretCoordinates from "textarea-caret";

import Tags from "/imports/api/tags/collection";
import getActiveToken from "/imports/api/common/getActiveToken";
import replaceActiveToken from "/imports/api/common/replaceActiveToken";
import Suggestions from "/imports/ui/components/Suggestions";
import TextField from "/imports/ui/components/TextField";

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      text: this.props.defaultValue || "",
      search: "",
      hideSuggestions: false
    };
  },
  getMeteorData() {
    const handle = expr(() => {
      if (this.props.constrainType) {
        return Meteor.subscribe("allTags", this.props.constrainType);
      } return Meteor.subscribe("allTags");
    });
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
  afterChange(doc, callback) {
    this.setState(doc, callback);
    this.props.onChange(doc.text);
  },
  getTextArea() {
    return $(this.refs.tfContainer).find("input:not([tabindex=-1])")[0];
  },
  onChange(e) {
    const tf = e.target;
    this.setState({
      caretCoords: getCaretCoordinates(tf, tf.selectionStart)
    });

    const value = e.target.value;
    const searchPair = getActiveToken(value, tf);
    const search = searchPair[0].trim();

    this.afterChange({
      text: value,
      search: search
    });
  },
  onSelect(tag) {
    const tf = this.getTextArea();
    const value = this.state.text;

    const replaced = replaceActiveToken(value, tag.name, tf);

    this.afterChange({
      text: replaced.text,
      search: ""
    }, replaced.moveNeedle);
  },
  onBlur(e) {
    _.delay(() => {
      this.setState({
        hideSuggestions: true
      });
    }, 100);

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  },
  onFocus(e) {
    this.setState({
      hideSuggestions: false
    });

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  },
  renderSuggestions() {
    if (! this.data.loading) {
      if (this.state.search && ! this.state.hideSuggestions) {
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
        label={this.props.label || this.props.floatingLabelText}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
      />
      {this.renderSuggestions()}
    </div>;
  }
});
