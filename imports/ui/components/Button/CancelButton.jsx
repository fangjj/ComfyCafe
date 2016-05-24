import React from "react";

import Colors from "/imports/ui/utils/colors";
import classConcat from "/imports/ui/utils/classConcat";
import Button from "/imports/ui/components/Button/Button";

export default (props) => {
  const { label, iconName, ...leftoverProps } = props;
  return <Button
    backgroundColor={Colors.reassuringGray}
    label={label || "Cancel"}
    iconName={iconName || "cancel"}
    {...leftoverProps}
  />;
};
