FavoriteFAB = React.createClass({
  favorite() {
    var post = this.props.post;
    Meteor.call("favoritePost", post._id, ! _.contains(post.favorited, this.props.userId));
  },
  render() {
    var favorited = _.contains(this.props.post.favorited, this.props.userId);
    return <div id="fabFavorite" className="fixed-action-btn" onClick={this.favorite}>
      <a className="btn-floating btn-large">
        <i className="large material-icons">
          {favorited ? "star" : "star_border"}
        </i>
      </a>
    </div>;
  }
});
