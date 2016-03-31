import _ from "lodash";
import React from "react";
import hotkey from "react-hotkey";

import Icon from "./Icon";

if (Meteor.isClient) {
  global.jQuery = require("jquery");
  require("jquery.panzoom");
  require("jquery.mousewheel")(jQuery);
}

const Moonbox = React.createClass({
  mixins: [hotkey.Mixin("handleHotkey")],
  handleHotkey(event) {
    if (event.keyCode === 27) {
      this.handleClose();
    }
  },
  handleClose() {
    jQuery(this.refs.image).panzoom("reset");
    this.props.onClose();
  },
  componentDidMount() {
    var $panzoom = jQuery(this.refs.image).panzoom();
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
        jQuery("body").addClass("frozen");
      } else {
        _.delay(() => {
          jQuery("body").removeClass("frozen");
        }, 100);
      }
    }
  },
  componentWillUnmount() {
    jQuery("body").removeClass("frozen");
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
        <Icon>close</Icon>
      </div>
      <div className="container center" style={containerStyle}>
        <img src={this.props.src} ref="image" className={this.props.imgClassName} />
      </div>
    </div>;
  }
});

export default Moonbox;
