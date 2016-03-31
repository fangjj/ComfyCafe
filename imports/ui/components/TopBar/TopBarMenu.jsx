import React from "react";
import OnClickOutside from "react-onclickoutside";

import TopMenuItem from "./TopMenuItem";

import {
  Menu,
  MenuItem,
  Divider
} from "material-ui";

const TopBarMenu = React.createClass({
  mixins: [OnClickOutside],
  handleClickOutside(event) {
    if (this.props.open) {
      this.props.onClose();
    }
  },
  renderTop() {
    if (this.props.currentUser) {
      return [
        <TopMenuItem
          key="topMenuImages"
          primaryText="Images"
          leftIconName="image"
          href={FlowRouter.path("art")}
        />,
        <TopMenuItem
          key="topMenuBlog"
          primaryText="Blog"
          leftIconName="weekend"
          href={FlowRouter.path("blog")}
        />,
        <TopMenuItem
          key="topMenuTags"
          primaryText="Tags"
          leftIconName="style"
          href={FlowRouter.path("pizza")}
        />,
        <Divider
          key="topMenuDivider"
        />
      ];
    }
  },
  render() {
    var classes = "topMenu";
    if (this.props.open) {
      classes = "topMenu active";
    }

    return <div className={classes}>
      <div id="mobileMenuArrow" className={classes}></div>
      <Menu id="mobileMenu" className={classes} autoWidth={false}>
        {this.renderTop()}
        <TopMenuItem
          primaryText="Explore"
          leftIconName="explore"
          href={FlowRouter.path("explore")}
        />
      </Menu>
    </div>;
  }
});

export default TopBarMenu;
