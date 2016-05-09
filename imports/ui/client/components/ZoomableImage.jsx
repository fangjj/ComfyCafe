import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
import Moonbox from "/imports/ui/client/components/Moonbox";
import ImageSpoiler from "/imports/ui/client/components/ImageSpoiler";

export default React.createClass({
  getInitialState() {
    return {
      spoilered: true,
      showMoonbox: false,
      width: this.props.width || 0,
      height: this.props.height || 0
    };
  },
  handleTouch(event) {
    if (event.nativeEvent.which === 1) {
      if (this.state.spoilered) {
        this.setState({ spoilered: false });
      } else {
        this.setState({ showMoonbox: true });
      }
    }
  },
  closeMoonbox() {
    this.setState({ showMoonbox: false });
  },
  handleResize() {
    const $img = $(this.refs.image);
    this.setState({
      width: $img.width(),
      height: $img.height()
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

    window.addEventListener("resize", this.handleResize);
  },
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  renderMoonbox() {
    return <Moonbox
      src={this.props.src}
      width={this.state.width}
      height={this.state.height}
      open={this.state.showMoonbox}
      onClose={this.closeMoonbox}
    />;
  },
  render() {
    return <div>
      <img
        ref="image"
        onTouchTap={this.handleTouch}
        {...this.props}
      />
      {this.renderMoonbox()}
    </div>;
  }
});
