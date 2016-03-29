import React from "react";
import GeoPattern from "geopattern";

import globalEvents from "/lib/globalEvents";

export default React.createClass({
  getInitialState() {
    return {};
  },
  componentWillMount() {
    globalEvents.on("patternChange", (seed) => {
      const pattern = GeoPattern.generate(seed);
      this.bg = pattern.toDataUrl();
      this.setState({
        seed: seed
      });
      setTopColor(pattern.color);
    });
  },
  render() {
    const style = {
      backgroundImage: this.bg
    };
    return <div className="pseudoBody" style={style} />;
  }
});
