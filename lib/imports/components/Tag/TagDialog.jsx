import React from "react";

import {
  Dialog,
  FlatButton,
  RaisedButton
} from "material-ui";

const defaultState = {
  name: "",
  tagType: "generic",
  definition: "",
  aliases: "",
  origin: "",
  safety: 0,
  extends: "",
  implications: "",
  implicationsParsed: {},
  condImplications: {}
};

function condImplWrap(condImpl) {
  let formatted = {};
  _.each(condImpl, (impl, cond) => {
    formatted[_.uniqueId()] = [cond, tagSubjectTokenizer(impl.text)[1]];
  });
  return formatted;
}

const TagDialog = React.createClass({
  getInitialState() {
    if (this.props.tag) {
      return {
        name: this.props.tag.name,
        tagType: this.props.tag.type,
        definition: this.props.tag.definition,
        aliases: this.props.tag.aliasStr,
        origin: this.props.tag.origin,
        safety: this.props.tag.safety,
        extends: (this.props.tag.extends || []).join(", ").trim(),
        implications: this.props.tag.implicationStr,
        implicationsParsed: this.props.tag.implications
          || defaultState.implicationsParsed,
        condImplications: condImplWrap(this.props.tag.condImplications)
          || defaultState.condImplications
      };
    } else {
      return defaultState;
    }
  },
  handleName(event) {
    this.setState({
      name: event.target.value,
      nameChanged: true
    });
  },
  handleTagType(event, index, value) {
    this.setState({tagType: value});
  },
  handleDefinition(event) {
    this.setState({definition: event.target.value});
  },
  handleAliases(event) {
    this.setState({aliases: event.target.value});
  },
  handleExtends(value) {
    this.setState({extends: value});
  },
  handleOrigin(value) {
    this.setState({origin: value});
  },
  handleSafety(event, index, value) {
    this.setState({safety: parseInt(value)});
  },
  handleImplications(tagStr, parsed) {
    this.setState({
      implications: tagStr,
      implicationsParsed: parsed
    });
  },
  handleCondImplications(id, cond, impl) {
    let obj = _.clone(this.state.condImplications);
    obj[id] = [cond, impl];
    this.setState({condImplications: obj});
  },
  handleSubmit() {
    this.props.handleSubmit({
      name: this.state.name,
      type: this.state.tagType,
      definition: this.state.definition,
      aliases: this.state.aliases,
      origin: this.state.origin,
      safety: this.state.safety,
      extends: this.state.extends,
      implications: this.state.implications,
      condImplications: this.state.condImplications
    });

    if (! this.props.tag) {
      this.setState(defaultState);
    }

    const path = FlowRouter.path("tag", {tagName: this.state.name});
    FlowRouter.go(path);
  },
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        labelStyle={{fontSize: "18px"}}
        secondary={true}
        onTouchTap={this.props.handleClose}
      />,
      <FlatButton
        label="Submit"
        labelStyle={{fontSize: "18px"}}
        primary={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return <Dialog
      className="tagForm"
      title={this.props.title}
      actions={actions}
      modal={this.props.modal}
      open={this.props.open}
      autoScrollBodyContent={true}
      onRequestClose={this.props.handleClose}
    >
      <TagInnerForm
        name={this.state.name}
        handleName={this.handleName}
        tagType={this.state.tagType}
        handleTagType={this.handleTagType}
        aliases={this.state.aliases}
        handleAliases={this.handleAliases}
        origin={this.state.origin}
        handleOrigin={this.handleOrigin}
        definition={this.state.definition}
        handleDefinition={this.handleDefinition}
        safety={this.state.safety}
        handleSafety={this.handleSafety}
        extends={this.state.extends}
        handleExtends={this.handleExtends}
        implications={this.state.implications}
        handleImplications={this.handleImplications}
        inheritFrom={this.state.implicationsParsed}
        condImplications={this.state.condImplications}
        handleCondImplications={this.handleCondImplications}
      />
    </Dialog>;
  }
});

export default TagDialog;
