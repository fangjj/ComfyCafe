import React from "react";

import Meatball from "/imports/ui/components/Meatball";
import MeatballSelector from "/imports/ui/components/MeatballSelector";
import DankIcon from "/imports/ui/components/Daikon/DankIcon";

export default React.createClass({
  render() {
    return <MeatballSelector
      label={this.props.label || "Dankness"}
      value={this.props.value}
      onChange={this.props.onChange}
    >
      <Meatball
        name="legit"
        label="Legit"
        icon={<DankIcon value="legit" />}
      />
      <Meatball
        name="dank"
        label="Dank"
        icon={<DankIcon value="dank" />}
      />
    </MeatballSelector>;
  }
});
