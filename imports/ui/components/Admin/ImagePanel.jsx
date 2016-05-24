import React from "react";

import "/imports/api/media/adminMethods";
import DenseContent from "/imports/ui/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import List from "/imports/ui/components/List";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";

export default React.createClass({
  handleRegen() {
    Meteor.call("adminRegenThumbs", "postMedium");
  },
  renderList() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    return _.map(this.props.images, (image) => {
      const path = FlowRouter.path("adminView", {
        panel: "images",
        id: image._id
      });
      return <li key={image._id}>
        <a href={path}>{image.owner.username + "/" + image.name}</a>
      </li>;
    });
  },
  render() {
    return <DenseContent>
      <SubmitButton
        label="Regenerate All Thumbnails"
        iconName="broken_image"
        onTouchTap={this.handleRegen}
      />
      <List>
        {this.renderList()}
      </List>
    </DenseContent>;
  }
});
