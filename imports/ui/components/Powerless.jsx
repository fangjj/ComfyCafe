import React from "react";

import Uhoh from "./Uhoh";

const Powerless = React.createClass({
  render() {
    return <Uhoh>
      You aren't logged in, so you're powerless!
    </Uhoh>;
  }
});

export default Powerless;
