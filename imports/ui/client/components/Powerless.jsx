import React from "react";

import Uhoh from "/imports/ui/client/components/Uhoh";

export default React.createClass({
  render() {
    return <Uhoh>
      You aren't logged in, so you're powerless!
    </Uhoh>;
  }
});
