NotificationButton = React.createClass({
  renderCount() {
    if (this.props.notifications.length) {
      return <span className="push teal">{this.props.notifications.length}</span>;
    }
  },
  toggleListVisibility(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.action();
  },
  render() {
    return <a id="notificationListToggle"
      className="ignore-react-onclickoutside waves-effect waves-teal"
      onClick={this.toggleListVisibility}
    >
      <i className="material-icons">notifications</i>
      {this.renderCount()}
    </a>;
  }
});
