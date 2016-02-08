TagTreeComponent = React.createClass({
  componentWillMount() {
    var state = {};
    this.props.humanizedTags.nouns.map((noun) => {
      state[noun.name + "Id"] = _.uniqueId();
    });
    this.setState(state);
  },
  renderRoots() {
    return this.props.humanizedTags.nouns.map((noun) => {
      return <TagRootComponent
        noun={noun}
        key={this.state[noun.name + "Id"]}
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
