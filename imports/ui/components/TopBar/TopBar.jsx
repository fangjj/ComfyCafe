import _ from "lodash";
import React from "react";
import NoSSR from "react-no-ssr";

import Notifications from "/imports/api/notifications/collection";
import Posts from "/imports/api/posts/collection";
import topColor from "/imports/ui/utils/topColor";
import TopBarArtButton from "./TopBarArtButton";
import TopBarBlogButton from "./TopBarBlogButton";
import TopBarTagButton from "./TopBarTagButton";
import TopBarChatButton from "./TopBarChatButton";
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
      ).fetch(),
      currentUser: Meteor.user()
    };
    {
      const username = FlowRouter.getParam("username");
      const name = FlowRouter.getParam("postName");
      if (username && name) {
        const handle = Meteor.subscribe("postColor", username, name);
        const post = Posts.findOne(
          {
            "owner.normalizedUsername": username.toLowerCase(),
            name
          },
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
      && this.data.currentUser && _.has(this.data.currentUser, "profile");
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
        <TopBarArtButton key="topBarArtBtn" />,
        <TopBarBlogButton key="topBarBlogBtn" />,
        <TopBarTagButton key="topBarTagBtn" />
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
            currentUser={this.data.currentUser}
            visible={this.state.visibleMenu === "notifications"}
            action={this.toggleNotificationList}
          />
        </NoSSR>,
        <NoSSR key="accountActionsList">
          <AccountActionsList
            currentUser={this.data.currentUser}
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

    if (! this.data.currentUser) {
      return [
        <NavItem id="topLogin" key="topBarLoginBtn">
          <LoginButton />
        </NavItem>
      ];
    }

    if (! _.has(this.data.currentUser, "profile")) {
      return;
    }

    return [
      <TopBarChatButton key="topBarForumBtn" />,
      <NavItem key="topBarNotifBtn">
        <NotificationButton
          notifications={this.data.notifications}
          action={this.toggleNotificationList}
        />
      </NavItem>,
      <NavItem key="topBarAcctBtn">
        <AccountActionsButton
          action={this.toggleAccountActions}
          currentUser={this.data.currentUser}
        />
      </NavItem>
    ];
  },
  renderRight() {
    var notificationList;
    var actionList;

    return <ul className="rightSide topLevel">
      <TopBarExploreButton />
      {this.renderRightSub()}
      {notificationList}
      {actionList}
    </ul>;
  },
  render() {
    const style = { backgroundColor: this.props.color || this.data.color || this.color };
    return <nav className="topNav" style={style}>
      <TopBarMenu
        open={this.state.visibleMenu === "hotdog"}
        currentUser={this.data.currentUser}
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
