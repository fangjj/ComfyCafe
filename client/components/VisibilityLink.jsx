VisibilityLink = React.createClass({
  render() {
    const classes = classConcat("visibility", this.props.visibility);
    return <a href={this.props.href} className={classes}>
      {this.props.children}
    </a>;
  }
});
