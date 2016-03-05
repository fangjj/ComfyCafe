CommentInlineForm = React.createClass({
  getInitialState() {
    return {
      body: ""
    };
  },
  handleBody(event) {
    this.setState({
      body: event.target.value
    });
  },
  handleSubmit(event) {
    Meteor.call("addComment", this.props.post._id, {
      body: this.state.body
    });
    this.setState({
      body: ""
    });
    this.props.afterSubmit();
  },
  render() {
    return <div>
      <CommentInnerForm
        directValue={true}
        body={this.state.body}
        handleBody={this.handleBody}
      />
      <div className="actions">
        <SubmitButton
          onTouchTap={this.handleSubmit}
        />
      </div>
    </div>;
  }
});
