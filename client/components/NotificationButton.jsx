NotificationButton = React.createClass({
  renderCount() {
    if (this.props.notifications.length) {
      return <span className="push teal">{this.props.notifications.length}</span>;
    }
  },
  render() {
    return <a id="notificationListToggle" className="waves-effect waves-teal">
      <i className="material-icons">notifications</i>
      {this.renderCount()}
    </a>;
  }
});
