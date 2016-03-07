TagTreeComponent = React.createClass({
  componentWillMount() {
    this.ids = {};
    this.props.humanizedTags.nouns.map((noun) => {
      this.ids[noun.name] = _.uniqueId();
    });
  },
  renderRoots() {
    return this.props.humanizedTags.nouns.map((noun) => {
      return <TagRootComponent
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
    if (this.props.tags.authors) {
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
