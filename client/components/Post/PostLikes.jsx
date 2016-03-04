PostLikes = React.createClass({
  render() {
    return <section className="likes content">
      <header>
        <h4>Liked by</h4>
      </header>
      <UserList userIds={this.props.likes} />
    </section>;
  }
});
