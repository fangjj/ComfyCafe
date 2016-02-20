TopBarExploreButton = React.createClass({
  render() {
    var path = FlowRouter.path("explore");
    return <li className="hide-on-small-only">
      <a href={path} className="waves-effect waves-teal">
        <i className="material-icons left">explore</i>
        <span className="hide-on-med-and-down">Explore</span>
      </a>
    </li>;
  }
});
