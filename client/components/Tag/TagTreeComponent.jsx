TagTreeComponent = React.createClass({
  renderRoots() {
    return this.props.humanizedTags.nouns.map((noun) => {
      return <TagRootComponent noun={noun} />;
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
