MessageInlineForm = React.createClass({
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
    Meteor.call("addMessage", this.props.topic._id, {
      body: this.state.body
    });
    this.setState({body: ""});
  },
  render() {
    return <div>
      <MessageInnerForm
        directValue={true}
        body={this.state.body}
        handleBody={this.handleBody}
      />
      <div className="actions">
        <SubmitButton
          label="Send"
          iconName="send"
          onTouchTap={this.handleSubmit}
        />
      </div>
    </div>;
  }
});
