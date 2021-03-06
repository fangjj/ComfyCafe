import _ from "lodash";
import React from "react";
import NoSSR from "react-no-ssr";

import Notifications from "/imports/api/notifications/collection";
import Posts from "/imports/api/posts/collection";
import topColor from "/imports/ui/utils/topColor";
import TopBarLegitButton from "./TopBarLegitButton";
import TopBarDankButton from "./TopBarDankButton";
import TopBarExploreButton from "./TopBarExploreButton";
import TopBarMenu from "./TopBarMenu";
import NavItem from "./NavItem";
import NotificationButton from "../Notification/NotificationButton";
import NotificationList from "../Notification/NotificationList";
import LoginButton from "../User/LoginButton";
import AccountActionsButton from "../User/AccountActionsButton";
import AccountActionsList from "../User/AccountActionsList";

export default React.createClass({
  mixins: [ReactMeteorData],
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    return {
      showMobileMenu: false,
      showNotificationList: false,
      showAccountActions: false,
      visibleMenu: null
    };
  },
  getMeteorData() {
    const handle = Meteor.subscribe("notifications", Meteor.userId());
    const data = {
      loading: ! handle.ready(),
      notifications: Notifications.find(
        {
          to: Meteor.userId(),
          dismissed: { $ne: true }
        },
        { sort: { createdAt: -1 } }
      ).fetch()
    };
    {
      const name = FlowRouter.getParam("name");
      if (name) {
        const handle = Meteor.subscribe("postColor", name);
        const post = Posts.findOne(
          { name },
          { fields: { bgColor: 1, complement: 1 } }
        );
        if (post) {
          data.color = topColor(post.bgColor || post.complement);
          if (Meteor.isClient) {
            this.color = data.color;
          }
        }
      }
    }
    return data;
  },
  userReady() {
    return ! this.data.loading
      && this.context.currentUser && _.has(this.context.currentUser, "profile");
  },
  genericHandleMenuButton(name) {
    var set = null;
    if (this.state.visibleMenu !== name) {
      set = name;
    }
    this.setState({
      visibleMenu: set
    });
  },
  handleHotdog() {
    this.genericHandleMenuButton("hotdog");
  },
  toggleNotificationList() {
    this.genericHandleMenuButton("notifications");
  },
  toggleAccountActions() {
    this.genericHandleMenuButton("account");
  },
  renderLeftSub() {
    if (this.userReady()) {
      return [
        <TopBarLegitButton key="legitBtn" />,
        <TopBarDankButton key="dankBtn" />
      ];
    }
  },
  renderLeft() {
    return <ul className="leftSide topLevel">
      <NavItem className="hotdog ignore-react-onclickoutside hide-on-med-and-up">
        <a onClick={this.handleHotdog}>
          <i className="material-icons">menu</i>
        </a>
      </NavItem>
      {this.renderLeftSub()}
    </ul>;
  },
  renderSubMenus() {
    if (this.userReady()) {
      return [
        <NoSSR key="notificationList">
          <NotificationList
            notifications={this.data.notifications}
            visible={this.state.visibleMenu === "notifications"}
            action={this.toggleNotificationList}
          />
        </NoSSR>,
        <NoSSR key="accountActionsList">
          <AccountActionsList
            visible={this.state.visibleMenu === "account"}
            action={this.toggleAccountActions}
          />
        </NoSSR>
      ];
    }
  },
  renderRightSub() {
    if (this.data.loading) {
      return;
    }

    if (! this.context.currentUser) {
      return [
        <NavItem id="topLogin" key="topBarLoginBtn">
          <LoginButton />
        </NavItem>
      ];
    }

    if (! _.has(this.context.currentUser, "profile")) {
      return;
    }

    return [
      <NavItem key="topBarNotifBtn">
        <NotificationButton
          notifications={this.data.notifications}
          action={this.toggleNotificationList}
        />
      </NavItem>,
      <NavItem key="topBarAcctBtn">
        <AccountActionsButton
          action={this.toggleAccountActions}
        />
      </NavItem>
    ];
  },
  renderRight() {
    return <ul className="rightSide topLevel">
      <TopBarExploreButton />
      {this.renderRightSub()}
    </ul>;
  },
  render() {
    const style = { backgroundColor: this.props.color || this.data.color || this.color };
    return <nav className="topNav" style={style}>
      <TopBarMenu
        open={this.state.visibleMenu === "hotdog"}
        onClose={this.handleHotdog}
      />
      {this.renderSubMenus()}

      {this.renderLeft()}

      <div className="logoWrapper center hide-on-small-only">
        <a className="brand-logo" href="/">ComfyCafé</a>
      </div>

		  {this.renderRight()}
  	</nav>;
  }
});
