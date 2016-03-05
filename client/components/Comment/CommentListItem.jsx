CommentListItem = React.createClass({
  render() {
    return <li>
      <TextBody text={this.props.comment.body} />
    </li>;
  }
});
