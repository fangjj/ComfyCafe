import _ from "lodash";
import React from "react";

import "/imports/api/tags/methods";
import Tags from "/imports/api/tags/collection";
import fancyCommaJoin from "/imports/api/common/fancyCommaJoin";
import safetyLabels from "/imports/api/common/safetyLabels";
import TagTree from "/imports/ui/components/Tag/TagTree";
import TagEditFAB from "/imports/ui/components/Tag/TagEditFAB";
import LoadingSpinner from "/imports/ui/components/Spinner/LoadingSpinner";
import TextBody from "/imports/ui/components/TextBody";
import Snackbar from "/imports/ui/components/Snackbar";

export default React.createClass({
  getInitialState() {
    return { snackbarOpen: false };
  },
  handleSnackbarRequestClose() {
    this.setState({ snackbarOpen: false });
  },
  revert() {
    Meteor.call("revertTag", this.props.tag._id, (err) => {
      if (err) {
        prettyPrint(err);
      } else {
        this.setState({ snackbarOpen: true });
      }
    });
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
  render() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    const tag = this.props.tag;
    return <article className="content">
      <header>
        <h2>{tag.name}</h2>
        <a href="#" onClick={this.revert}>Revert</a>
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

      <Snackbar
        open={this.state.snackbarOpen}
        message="Reverted successfully."
        onRequestClose={this.handleSnackbarRequestClose}
      />
    </article>;
  }
});
