TopBarChatButton = React.createClass({
  render() {
    var path = FlowRouter.path("roomList");
    return <li>
      <a href={path} className="waves-effect waves-teal">
        <i className="material-icons">forum</i>
      </a>
    </li>;
  }
});
