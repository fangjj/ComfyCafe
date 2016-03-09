PretentiousImage = React.createClass({
  getInitialState() {
    return {
      showMoonbox: false,
      width: this.props.width,
      height: this.props.height
    };
  },
  handleTouch(event) {
    this.setState({
      showMoonbox: true
    });
  },
  closeMoonbox() {
    this.setState({
      showMoonbox: false
    });
  },
  componentDidMount() {
    const $img = $(this.refs.image);

    $img.one("load", () => {
      this.setState({
        width: $img.width(),
        height: $img.height()
      });
    });

    $(window).resize(() => {
      this.setState({
        width: $img.width(),
        height: $img.height()
      });
    });
  },
  render() {
    const classes = classConcat(
      this.props.className,
      "filter-" + this.props.pretentiousFilter || "none"
    );
    return <div>
      <img
        ref="image"
        className={classes}
        src={this.props.src}
        width={this.props.width}
        height={this.props.height}
        onTouchTap={this.handleTouch}
      />
      <Moonbox
        src={this.props.src}
        width={this.state.width}
        height={this.state.height}
        open={this.state.showMoonbox}
        onClose={this.closeMoonbox}
      />
    </div>;
  }
});
