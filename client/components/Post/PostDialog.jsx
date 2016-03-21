let {
  Dialog,
  FlatButton,
  RaisedButton
} = mui;

const defaultState = {
  visibility: "public",
  originality: "original",
  source: "",
  description: "",
  safety: 0,
  autoSafety: 0,
  tags: "tagme",
  condExpanded: {},
  pretentiousFilter: "none"
};

PostDialog = React.createClass({
  getInitialState() {
    if (this.props.post) {
      const post = this.props.post;
      return {
        visibility: post.visibility,
        originality: post.originality,
        source: post.source || defaultState.source,
        description: post.description || defaultState.description,
        safety: post.safety || defaultState.safety,
        autoSafety: post.safety || defaultState.safety,
        tags: post.tags.text || defaultState.tags,
        condExpanded: post.tagsCondExpanded || defaultState.condExpanded,
        pretentiousFilter: post.pretentiousFilter || defaultState.pretentiousFilter
      };
    } else {
      return defaultState;
    }
  },
  handleVisibility(event, index, value) {
    this.setState({visibility: value});
  },
  handleOriginality(event, index, value) {
    this.setState({originality: value});
  },
  handleSource(event) {
    this.setState({source: event.target.value});
  },
  handleDescription(event) {
    this.setState({description: event.target.value});
  },
  handleSafety(event, index, value) {
    this.setState({safety: parseInt(value)});
  },
  receiveAutoSafety(value) {
    this.setState({autoSafety: value});
  },
  applyAutoSafety() {
    this.setState({safety: this.state.autoSafety});
  },
  handleTags(value, parsed, condExpanded) {
    this.setState({
      tags: value,
      condExpanded: condExpanded
    });
  },
  handlePretentiousFilter(event, index, value) {
    this.setState({pretentiousFilter: value});
  },
  handleSubmit() {
    this.props.handleSubmit({
      visibility: this.state.visibility,
      originality: this.state.originality,
      source: this.state.source,
      description: this.state.description,
      safety: this.state.safety,
      tags: this.state.tags,
      tagsCondExpanded: this.state.condExpanded,
      pretentiousFilter: this.state.pretentiousFilter
    });

    if (! this.props.post) {
      this.setState(defaultState);
    }
  },
  renderMedium() {
    if (this.props.medium) {
      return <div className="medium">
        <Medium medium={this.props.medium} />
      </div>;
    }
  },
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        labelStyle={{fontSize: "18px"}}
        secondary={true}
        onTouchTap={this.props.handleClose}
      />,
      <FlatButton
        label="Submit"
        labelStyle={{fontSize: "18px"}}
        primary={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return <Dialog
      className="postForm"
      title={this.props.title}
      actions={actions}
      modal={this.props.modal}
      open={this.props.open}
      autoScrollBodyContent={true}
      onRequestClose={this.props.handleClose}
    >
      {this.renderMedium()}
      <PostInnerForm
        visibility={this.state.visibility}
        handleVisibility={this.handleVisibility}
        originality={this.state.originality}
        handleOriginality={this.handleOriginality}
        source={this.state.source}
        handleSource={this.handleSource}
        description={this.state.description}
        handleDescription={this.handleDescription}
        safety={this.state.safety}
        handleSafety={this.handleSafety}
        autoSafety={this.state.autoSafety}
        receiveAutoSafety={this.receiveAutoSafety}
        applyAutoSafety={this.applyAutoSafety}
        tags={this.state.tags}
        handleTags={this.handleTags}
        condExpanded={this.state.condExpanded}
        pretentiousFilter={this.state.pretentiousFilter}
        handlePretentiousFilter={this.handlePretentiousFilter}
      />
    </Dialog>;
  }
});
