import React from "react";

import Posts from "/imports/api/posts/collection";
import DenseContent from "/imports/ui/client/components/DenseContent";
import List from "/imports/ui/client/components/List";

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
      <List>
        {this.renderList()}
      </List>
    </DenseContent>;
  }
});
