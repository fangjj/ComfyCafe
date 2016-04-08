import React from "react";
import TimeAgo from "react-timeago";
import moment from "moment";

export default (props) => {
  const stamp = moment(props.time).format("MMMM Do, YYYY HH:mm:ss");
  return <TimeAgo date={props.time} title={stamp} />;
};
