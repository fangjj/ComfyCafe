PostDeleteInnerFAB = React.createClass({
  delete() {
    Meteor.call("deletePost", this.props.post._id, function () {
      FlowRouter.go("/");
    });
  },
  render() {
    return <li>
      <a
        id="fabDelete"
        className="btn-floating red waves-effect waves-light tooltipped"
        data-position="left"
        data-tooltip="Delete post?"
        onClick={this.delete}
      ><i className="material-icons">delete</i></a>
    </li>;
  }
});
