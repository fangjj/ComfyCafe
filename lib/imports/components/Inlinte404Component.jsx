import React from "react";

import Uhoh from "./Uhoh";

// This isn't actually inline. Hm.
const Inline404Component = React.createClass({
  render() {
    return <Uhoh>
      404 - Dead Forever
    </Uhoh>;
  }
});

export default Inline404Component;
