import React from "react";
import TimeAgo from "react-timeago";
import moment from "moment";

export default React.createClass({
  render() {
    const stamp = moment(this.props.time).format("MMMM Do, YYYY HH:mm:ss");
    return <TimeAgo date={this.props.time} title={stamp} />;
  }
});
