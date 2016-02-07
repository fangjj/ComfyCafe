TopBarComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("notifications");
    return {
      loading: ! handle.ready(),
      notifications: Notifications.find(
        { to: Meteor.userId() },
        { sort: { createdAt: -1 } }
      ).fetch()
    };
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

    if (Meteor.userId()) {
      var feedUrl = FlowRouter.path("feed");
      feedButton = 	<li>
        <a href={feedUrl} className="waves-effect waves-teal">
          <i className="material-icons left">local_dining</i>
          <span className="hide-on-med-and-down">Feed</span>
        </a>
      </li>;
      if (! this.data.loading) {
        notificationButton = <li>
          <NotificationButton notifications={this.data.notifications} />
        </li>;
      }
      actionButton = <li>
        <AccountActionsButton />
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

  			<form id="searchForm">
  				<div className="input-field">
  					<input id="search" type="search" />
  					<i className="material-icons searchClose">close</i>
  				</div>
  			</form>
  		</div>
  	</nav>;
  }
});
