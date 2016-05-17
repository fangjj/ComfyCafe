import React from "react";

import Meatball from "/imports/ui/client/components/Meatball";
import MeatballSelector from "/imports/ui/client/components/MeatballSelector";
import OriginalityIcon from "/imports/ui/client/components/Daikon/OriginalityIcon";

export default React.createClass({
  render() {
    return <MeatballSelector
      label={this.props.label || "Originality"}
      value={this.props.value}
      onChange={this.props.onChange}
    >
      <Meatball
        name="original"
        label="Your work"
        icon={<OriginalityIcon originality="original" />}
      />
      <Meatball
        name="derivative"
        label="Derivative work"
        icon={<OriginalityIcon originality="derivative" />}
      />
      <Meatball
        name="repost"
        label="Repost"
        icon={<OriginalityIcon originality="repost" />}
      />
    </MeatballSelector>;
  }
});
