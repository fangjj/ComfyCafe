TagTree = React.createClass({
  componentWillMount() {
    this.ids = {};
    tagHumanizer(this.props.tags).nouns.map((noun) => {
      this.ids[noun.name] = _.uniqueId();
    });
  },
  renderRoots() {
    return tagHumanizer(this.props.tags).nouns.map((noun) => {
      return <TagRoot
        noun={noun}
        key={this.ids[noun.name]}
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
