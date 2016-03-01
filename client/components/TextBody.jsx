TextBody = React.createClass({
  transform() {
    $(this.refs.body).html(Autolinker.link($(this.refs.body).html(), {
      newWindow: false,
      stripPrefix: false
    }));
    $(this.refs.body).html(emojione.toImage($(this.refs.body).html()));
  },
  componentDidMount() {
    this.transform();
  },
  componentDidUpdate() {
    this.transform();
  },
  renderLines() {
    if (! this.props.text) {
      return;
    }
    return this.props.text.split("\n").map((para) => {
      return <p key={_.uniqueId()}>{para}</p>;
    });
  },
  render() {
    return <div className={this.props.className} ref="body">
      {this.renderLines()}
    </div>;
  }
});
