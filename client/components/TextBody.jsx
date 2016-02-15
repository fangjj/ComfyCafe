TextBody = React.createClass({
  renderLines() {
    return this.props.text.split("\n").map((line) => {
      return <p key={_.uniqueId()}>{line}</p>;
    });
  },
  render() {
    return <div className={this.props.className}>
      {this.renderLines()}
    </div>;
  }
});
