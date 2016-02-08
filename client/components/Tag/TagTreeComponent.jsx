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
  render() {
    var tags = this.props.tags;
    var humanizedTags = this.props.humanizedTags;

    if (tags.text) {
  		return <div className="tagTree">
  			<ul>
  				{this.renderRoots()}
  			</ul>
  		</div>;
    }
  }
});
