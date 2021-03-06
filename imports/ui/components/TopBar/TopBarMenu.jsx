import React from "react";
import OnClickOutside from "react-onclickoutside";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import Divider from "material-ui/Divider";

import TopMenuItem from "./TopMenuItem";

export default React.createClass({
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
          key="topLegit"
          primaryText="Legit"
          leftIconName="work"
          href={FlowRouter.path("legit")}
        />,
        <TopMenuItem
          key="topDank"
          primaryText="Dank"
          leftIconName="local_pizza"
          href={FlowRouter.path("dank")}
        />,
        <Divider
          key="topDivider"
        />
      ];
    }
  },
  render() {
    let classes = "topMenu";
    if (this.props.open) {
      classes = "topMenu active";
    }

    return <Menu id="mobileMenu" className={classes} autoWidth={false}>
      {this.renderTop()}
      <TopMenuItem
        primaryText="Explore"
        leftIconName="explore"
        href={FlowRouter.path("explore")}
      />
    </Menu>;
  }
});
