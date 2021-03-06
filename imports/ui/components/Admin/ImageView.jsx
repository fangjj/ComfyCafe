import React from "react";

import "/imports/api/posts/methods";
import DenseContent from "/imports/ui/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import Err404 from "/imports/ui/components/Err404";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import PostForm from "/imports/ui/components/Post/PostForm";

export default React.createClass({
  handleRegen() {
    Meteor.call("modRegenPostThumbs", this.props.image._id);
  },
  render() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    const image = this.props.image;
    if (! image) {
      return <Err404 />;
    }

    const url = FlowRouter.path("post", { name: image.name });
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
          onClick={this.handleRegen}
        />
      </section>

      <section>
        <header>
          <h3>Modify</h3>
        </header>
        <PostForm post={image} mod={true} actions={true} />
      </section>
    </DenseContent>;
  }
});
