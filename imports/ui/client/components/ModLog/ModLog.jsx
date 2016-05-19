import React from "react";

import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import Content from "/imports/ui/client/components/Content";
import List from "/imports/ui/client/components/List";
import ModLogItem from "/imports/ui/client/components/ModLog/ModLogItem";

function renderInner(modlog) {
  return modlog.map((m) => {
    return <ModLogItem ml={m} key={m._id} />;
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
