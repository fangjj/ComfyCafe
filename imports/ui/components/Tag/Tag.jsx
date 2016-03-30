import _ from "lodash";
import React from "react";

import fancyCommaJoin from "/imports/api/common/fancyCommaJoin";
import safetyLabels from "/imports/api/common/safetyLabels";

import TagTree from "./TagTree";
import TagEditFAB from "./TagEditFAB";
import LoadingSpinner from "../LoadingSpinner";
import TextBody from "../TextBody";

const Tag = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const name = FlowRouter.getParam("tagName");
    const handle = Meteor.subscribe("tag", name);
    return {
      loading: ! handle.ready(),
      tag: Tags.findOne({ name: name }),
      currentUser: Meteor.user()
    };
  },
  renderAliases(tag) {
    if (tag.aliases.length) {
      const aliases = fancyCommaJoin(tag.aliases);
      return <span>
        Aliases: {aliases}
        <br />
      </span>;
    }
  },
  renderOrigin(tag) {
    if (tag.type !== "origin" && tag.origin) {
      return <span>
        Origin: {tag.origin}
      </span>;
    }
  },
  renderSafety(tag) {
    // Don't bother rendering if Safe
    if (tag.safety) {
      return <span>
        Safety: {safetyLabels[tag.safety]}
        <br />
      </span>;
    }
  },
  renderExtends(tag) {
    if (tag.extends && tag.extends.length) {
      return <span>
        Extends: {fancyCommaJoin(tag.extends)}
        <br />
      </span>;
    }
  },
  renderTagTree(tag) {
    if (tag.implications && tag.implications.allTags.length > 1) {
      return <TagTree
        tags={tag.implications}
      />;
    }
  },
  renderCondImpl(tag) {
    if (tag.condImplications) {
      return _.map(tag.condImplications, (impl, cond) => {
        return <div key={_.uniqueId()}>
          {cond}
          <TagTree tags={impl} injectDescriptors={cond} />
        </div>;
      });
    }
  },
  renderFab(tag) {
    if (this.data.currentUser) {
      return <TagEditFAB tag={tag} />;
    }
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinner />;
    }

    const tag = this.data.tag;
    return <article className="content">
      <header>
        <h2>{tag.name}</h2>
      </header>
      Type: {tag.type}
      <br />
      {this.renderAliases(tag)}
      {this.renderOrigin(tag)}
      <TextBody text={tag.definition} />
      {this.renderSafety(tag)}
      {this.renderExtends(tag)}
      {this.renderTagTree(tag)}
      {this.renderCondImpl(tag)}
      {this.renderFab(tag)}
    </article>;
  }
});

export default Tag;
