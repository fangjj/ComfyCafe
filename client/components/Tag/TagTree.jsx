TagTree = React.createClass({
  componentWillMount() {
    this.ids = {};
    _.each(this.props.tags.subjects, (descriptors, rootNoun) => {
      this.ids[rootNoun] = _.uniqueId();
    });
  },
  renderRoots() {
    return _.map(this.props.tags.subjects, (descriptors, rootNoun) => {
      return <TagRoot
        noun={rootNoun}
        descriptors={descriptors}
        key={this.ids[rootNoun]}
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
  render() {
		return <div className="tagTree">
      {this.renderAuthors()}
			{this.renderInner()}
		</div>;
  }
});
