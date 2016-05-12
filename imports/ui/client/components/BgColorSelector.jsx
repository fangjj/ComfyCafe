import _ from "lodash";
import React from "react";

import colors from "/imports/api/media/colors";
import Meatball from "/imports/ui/client/components/Meatball";
import MeatballSelector from "/imports/ui/client/components/MeatballSelector";

export default React.createClass({
  renderInner() {
    const elems = [
      <Meatball
        name="default"
        key="default"
      />
    ];
    _.each(colors, (color) => {
      elems.push(<Meatball
        name={color}
        color={color}
        key={color}
      />);
    });
    return elems;
  },
  render() {
    return <MeatballSelector
      label="Background Color"
      value={this.props.value}
      onChange={this.props.onChange}
    >
      {this.renderInner()}
    </MeatballSelector>;
  }
});
