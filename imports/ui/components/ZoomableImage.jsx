import React from "react";

import classConcat from "/imports/ui/utils/classConcat";
import Moonbox from "/imports/ui/components/Moonbox";
import ImageSpoiler from "/imports/ui/components/ImageSpoiler";

export default React.createClass({
  getInitialState() {
    return {
      showMoonbox: false,
      width: this.props.width || 0,
      height: this.props.height || 0
    };
  },
  handleTouch(event) {
    if (event.nativeEvent.which === 1) {
      const $img = $(this.refs.image);
      this.setState({
        width: $img.width(),
        height: $img.height(),
        showMoonbox: true
      });
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
        onClick={this.handleTouch}
        {...this.props}
      />
      {this.renderMoonbox()}
    </div>;
  }
});
