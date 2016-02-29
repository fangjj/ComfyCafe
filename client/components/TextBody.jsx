TextBody = React.createClass({
  renderLines() {
    if (! this.props.text) {
      return;
    }
    return this.props.text.split("\n").map((para) => {
      const linked = autolink(para);
      return <p key={_.uniqueId()}>{linked}</p>;
    });
  },
  render() {
    return <div className={this.props.className}>
      {this.renderLines()}
    </div>;
  }
});
