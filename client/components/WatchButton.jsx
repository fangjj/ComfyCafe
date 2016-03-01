let {
  RaisedButton,
  FontIcon
} = mui;

WatchButton = React.createClass({
  style: {
    width: 141
  },
  getInitialState() {
    return {
      notHover: true
    };
  },
  watch(event) {
    Meteor.call("watchTopic", this.props.topic._id);
  },
  unwatch(event) {
    Meteor.call("unwatchTopic", this.props.topic._id);
  },
  toggleHover() {
    this.setState({notHover: ! this.state.notHover});
  },
  render() {
    const watched = this.props.currentUser
      && _.contains(this.props.topic.watchers, this.props.currentUser._id);
    if (! watched) {
      return <RaisedButton
        label="Watch"
        labelStyle={{fontSize: "18px"}}
        secondary={true}
        icon={<FontIcon className="material-icons">visibility</FontIcon>}
        style={this.style}
        onTouchTap={this.watch}
      />;
    } else {
      var label;
      var icon;
      if (this.state.notHover) {
        label = "Watched";
        icon = "check";
      } else {
        label = "Unwatch";
        icon = "visibility_off";
      }
      return <RaisedButton
        className="grey darken-2"
        label={label}
        labelStyle={{fontSize: "18px"}}
        icon={<FontIcon className="material-icons">{icon}</FontIcon>}
        style={this.style}
        onTouchTap={this.unwatch}
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
      />;
    }
  }
});
