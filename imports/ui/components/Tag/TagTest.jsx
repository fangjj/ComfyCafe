import React from "react";

import tagParser from "/imports/api/tags/parser";
import tagPatcher from "/imports/api/tags/patcher";

import TagTree from "./TagTree";
import TagField from "./TagField";

const TagTest = React.createClass({
  getInitialState() {
    return {
      tagStrA: "",
      tagStrB: "",
      tagStrC: ""
    };
  },
  handleA(value) {
    this.setState({
      tagStrA: value
    });
  },
  handleB(value) {
    this.setState({
      tagStrB: value
    });
  },
  handleC(value) {
    this.setState({
      tagStrC: value
    });
  },
  render() {
    return <div className="content">
      <TagTree tags={tagPatcher(
        tagParser(this.state.tagStrA),
        tagParser(this.state.tagStrB),
        tagParser(this.state.tagStrC)
      )} />
      <TagField floatingLabelText="Tags A" onChange={this.handleA} />
      <TagField floatingLabelText="Tags B" onChange={this.handleB} />
      <TagField floatingLabelText="Tags C" onChange={this.handleC} />
    </div>;
  }
});

export default TagTest;
