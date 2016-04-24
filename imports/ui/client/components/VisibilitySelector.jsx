import React from "react";

import Meatball from "/imports/ui/client/components/Meatball";
import MeatballSelector from "/imports/ui/client/components/MeatballSelector";
import PrivacyIcon from "/imports/ui/client/components/Daikon/PrivacyIcon";

export default React.createClass({
  render() {
    return <MeatballSelector
      label={this.props.label || "Visibility"}
      value={this.props.visibility}
      onChange={this.props.onChange}
    >
      <Meatball
        name="public"
        label="Public"
        icon={<PrivacyIcon privacy="public" />}
      />
      <Meatball
        name="friends"
        label="Friends only"
        icon={<PrivacyIcon privacy="friends" />}
      />
      <Meatball
        name="unlisted"
        label="Unlisted"
        icon={<PrivacyIcon privacy="unlisted" />}
      />
    </MeatballSelector>;
  }
});
