TopBarComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.withoutBar.subscribe("notifications", Meteor.userId());
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
  handleHotdog() {
    var result = ! this.state.showMobileMenu;
    var obj = {
      showMobileMenu: result
    };
    if (result) {
      obj.showAccountActions = false;
      obj.showNotificationList = false;
    }
    this.setState(obj);
    /*var set = null;
    if (this.state.visibleMenu !== "hotdog") {

    }
    this.setState({
      visibleMenu: this.state.showMobileMenu
    });*/
  },
  toggleNotificationList() {
    var result = ! this.state.showNotificationList;
    var obj = {
      showNotificationList: result
    };
    if (result) {
      obj.showMobileMenu = false;
      obj.showAccountActions = false;
    }
    this.setState(obj);
  },
  toggleAccountActions() {
    var result = ! this.state.showAccountActions;
    var obj = {
      showAccountActions: result
    };
    if (result) {
      obj.showMobileMenu = false;
      obj.showNotificationList = false;
    }
    this.setState(obj);
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
        open={this.state.showMobileMenu}
        onClose={this.handleHotdog}
      />

      {this.renderLeftSub()}
    </ul>;
  },
  renderRightSub() {
    if (this.userReady()) {
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
    } else {
      return [
        <li id="topLogin" className="waves-effect waves-teal" key="topBarLoginBtn">
          <BlazeToReact blazeTemplate="atNavButton"/>
        </li>
      ];
    }
  },
  renderRight() {
    var notificationList;
    var actionList;

    if (this.userReady()) {
      notificationList = <NotificationListComponent
        notifications={this.data.notifications}
        visible={this.state.showNotificationList}
        action={this.toggleNotificationList}
      />;

      actionList = <AccountActionsComponent
        currentUser={this.data.currentUser}
        visible={this.state.showAccountActions}
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
