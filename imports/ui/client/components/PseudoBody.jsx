import React from "react";
import GeoPattern from "geopattern";
import tinycolor from "tinycolor2";

export default React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {};
  },
  getMeteorData() {
    return {
      seed: Session.get("patternSeed")
    };
  },
  updatePattern(seed) {
    if (seed) {
      this.currentSeed = this.data.seed;

      const pattern = GeoPattern.generate(seed);

      this.setState({
        bg: pattern.toDataUrl()
      });

      const color = tinycolor(pattern.color);
      this.props.setColor(color.desaturate(5).darken(15));
    }
  },
  componentWillMount() {
    this.updatePattern(this.data.seed);
  },
  componentWillUpdate(nextProps) {
    this.updatePattern(this.data.seed);
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.data.seed !== this.currentSeed;
  },
  render() {
    const style = {
      backgroundImage: this.state.bg
    };
    return <div className="pseudoBody" style={style} />;
  }
});
