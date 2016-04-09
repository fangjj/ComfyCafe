import React from "react";

import Colors from "/imports/ui/client/utils/colors";
import classConcat from "/imports/ui/client/utils/classConcat";
import Button from "/imports/ui/client/components/Button/Button";

export default (props) => {
  const { label, iconName, ...leftoverProps } = props;
  return <Button
    backgroundColor={Colors.reassuringGray}
    label={label || "Cancel"}
    iconName={iconName || "cancel"}
    {...leftoverProps}
  />;
};
