TagRootComponent = React.createClass({
  getInitialState() {
    return {
      newDescriptors: []
    }
  },
  addDescriptor() {
    var newDescriptors = this.state.newDescriptors.slice();
    newDescriptors.push(null);
    this.setState({
      newDescriptors: newDescriptors
    });
  },
  renderNewDescriptors() {
    var self = this;
    if (this.props.editable) {
      return this.state.newDescriptors.map((descriptor) => {
        return <TagNewDescriptorComponent />;
      });
    }
  },
  renderDescriptors(descriptors) {
    var self = this;
    return descriptors.map((descriptor) => {
      return <TagDescriptorComponent descriptor={descriptor} editable={self.props.editable} />;
    });
  },
  render() {
    var isNew = this.props.new;
    var noun = this.props.noun;

    var rootClause;
    if (! isNew) {
      rootClause = <TagRootClauseComponent noun={noun} editable={this.props.editable} />;
    } else {
      rootClause = <TagNewRootClauseComponent editable={this.props.editable} />;
    }

    var descriptors = [];
    if (! isNew) {
      descriptors = noun.descriptors;
    }

    var addDescriptorBtn;
    if (this.props.editable) {
      addDescriptorBtn = <li className="descriptor">
        <a className="taglet noun addNoun" title="Add noun" onClick={this.addDescriptor}>
          <i className="material-icons">add</i>
        </a>
      </li>;
    }

    return <li>
      {rootClause}
      <ul>
        {this.renderNewDescriptors()}
        {this.renderDescriptors(descriptors)}
        {addDescriptorBtn}
      </ul>
    </li>;
  }
});
