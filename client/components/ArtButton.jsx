ArtButton = React.createClass({
  render() {
    var path = FlowRouter.path("feed");
    return <a href={path} className="waves-effect waves-teal">
      <i className="material-icons left">palette</i>
      <span className="hide-on-med-and-down">Art</span>
    </a>;
  }
});
