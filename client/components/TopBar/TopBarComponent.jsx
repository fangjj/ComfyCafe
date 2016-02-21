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
      query: ""
    };
  },
  userReady() {
    return ! this.data.loading
      && this.data.currentUser && _.has(this.data.currentUser, "profile");
  },
  handleHotdog() {
    this.setState({
      showMobileMenu: ! this.state.showMobileMenu
    });
  },
  handleSearchInput(event) {
    this.setState({query: event.target.value})
  },
  search(event) {
    event.preventDefault();
    var path = FlowRouter.path("search", {rawTagStr: tagStrToUrl(this.state.query)});
    FlowRouter.go(path);
  },
  toggleNotificationList() {
    var result = ! this.state.showNotificationList;
    var obj = {
      showNotificationList: result
    };
    if (result && this.state.showAccountActions) {
      obj.showAccountActions = false;
    }
    this.setState(obj);
  },
  toggleAccountActions() {
    var result = ! this.state.showAccountActions;
    var obj = {
      showAccountActions: result
    };
    if (result && this.state.showNotificationList) {
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
    return <ul className="leftSide topLevel hide-on-small-only">
      {this.renderLeftSub()}
    </ul>;
  },
  renderRightSub() {
    if (this.userReady()) {
      return [
        <TopBarChatButton key="topBarForumBtn" />,
        <li key="topBarNotifBtn">
          <NotificationButton
            notifications={this.data.notifications}
            action={this.toggleNotificationList}
          />
        </li>,
        <li key="topBarAcctBtn">
          <AccountActionsButton action={this.toggleAccountActions} currentUser={this.data.currentUser} />
        </li>
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
      <a
        className="hotdog ignore-react-onclickoutside hide-on-med-and-up"
        onTouchTap={this.handleHotdog}
      >
        <i className="material-icons">menu</i>
      </a>
      <TopBarMenu
        open={this.state.showMobileMenu}
        onClose={this.handleHotdog}
      />

      {this.renderLeft()}

      <div className="logoWrapper center hide-on-small-only">
        <a className="brand-logo" href="/">ComfyCafé</a>
      </div>

		  {this.renderRight()}
  	</nav>;
  }
});
