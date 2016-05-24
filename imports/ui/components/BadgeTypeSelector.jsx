import React from "react";

import Meatball from "/imports/ui/components/Meatball";
import MeatballSelector from "/imports/ui/components/MeatballSelector";
import Badge from "/imports/ui/components/Badge";
import Icon from "/imports/ui/components/Daikon/Icon";

export default React.createClass({
  render() {
    return <MeatballSelector
      label="Type"
      value={this.props.badgeType}
      onChange={this.props.onChange}
    >
      <Meatball
        className="staff"
        name="staff"
        label="Staff"
        icon={<Icon>star</Icon>}
      />
      <Meatball
        className="whimsical"
        name="whimsical"
        label="Whimsical"
        icon={<Icon>looks</Icon>}
      />
      <Meatball
        className="technical"
        name="technical"
        label="Technical"
        icon={<Icon>memory</Icon>}
      />
      <Meatball
        className="intense"
        name="intense"
        label="Intense"
        icon={<Icon>whatshot</Icon>}
      />
      <Meatball
        className="mysterious"
        name="mysterious"
        label="Mysterious"
        icon={<Icon>visibility</Icon>}
      />
    </MeatballSelector>;
  }
});
