SubscriptionButton = React.createClass({
  render() {
    var isOwner = this.props.owner._id === Meteor.userId();
    var subscribed = Meteor.userId() && _.contains(Meteor.user().subscriptions, this.props.owner._id);
    if (! isOwner) {
      if (! subscribed) {
        return <a className="toggleSubscription waves-effect waves-light btn">
          <i className="material-icons left">add_box</i>
          Subscribe
        </a>;
      } else {
        return <a className="toggleSubscription waves-effect waves-light btn grey darken-2">
          <i className="material-icons left nothover">check_box</i>
          <span className="nothover">Subscribed</span>
          <i className="material-icons left hover">indeterminate_check_box</i>
          <span className="hover">Unsubscribe</span>
        </a>;
      }
    }
  }
});
