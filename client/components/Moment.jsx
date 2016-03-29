import React from "react";

Moment = React.createClass({
  mixins: [SetIntervalMixin],
  getInitialState() {
    return {
      prettyDate: moment(this.props.time).fromNow()
    }
  },
  componentDidMount() {
    this.setInterval(() => {
      this.setState({
        prettyDate: moment(this.props.time).fromNow()
      });
    }, 5000);
  },
  render() {
    const isoDate = moment(this.props.time).toISOString();
    return <time dateTime={isoDate}>{this.state.prettyDate}</time>;
  }
});
