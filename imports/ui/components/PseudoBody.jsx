import _ from "lodash";
import React from "react";
import GeoPattern from "geopattern";

export default (props) => {
  const bg = expr(() => {
    if (! props.seed) {
      return;
    }
    const options = _.pick(props, [ "color" ]);
    const pattern = GeoPattern.generate(props.seed, options);
    pattern.toDataUrl();
  });

  const style = { backgroundImage: bg };
  return <div className="pseudoBody" style={style} />;
};
