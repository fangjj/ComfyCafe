TopBarComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("notifications", Meteor.userId());
    return {
      loading: ! handle.ready(),
      notifications: Notifications.find(
        { to: Meteor.userId() },
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
      visibleMenu: null,
      query: ""
    };
  },
  userReady() {
    return ! this.data.loading
      && this.data.currentUser && _.has(this.data.currentUser, "profile");
  },
  handleSearchInput(event) {
    this.setState({query: event.target.value})
  },
  search(event) {
    event.preventDefault();
    var path = FlowRouter.path("search", {rawTagStr: tagStrToUrl(this.state.query)});
    FlowRouter.go(path);
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
        <a onTouchTap={this.handleHotdog} className="waves-effect waves-teal">
          <i className="material-icons">menu</i>
        </a>
      </NavItem>
      <TopBarMenu
        open={this.state.visibleMenu === "hotdog"}
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
        visible={this.state.visibleMenu === "notifications"}
        action={this.toggleNotificationList}
      />;

      actionList = <AccountActionsComponent
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