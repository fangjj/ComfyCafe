Moonbox = React.createClass({
  mixins: [hotkey.Mixin("handleHotkey")],
  handleHotkey(event) {
    if (event.keyCode === 27) {
      this.handleClose();
    }
  },
  handleClose() {
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
        minScale: 1,
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
      onTouchTap={this.handleClose}
    >
      <div className="container center">
        <img src={this.props.src} ref="image" />
      </div>
    </div>;
  }
});
