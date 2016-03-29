import React from "react";

TopBarComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("notifications", Meteor.userId());
    return {
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
  },
  getInitialState() {
    return {
      showMobileMenu: false,
      showNotificationList: false,
      showAccountActions: false,
      visibleMenu: null
    };
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
  componentDidMount() {
    if (this.data.currentUser) {
      const seed = _.get(this.data.currentUser, "settings.patternSeed");
      if (seed) {
        setPattern(this.data.currentUser.settings.patternSeed);
      }
    }
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
        <a onTouchTap={this.handleHotdog} className="waves-effect waves-teal">
          <i className="material-icons">menu</i>
        </a>
      </NavItem>
      <TopBarMenu
        open={this.state.visibleMenu === "hotdog"}
        currentUser={this.data.currentUser}
        onClose={this.handleHotdog}
      />

      {this.renderLeftSub()}
    </ul>;
  },
  renderRightSub() {
    if (this.data.loading) {
      return;
    }

    if (! this.data.currentUser) {
      return [
        <NavItem id="topLogin" key="topBarLoginBtn">
          <BlazeToReact blazeTemplate="atNavButton"/>
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
        <AccountActionsButton action={this.toggleAccountActions} currentUser={this.data.currentUser} />
      </NavItem>
    ];
  },
  renderRight() {
    var notificationList;
    var actionList;

    if (this.userReady()) {
      notificationList = <NotificationListComponent
        notifications={this.data.notifications}
        currentUser={this.data.currentUser}
        visible={this.state.visibleMenu === "notifications"}
        action={this.toggleNotificationList}
      />;

      actionList = <AccountActionsList
        currentUser={this.data.currentUser}
        visible={this.state.visibleMenu === "account"}
        action={this.toggleAccountActions}
      />;
    }

    return <ul className="rightSide topLevel">
      <TopBarExploreButton />
      {this.renderRightSub()}
      {notificationList}
      {actionList}
    </ul>;
  },
  render() {
    return <nav className="topNav">
      {this.renderLeft()}

      <div className="logoWrapper center hide-on-small-only">
        <a className="brand-logo" href="/">ComfyCafé</a>
      </div>

		  {this.renderRight()}
  	</nav>;
  }
});
