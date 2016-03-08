let {
  Dialog,
  FlatButton,
  RaisedButton
} = mui;

const defaultState = {
  name: "",
  definition: ""
};

TagDialog = React.createClass({
  getInitialState() {
    if (this.props.tag) {
      return {
        name: this.props.tag.name,
        definition: this.props.tag.definition
      };
    } else {
      return defaultState;
    }
  },
  handleName(event) {
    this.setState({name: event.target.value});
  },
  handleDefinition(event) {
    this.setState({definition: event.target.value});
  },
  handleSubmit() {
    this.props.handleSubmit({
      name: this.state.name,
      definition: this.state.definition
    });

    if (! this.props.tag) {
      this.setState(defaultState);
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
      className="tagForm"
      title={this.props.title}
      actions={actions}
      modal={this.props.modal}
      open={this.props.open}
      autoScrollBodyContent={true}
      onRequestClose={this.props.handleClose}
    >
      <TagInnerForm
        name={this.state.name}
        handleName={this.handleName}
        definition={this.state.definition}
        handleDefinition={this.handleDefinition}
      />
    </Dialog>;
  }
});
