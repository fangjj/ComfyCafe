import React from "react";
import GeoPattern from "geopattern";
import tinycolor from "tinycolor2";

export default React.createClass({
  getInitialState() {
    return {};
  },
  updatePattern(seed) {
    if (seed) {
      console.log("updatePattern", seed);
      const pattern = GeoPattern.generate(seed);

      this.setState({
        bg: pattern.toDataUrl()
      });

      const color = tinycolor(pattern.color);
      this.props.setColor(color.desaturate(5).darken(15));
    }
  },
  componentWillMount() {
    this.updatePattern(this.props.seed);
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.seed !== this.props.seed) {
      this.updatePattern(nextProps.seed);
    }
  },
  render() {
    const style = {
      backgroundImage: this.state.bg
    };
    return <div className="pseudoBody" style={style} />;
  }
});
