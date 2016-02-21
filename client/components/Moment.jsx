Moment = React.createClass({
  render() {
    var isoDate = moment(this.props.time).toISOString();
    var prettyDate = moment(this.props.time).fromNow();
    return <time dateTime={isoDate}>{prettyDate}</time>;
  }
});
