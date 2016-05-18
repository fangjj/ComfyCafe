import React from "react";

import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import Content from "/imports/ui/client/components/Content";
import List from "/imports/ui/client/components/List";

function renderInner(modlog) {
  return modlog.map((m) => {
    return <li>{m.details}</li>;
  });
}

export default (props) => {
  if (props.loading) {
    return <LoadingSpinner />;
  }

  return <Content>
    <List>
      {renderInner(props.modlog)}
    </List>
  </Content>;
};
