BlogListItem = React.createClass({
  render() {
    return <li>
      <article className="content">
        {this.props.post.body}
      </article>
    </li>;
  }
});
