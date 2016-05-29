import _ from "lodash";
import React from "react";
import getCaretCoordinates from "textarea-caret";

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
    const handle = Meteor.subscribe("userSuggestions", this.state.search);
    const doc = expr(() => {
      if (this.state.search) {
        const re = new RegExp("^" + _.escapeRegExp(this.state.search));
        return { $or: [
          { username: re },
          { normalizedUsername: re },
          { "profile.displayName": re }
        ] };
      } return {};
    });
    return {
      loading: ! handle.ready(),
      users: Meteor.users.find(
        doc,
        { fields: { username: 1 } }
      ).fetch()
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
    this.setState({ caretCoords: getCaretCoordinates(tf, tf.selectionStart) });

    const value = e.target.value;
    const searchPair = getActiveToken(value, tf);
    const search = searchPair[0].trim();

    this.afterChange({
      text: value,
      search: search
    });
  },
  onSelect(user) {
    const tf = this.getTextArea();
    const value = this.state.text;

    const replaced = replaceActiveToken(value, user.name, tf);

    this.afterChange({
      text: replaced.text,
      search: ""
    }, replaced.moveNeedle);
  },
  onBlur(e) {
    _.delay(() => {
      this.setState({ hideSuggestions: true });
    }, 100);

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  },
  onFocus(e) {
    this.setState({ hideSuggestions: false });
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
          suggestions={_.map(this.data.users, (user) => {
            return {
              _id: user._id,
              name: _.get(user, "profile.displayName", user.username)
            };
          })}
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
        id={this.props.id}
        value={this.state.text}
        hintText={this.props.hintText}
        label={this.props.label}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
      />
      {this.renderSuggestions()}
    </div>;
  }
});
