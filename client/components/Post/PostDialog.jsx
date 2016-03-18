let {
  Dialog,
  FlatButton,
  RaisedButton
} = mui;

const defaultState = {
  visibility: "public",
  original: false,
  description: "",
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
        original: post.original,
        description: post.description || defaultState.description,
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
  handleOriginal(event) {
    this.setState({original: event.target.checked});
  },
  handleDescription(event) {
    this.setState({description: event.target.value});
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
      original: this.state.original,
      description: this.state.description,
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
        original={this.state.original}
        handleOriginal={this.handleOriginal}
        description={this.state.description}
        handleDescription={this.handleDescription}
        tags={this.state.tags}
        handleTags={this.handleTags}
        condExpanded={this.state.condExpanded}
        pretentiousFilter={this.state.pretentiousFilter}
        handlePretentiousFilter={this.handlePretentiousFilter}
      />
    </Dialog>;
  }
});
