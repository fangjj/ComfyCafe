TextBody = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return muxOr([
      this.props.text !== nextProps.text,
      // className probably won't change, but just in case...
      this.props.className !== nextProps.className
    ]);
  },
  transform() {
    $(this.refs.body).html(marked($(this.refs.body).html()));
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
  render() {
    return <div className={this.props.className} ref="body">
      {this.props.text}
    </div>;
  }
});
