TagTreeComponent = React.createClass({
  getInitialState() {
    return {
      isEditing: false,
      newRoots: []
    };
  },
  toggleEditing(event) {
    this.setState({
      isEditing: ! this.state.isEditing
    });
  },
  addRoot(event) {
    var newRoots = this.state.newRoots.slice();
    newRoots.push(null);
    this.setState({
      newRoots: newRoots
    });
  },
  renderRoots() {
    var self = this;
    return this.props.humanizedTags.nouns.map((noun) => {
      return <TagRootComponent noun={noun} editable={self.state.isEditing} />;
    });
  },
  renderNewRoots() {
    var self = this;
    return this.state.newRoots.map(() => {
      return <TagRootComponent new={true} editable={self.state.isEditing} />;
    });
  },
  render() {
    var tags = this.props.tags;
    var humanizedTags = this.props.humanizedTags;

    var addRoot;
    var actions;
    if (this.state.isEditing) {
      addRoot = <li>
        <span className="root">
          <a className="taglet noun addRootNoun" title="Add noun" onClick={this.addRoot}>
            <i className="material-icons">add</i>
          </a>
        </span>
      </li>;

      actions = <div className="formActions">
        <a className="cancel waves-effect waves-light btn grey darken-2" onClick={this.toggleEditing}>
          <i className="material-icons left">cancel</i>
          Cancel
        </a>
        <a className="submit waves-effect waves-light btn">
          <i className="material-icons left">done</i>
          Save
        </a>
      </div>;
    } else {
      actions = <div className="formActions">
        <a className="editTags waves-effect waves-light btn pink lighten-2" onClick={this.toggleEditing}>
          <i className="material-icons left">loyalty</i>
          Edit Tags
        </a>
      </div>;
    }

    if (tags.text) {
  		return <div className="tagTree">
  			<ul>
  				{this.renderRoots()}
  				{this.renderNewRoots()}
  				{addRoot}
  			</ul>
  			{actions}
  		</div>;
    }
  }
});
