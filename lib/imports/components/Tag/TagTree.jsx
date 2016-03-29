import _ from "lodash";
import React from "react";

import TagRoot from "./TagRoot";
import TagletAuthor from "./TagletAuthor";
import TagletOrigin from "./TagletOrigin";

const TagTree = React.createClass({
  componentWillMount() {
    this.prefix = _.uniqueId();
  },
  renderRoots() {
    return _.map(this.props.tags.subjects, (descriptors, rootNoun) => {
      return <TagRoot
        noun={rootNoun}
        descriptors={descriptors}
        injectDescriptors={this.props.injectDescriptors}
        key={this.prefix + "_root_" + rootNoun}
      />;
    });
  },
  renderInner() {
    if (this.props.tags.text) {
      return <ul>
        {this.renderRoots()}
      </ul>;
    }
  },
  renderAuthors() {
    if (! _.isEmpty(this.props.tags.authors)) {
      const elems = this.props.tags.authors.map((author) => {
        return <TagletAuthor
          name={author}
          key={this.prefix + "_author_" + author}
        />;
      });
      return <ul className="metaRow">
        {elems}
      </ul>;
    }
  },
  renderOrigins() {
    if (! _.isEmpty(this.props.tags.origins)) {
      const elems = this.props.tags.origins.map((name) => {
        return <TagletOrigin
          name={name}
          key={this.prefix + "_origin_" + name}
        />;
      });
      return <ul className="metaRow">
        {elems}
      </ul>;
    }
  },
  render() {
		return <div className="tagTree">
      {this.renderAuthors()}
      {this.renderOrigins()}
			{this.renderInner()}
		</div>;
  }
});

export default TagTree;
