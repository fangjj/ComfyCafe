import _ from "lodash";
import React from "react";

import "/imports/api/tags/methods";
import { tagSubjectTokenizer } from "/imports/api/tags/tokenizer";
import TagTypeSelector from "./TagTypeSelector";
import TagInlineField from "./TagInlineField";
import TagField from "./TagField";
import TagMultiField from "./TagMultiField";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import TextArea from "/imports/ui/client/components/TextArea";
import SafetySelector from "/imports/ui/client/components/SafetySelector";
import Icon from "/imports/ui/client/components/Daikon/Icon";

function condImplWrap(condImpl) {
  const formatted = {};
  _.each(condImpl, (impl, cond) => {
    formatted[_.uniqueId()] = [cond, tagSubjectTokenizer(impl.text)[1]];
  });
  return formatted;
}

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

export default React.createClass({
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
  handleName(e) {
    this.setState({
      name: e.target.value,
      nameChanged: true
    });
  },
  handleTagType(e, index, value) {
    this.setState({ tagType: value });
  },
  handleDefinition(e) {
    this.setState({ definition: e.target.value });
  },
  handleAliases(e) {
    this.setState({ aliases: e.target.value });
  },
  handleExtends(value) {
    this.setState({ extends: value });
  },
  handleOrigin(value) {
    this.setState({ origin: value });
  },
  handleSafety(value) {
    this.setState({ safety: parseInt(value) });
  },
  handleImplications(tagStr, parsed) {
    this.setState({
      implications: tagStr,
      implicationsParsed: parsed
    });
  },
  handleCondImplications(id, cond, impl) {
    const obj = _.clone(this.state.condImplications);
    obj[id] = [cond, impl];
    this.setState({ condImplications: obj });
  },
  handleSubmit() {
    const data = {
      name: this.state.name,
      type: this.state.tagType,
      definition: this.state.definition,
      aliases: this.state.aliases,
      origin: this.state.origin,
      safety: this.state.safety,
      extends: this.state.extends,
      implications: this.state.implications,
      condImplications: this.state.condImplications
    };

    if (! this.props.tag) {
      Meteor.call("addTag", data, (err, name) => {
        if (err) {
          prettyPrint(err);
        } else {
          const path = FlowRouter.path("tag", {tagName: this.state.name});
          FlowRouter.go(path);
        }
      });
    } else {
      Meteor.call("updateTag", this.props.tag._id, data, (err) => {
        if (err) {
          prettyPrint(err);
        }
      });
    }
  },
  renderOrigin() {
    if (! _.includes(["origin", "artist"], this.state.tagType)) {
      return <span>
        <TagInlineField
          constrainType="origin"
          defaultValue={this.props.origin}
          floatingLabelText="Origin"
          onChange={this.props.handleOrigin}
        />
        <br />
      </span>;
    }
  },
  render() {
    return <Form
      id={this.props.id}
      actions={this.props.actions}
      onSubmit={this.handleSubmit}
      onClose={this.props.onClose}
    >
      <TextField
        defaultValue={this.state.name}
        label="Name"
        onChange={this.handleName}
      />
      <br />
      <TagTypeSelector
        tagType={this.state.tagType}
        onChange={this.handleTagType}
      />
      <TextArea
        defaultValue={this.state.aliases}
        label="Aliases"
        rows={1}
        rowsMax={3}
        onChange={this.handleAliases}
      />
      <br />
      {this.renderOrigin()}
      <TextArea
        defaultValue={this.state.definition}
        label="Definition"
        rows={3}
        rowsMax={10}
        onChange={this.handleDefinition}
      />
      <br />
      <SafetySelector
        safety={this.state.safety}
        onChange={this.handleSafety}
      />
      <TagInlineField
        delim=","
        defaultValue={this.state.extends}
        floatingLabelText="Extends"
        onChange={this.handleExtends}
      />
      <TagField
        noExpand={true}
        injectRoot={this.state.name}
        defaultValue={this.state.implications}
        floatingLabelText="Implications"
        onChange={this.handleImplications}
      />
      <TagMultiField
        inheritFrom={this.state.inheritFrom}
        injectRoot={this.state.name}
        defaultValue={this.state.condImplications}
        defaultImplications={this.state.implications}
        floatingLabelText="Conditional Implications"
        onChange={this.handleCondImplications}
      />
    </Form>;
  }
});
