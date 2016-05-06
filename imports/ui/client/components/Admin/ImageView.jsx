import React from "react";

import "/imports/api/posts/adminMethods";
import { isAdmin, isDev, isMod } from "/imports/api/common/persimmons";
import DenseContent from "/imports/ui/client/components/DenseContent";
import List from "/imports/ui/client/components/List";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

export default React.createClass({
  getInitialState() {
    return {};
  },
  handleRegen() {
    Meteor.call("adminRegenPostThumbs", this.props.image._id);
  },
  render() {
    return <DenseContent>
      <SubmitButton
        label="Regenerate Thumbnails"
        iconName="broken_image"
        onTouchTap={this.handleRegen}
      />
    </DenseContent>;
  }
});
