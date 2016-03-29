import _ from "lodash";
import React from "react";
import hotkey from "react-hotkey";

import {
  FontIcon
} from "material-ui";

const Moonbox = React.createClass({
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
  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.props.open) {
      if (nextProps.open) {
        $("body").addClass("frozen");
      } else {
        _.delay(() => {
          $("body").removeClass("frozen");
        }, 100);
      }
    }
  },
  componentWillUnmount() {
    $("body").removeClass("frozen");
  },
  render() {
    const containerStyle = {
      width: this.props.width + 20,
      height: this.props.height + 20
    };
    return <div
      className="moonbox center"
      style={{display: this.props.open ? "flex" : "none"}}
      onTouchTap={this.handleClose}
    >
      <div className="close" onTouchTap={this.handleClose}>
        <FontIcon className="material-icons">close</FontIcon>
      </div>
      <div className="container center" style={containerStyle}>
        <img src={this.props.src} ref="image" className={this.props.imgClassName} />
      </div>
    </div>;
  }
});

export default Moonbox;
