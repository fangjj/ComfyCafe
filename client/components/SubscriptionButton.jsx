SubscriptionButton = React.createClass({
  toggleSubscription(event) {
    Meteor.call("toggleSubscription", this.props.owner._id);
  },
  render() {
    var subscribed = this.props.currentUser && _.contains(this.props.currentUser.subscriptions, this.props.owner._id);
    if (! subscribed) {
      return <a className="toggleSubscription waves-effect waves-light btn" onClick={this.toggleSubscription}>
        <i className="material-icons left">add_box</i>
        Subscribe
      </a>;
    } else {
      return <a className="toggleSubscription waves-effect waves-light btn grey darken-2"  onClick={this.toggleSubscription}>
        <i className="material-icons left nothover">check_box</i>
        <span className="nothover">Subscribed</span>
        <i className="material-icons left hover">indeterminate_check_box</i>
        <span className="hover">Unsubscribe</span>
      </a>;
    }
  }
});
