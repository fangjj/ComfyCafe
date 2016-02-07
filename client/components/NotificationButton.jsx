NotificationButton = React.createClass({
  renderCount() {
    if (this.props.notifications.length) {
      return <span className="push teal">{this.props.notifications.length}</span>;
    }
  },
  toggleListVisibility(event) {
    if (event.which === 2) {
      // Middle mouse click
    } else {
      event.preventDefault();
      event.stopPropagation();
      this.props.action();
    }
  },
  render() {
    return <a id="notificationListToggle" className="waves-effect waves-teal" onClick={this.toggleListVisibility}>
      <i className="material-icons">notifications</i>
      {this.renderCount()}
    </a>;
  }
});
