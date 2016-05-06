import React from "react";

import "/imports/api/media/adminMethods";
import Posts from "/imports/api/posts/collection";
import DenseContent from "/imports/ui/client/components/DenseContent";
import List from "/imports/ui/client/components/List";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";

export default React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const handle = Meteor.subscribe("adminAllPosts", Meteor.userId());
    return {
      loading: ! handle.ready(),
      images: Posts.find(
        {},
        { sort: { createdAt: -1, name: 1 } }
      ).fetch()
    };
  },
  handleRegen() {
    Meteor.call("adminRegenThumbs", "postMedium");
  },
  renderList() {
    return _.map(this.data.images, (image) => {
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
