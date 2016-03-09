TagAdjective = React.createClass({
  concat() {
    if (this.props.adjectives) {
      return this.props.adjectives.map((a) => { return a.name; }).join(" ");
    }
  },
  render() {
    return <a className="taglet adj">{this.concat()}</a>
  }
});
