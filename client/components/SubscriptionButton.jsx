let {
  RaisedButton,
  FontIcon
} = mui;

SubscriptionButton = React.createClass({
  style: {
    width: 180
  },
  getInitialState() {
    return {
      hover: false
    };
  },
  toggleSubscription(event) {
    Meteor.call("toggleSubscription", this.props.owner._id);
  },
  toggleHover() {
    this.setState({hover: ! this.state.hover});
  },
  render() {
    var subscribed = this.props.currentUser && _.contains(this.props.currentUser.subscriptions, this.props.owner._id);
    if (! subscribed) {
      return <RaisedButton
        className="toggleSubscription"
        label="Subscribe"
        secondary={true}
        icon={<FontIcon className="material-icons">add_box</FontIcon>}
        style={this.style}
        onTouchTap={this.toggleSubscription}
      />;
    } else {
      var label;
      var icon;
      if (! this.state.hover) {
        label = "Subscribed";
        icon = "check_box";
      } else {
        label = "Unsubscribe";
        icon = "indeterminate_check_box";
      }
      return <RaisedButton
        className="toggleSubscription grey darken-2"
        label={label}
        icon={<FontIcon className="material-icons">{icon}</FontIcon>}
        style={this.style}
        onTouchTap={this.toggleSubscription}
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
      />;
    }
  }
});
