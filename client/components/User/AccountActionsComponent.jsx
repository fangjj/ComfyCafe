AccountActionsComponent = React.createClass({
  mixins: [OnClickOutside],
  handleClickOutside(event) {
    if (this.props.visible) {
      this.props.action();
    }
  },
  render() {
    var classes = "accountActions";
    if (this.props.visible) {
      classes = "accountActions active";
    }

    var profileUrl = FlowRouter.path("profile", {username: this.props.currentUser.username});
    var likesUrl = FlowRouter.path("likes");
    var yourArtUrl = FlowRouter.path("artBy", {username: this.props.currentUser.username});
    var yourBlogUrl = FlowRouter.path("blogBy", {username: this.props.currentUser.username});
    var favoritesUrl = FlowRouter.path("favorites");
    var invitesUrl = FlowRouter.path("invites");
    var settingsUrl = FlowRouter.path("settings");

    return <div>
      <div id="accountActionsArrow" className={classes}></div>
      <div id="accountActions" className={classes}>
        <ul>
          <li>
            <a href={profileUrl} className="waves-effect waves-teal">
              <i className="material-icons left">account_circle</i>
              <span>Profile</span>
            </a>
          </li>
          <li>
            <a href={likesUrl} className="waves-effect waves-teal">
              <i className="material-icons left">favorite</i>
              <span>Likes</span>
            </a>
          </li>
          <li>
            <a href={yourArtUrl} className="waves-effect waves-teal">
              <i className="material-icons left">view_comfy</i>
              <span>Your Art</span>
            </a>
          </li>
          <li>
            <a href={yourBlogUrl} className="waves-effect waves-teal">
              <i className="material-icons left">view_list</i>
              <span>Your Blog</span>
            </a>
          </li>
          <li>
            <a href={invitesUrl} className="waves-effect waves-teal">
              <i className="material-icons left">weekend</i>
              <span>Beta Invites</span>
            </a>
          </li>
          <li>
            <a href={settingsUrl} className="waves-effect waves-teal">
              <i className="material-icons left">settings</i>
              <span>Settings</span>
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
