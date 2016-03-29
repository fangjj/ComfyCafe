import React from "react";

import Uhoh from "./Uhoh";

const PowerlessComponent = React.createClass({
  render() {
    return <Uhoh>
      You aren't logged in, so you're powerless!
    </Uhoh>;
  }
});

export default PowerlessComponent;
