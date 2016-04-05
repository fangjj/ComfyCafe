import _ from "lodash";
import React from "react";
import GeoPattern from "geopattern";
import tinycolor from "tinycolor2";
import nearestColor from "nearest-color";

import colors from "/imports/api/media/colors";

export default React.createClass({
  getInitialState() {
    return {};
  },
  updatePattern(seed, color) {
    if (seed) {
      const options = {};
      if (color) {
        const base = tinycolor(color).saturate(100).complement().toHexString();
        const nearest = nearestColor.from(colors)(base);
        options.color = nearest;
      }

      const pattern = GeoPattern.generate(seed, options);

      this.setState({
        bg: pattern.toDataUrl()
      });

      this.props.setColor(tinycolor(pattern.color).desaturate(5).darken(15));
    }
  },
  componentWillMount() {
    this.updatePattern(this.props.seed, this.props.color);
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.seed !== this.props.seed || nextProps.color !== this.props.color) {
      this.updatePattern(nextProps.seed, nextProps.color);
    }
  },
  render() {
    const style = {
      backgroundImage: this.state.bg
    };
    return <div className="pseudoBody" style={style} />;
  }
});
