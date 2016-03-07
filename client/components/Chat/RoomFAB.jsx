let {
  FloatingActionButton,
  FontIcon
} = mui;

RoomFAB = React.createClass({
  getInitialState() {
    return {
      showForm: false
    };
  },
  showRoomForm() {
    this.setState({showForm: true});
  },
  hideRoomForm() {
    this.setState({showForm: false});
  },
  render() {
    return <div className="fixed-action-btn">
      <FloatingActionButton secondary={true} onTouchTap={this.showRoomForm}>
        <FontIcon className="material-icons">add</FontIcon>
      </FloatingActionButton>
      <RoomForm
        handleClose={this.hideRoomForm}
        open={this.state.showForm}
      />
    </div>;
  }
});
