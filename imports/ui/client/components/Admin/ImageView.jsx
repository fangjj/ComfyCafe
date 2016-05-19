import React from "react";

import "/imports/api/posts/adminMethods";
import { isAdmin, isDev, isMod } from "/imports/api/common/persimmons";
import DenseContent from "/imports/ui/client/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";
import List from "/imports/ui/client/components/List";
import Form from "/imports/ui/client/components/Form";
import TextField from "/imports/ui/client/components/TextField";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import DangerButton from "/imports/ui/client/components/Button/DangerButton";
import PostForm from "/imports/ui/client/components/Post/PostForm";

export default React.createClass({
  getInitialState() {
    return {};
  },
  handleRegen() {
    Meteor.call("adminRegenPostThumbs", this.props.image._id);
  },
  render() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    const image = this.props.image;
    const url = FlowRouter.path("post", {
      username: image.owner.username,
      postName: image.name
    });
    const ownerUrl = FlowRouter.path("profile", { username: image.owner.username });
    return <DenseContent>
      <header>
        <h2><a href={ownerUrl}>{image.owner.username}</a>/<a href={url}>{image.name}</a></h2>
      </header>

      <section>
        <header>
          <h3>Actions</h3>
        </header>
        <SubmitButton
          label="Regenerate Thumbnails"
          iconName="broken_image"
          onTouchTap={this.handleRegen}
        />
      </section>

      <section>
        <header>
          <h3>Modify</h3>
        </header>
        <PostForm
          post={image}
          mod={true}
          actions={true}
          left={<DangerButton
            label="Delete"
            iconName="delete"
            subtle={true}
          />}
        />
      </section>
    </DenseContent>;
  }
});
