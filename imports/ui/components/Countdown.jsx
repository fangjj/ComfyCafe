import React from "react";

import classConcat from "/imports/ui/utils/classConcat"
import SetIntervalMixin from "/imports/ui/components/extern/SetIntervalMixin";

export default React.createClass({
  mixins: [SetIntervalMixin],
  getInitialState() {
    return {
      seconds: Math.ceil(this.props.ms / 1000)
    };
  },
  componentDidMount() {
    this.setInterval(() => {
      if (this.state.seconds > 0) {
        this.setState({
          seconds: this.state.seconds - 1
        });
      }
    }, 1000);
  },
  render() {
    let label = "second";
    if (this.state.seconds !== 1) {
      label += "s";
    }
    return <span>
      {this.state.seconds} {label}
    </span>;
  }
});
