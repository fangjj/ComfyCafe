import _ from "lodash";
import React from "react";
import IconButton from "material-ui/IconButton";

import Ripple from "/imports/ui/client/components/Ripple";
import Icon from "/imports/ui/client/components/Daikon/Icon";

export default React.createClass({
  select() {
    this.props.onSelect(this.props.album._id);
  },
  remove(e) {
    e.stopPropagation();
    this.props.onRemove(this.props.album._id);
  },
  handleLink(e) {
    e.stopPropagation();
  },
  renderIndicator(album) {
    if (_.includes(album.posts, this.props.postId)) {
      return <span className="indicator">
        <Icon>check</Icon>
      </span>;
    }
  },
  renderRemove(album) {
    if (_.includes(album.posts, this.props.postId)) {
      return <div className="remove">
        <IconButton onTouchTap={this.remove}>
          <Icon>close</Icon>
        </IconButton>
      </div>;
    }
  },
  render() {
    const album = this.props.album;
    const path = FlowRouter.path("album", {
      username: album.owner.username,
      albumSlug: album.slug
    });
    return <li onTouchTap={this.select}>
      <Ripple>
        <div className="title">
          {album.name} {this.renderIndicator(album)}
        </div>
        <div className="undertitle">
          <a href={path} onTouchTap={this.handleLink}>{album.slug}</a>
        </div>
        {this.renderRemove(album)}
      </Ripple>
    </li>;
  }
});
