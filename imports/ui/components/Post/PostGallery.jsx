import _ from "lodash";
import React from "react";

import PostPreview from "./PostPreview";
import InlineLoadingSpinner from "/imports/ui/components/Spinner/InlineLoadingSpinner";
import UploadFAB from "/imports/ui/components/UploadFAB";
import InlineUhoh from "/imports/ui/components/InlineUhoh";
import Infinite from "/imports/ui/components/Infinite";
import Checkbox from "/imports/ui/components/Checkbox";

export default React.createClass({
  getInitialState() {
    return {
      height: 1000,
      continue: true
    };
  },
  componentWillReceiveProps(nextProps) {
    if (_.get(nextProps.posts, "length") !== _.get(this.props.posts, "length")) {
      this.setState({
        height: $(this.refs.gallery).height(),
        continue: true
      });
    } else if (nextProps.page !== this.props.page) {
      this.setState({ continue: false });
    }
  },
  handleInfinity() {
    if (this.state.continue) {
      Session.set("page", this.props.page + 1);
    }
  },
  renderPosts() {
    if (this.props.posts.length) {
      return this.props.posts.map((post) => {
        return <PostPreview
          post={post}
          currentUser={this.props.currentUser}
          key={post._id}
        />;
      });
    } else if (! this.props.loading) {
      if (this.state.originalOnly) {
        return <InlineUhoh>
          No results.
        </InlineUhoh>;
      }
      return this.props.ifEmpty.bind(this)();
    }
  },
  renderSpinner() {
    if (this.props.loading) {
      return <InlineLoadingSpinner />;
    }
  },
  renderFab() {
    if (this.props.currentUser) {
      if (this.props.fabCond) {
        if (this.props.fabCond.bind(this)()) {
          return <UploadFAB />;
        }
      } else if (! this.props.noFab) {
        return <UploadFAB />;
      }
    }
  },
  render() {
    return <Infinite
      threshold={300}
      onInfinite={this.handleInfinity}
    >
      <div className="postGallery content" ref="gallery">
        <div className="filter">
          <div>
            <Checkbox
              id="galleryOriginalOnly"
              label="Original only"
              defaultChecked={this.props.originalOnly}
              onCheck={this.props.handleOriginalOnly}
            />
          </div>
        </div>
        <ul className="gallery">
          {this.renderPosts()}
        </ul>
        {this.renderSpinner()}
        {this.renderFab()}
      </div>
    </Infinite>;
  }
});
