TagTree = React.createClass({
  renderRoots() {
    return _.map(this.props.tags.subjects, (descriptors, rootNoun) => {
      return <TagRoot
        noun={rootNoun}
        descriptors={descriptors}
        injectDescriptors={this.props.injectDescriptors}
        key={_.uniqueId()}
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
      return <div className="metaRow">
        {"by " + fancyCommaJoin(this.props.tags.authors)}
      </div>;
    }
  },
  renderOrigins() {
    if (! _.isEmpty(this.props.tags.origins)) {
      const elems = this.props.tags.origins.map((name) => {
        return <TagletOrigin name={name} key={_.uniqueId()} />;
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
