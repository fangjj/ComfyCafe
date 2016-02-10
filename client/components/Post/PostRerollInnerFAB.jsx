PostRerollInnerFAB = React.createClass({
  reroll() {
    var self = this;
    Meteor.call("rerollPost", this.props.post._id, function (err, name) {
      var path = FlowRouter.path("post", {
        username: self.props.post.uploader.username,
        postName: name
      });
      FlowRouter.go(path);
    });
  },
  render() {
    return <li>
      <a
        id="fabReroll"
        className="btn-floating blue waves-effect waves-light tooltipped"
        data-position="left"
        data-tooltip="Reroll name!"
        onClick={this.reroll}
      ><i className="material-icons">casino</i></a>
    </li>;
  }
});
