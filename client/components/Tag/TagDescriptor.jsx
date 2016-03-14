TagDescriptor = React.createClass({
  renderAdjs() {
    if (! _.isEmpty(this.props.adjs)) {
      return this.props.adjs.map((a) => {
        return <TagAdjective adj={a} />;
      });
    }
  },
  render() {
    return <li className="descriptor">
      {this.renderAdjs()}
      <TagNoun noun={this.props.noun} />
    </li>;
  }
});
