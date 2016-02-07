AccountActionsComponent = React.createClass({
  render() {
    var profileUrl = FlowRouter.path("profile", {username: Meteor.user().username});
    var yourPostsUrl = FlowRouter.path("yourPosts");
    var favoritesUrl = FlowRouter.path("favorites");
    var invitesUrl = FlowRouter.path("invites");
    var settingsUrl = FlowRouter.path("settings");

    return <div>
      <div id="accountActionsArrow" className="accountActions"></div>
      <div id="accountActions" className="accountActions">
        <ul>
          <li>
            <a href={profileUrl} className="waves-effect waves-teal">
              <i className="material-icons left">account_circle</i>
              <span>View Profile</span>
            </a>
          </li>
          <li>
            <a href={yourPostsUrl} className="waves-effect waves-teal">
              <i className="material-icons left">view_comfy</i>
              <span>Manage Posts</span>
            </a>
          </li>
          <li>
            <a href={favoritesUrl} className="waves-effect waves-teal">
              <i className="material-icons left">star</i>
              <span>Favorites (Deprecated)</span>
            </a>
          </li>
          <li>
            <a href={invitesUrl} className="waves-effect waves-teal">
              <i className="material-icons left">weekend</i>
              <span>Manage Invites</span>
            </a>
          </li>
          <li>
            <a href={settingsUrl} className="waves-effect waves-teal">
              <i className="material-icons left">settings</i>
              <span>Edit Settings</span>
            </a>
          </li>
        </ul>
        <div className="row">
          <div className="col s12">
            <BlazeToReact blazeTemplate="atNavButton"/>
          </div>
        </div>
      </div>
    </div>;
  }
});
