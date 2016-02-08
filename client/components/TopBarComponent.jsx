/*
How can we replace this?
$("html").click(function () {
  _.each([$(".notifications"), $(".accountActions")], function (value) {
    if (value.css("display") !== "none") {
      value.fadeOut("fast");
    }
  });
});
*/

TopBarComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("notifications");
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
      showNotificationList: false,
      showAccountActions: false,
      query: ""
    };
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
    this.setState({
      showNotificationList: ! this.state.showNotificationList
    });
  },
  toggleAccountActions() {
    this.setState({
      showAccountActions: ! this.state.showAccountActions
    });
  },
  renderRight() {
    var browseUrl = FlowRouter.path("browse");

    var feedButton;
    var browseButton = <li>
      <a href={browseUrl} className="waves-effect waves-teal">
        <i className="material-icons left">view_comfy</i>
        <span className="hide-on-med-and-down">Browse</span>
      </a>
    </li>;
    var notificationButton;
    var actionButton;
    var loginButton;

    if (this.data.currentUser) {
      var feedUrl = FlowRouter.path("feed");
      feedButton = 	<li>
        <a href={feedUrl} className="waves-effect waves-teal">
          <i className="material-icons left">local_dining</i>
          <span className="hide-on-med-and-down">Feed</span>
        </a>
      </li>;

      if (! this.data.loading) {
        notificationButton = <li>
          <NotificationButton
            notifications={this.data.notifications}
            action={this.toggleNotificationList}
          />
        </li>;
      }
      actionButton = <li>
        <AccountActionsButton action={this.toggleAccountActions} currentUser={this.data.currentUser} />
      </li>;
    } else {
      loginButton = <li id="topLogin" className="waves-effect waves-teal">
        <BlazeToReact blazeTemplate="atNavButton"/>
      </li>;
    }

    return <ul className="right topLevel">
      {feedButton}
      {browseButton}
      {notificationButton}
      {actionButton}
      {loginButton}
    </ul>;
  },
  render() {
    var notificationList;
    var actionList;

    if (this.data.currentUser) {
      if (! this.data.loading) {
        notificationList = <NotificationListComponent
          notifications={this.data.notifications}
          visible={this.state.showNotificationList}
        />;
      }

      actionList = <AccountActionsComponent
        currentUser={this.data.currentUser}
        visible={this.state.showAccountActions}
      />;
    }

    return <nav id="topBar">
  		<div className="nav-wrapper">
  			<ul className="left topLevel">
  				<li className="searchButton">
  					<a className="waves-effect waves-teal">
  						<i className="material-icons">search</i>
  						<label htmlFor="search"></label>
  					</a>
  				</li>
  			</ul>

  			<a className="brand-logo center hide-on-small-only" href="/">TeruImages</a>

  		  {this.renderRight()}

        {notificationList}
        {actionList}

        <form id="searchForm" onSubmit={this.search}>
  				<div className="input-field">
  					<input id="search" type="search" onChange={this.handleSearchInput} />
  					<i className="material-icons searchClose">close</i>
  				</div>
  			</form>
  		</div>
  	</nav>;
  }
});
