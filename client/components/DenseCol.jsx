DenseCol = React.createClass({
  render() {
    const classes = classConcat("col", this.props.className);
    return <Scrollable className={classes}>
      {this.props.children}
    </Scrollable>;
  }
});
