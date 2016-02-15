TopBarBlogButton = React.createClass({
  render() {
    var path = FlowRouter.path("blog");
    return <li>
      <a href={path} className="waves-effect waves-teal">
        <i className="material-icons left">import_contacts</i>
        <span className="hide-on-med-and-down">Blog</span>
      </a>
    </li>;
  }
});
