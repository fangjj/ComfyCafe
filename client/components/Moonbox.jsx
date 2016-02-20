Moonbox = React.createClass({
  /*
  mixins: [OnClickOutside],
  handleClickOutside(event) {
    if (this.props.open) {
      this.props.onClose();
    }
  },*/
  preClose() {
    $(this.refs.image).panzoom("reset");
    this.props.onClose();
  },
  componentDidMount() {
    var $panzoom = $(this.refs.image).panzoom();
    $panzoom.parent().on("mousewheel.focal", function (event) {
      event.preventDefault();
      var delta = event.delta || event.originalEvent.wheelDelta;
      var zoomOut = delta ? delta < 0 : event.originalEvent.deltaY > 0;
      $panzoom.panzoom("zoom", zoomOut, {
        increment: 0.12,
        animate: false,
        focal: event
      });
    });
  },
  render() {
    return <div
      className="moonbox center"
      style={{display: this.props.open ? "flex" : "none"}}
      onTouchTap={this.preClose}
    >
      <img src={this.props.src} ref="image" />
    </div>;
  }
});
