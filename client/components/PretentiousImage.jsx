PretentiousImage = React.createClass({
  render() {
    const classes = classConcat(
      this.props.className,
      "filter-" + this.props.pretentiousFilter || "none"
    );
    return <img
      className={classes}
      src={this.props.src}
      width={this.props.width}
      height={this.props.height}
      onTouchTap={this.props.onTouchTap}
    />
  }
});
