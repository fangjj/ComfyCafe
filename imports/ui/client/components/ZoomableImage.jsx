import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
import Image from "/imports/ui/client/components/Image";
import Moonbox from "/imports/ui/client/components/Moonbox";

export default React.createClass({
  getInitialState() {
    return {
      showMoonbox: false,
      width: this.props.width || 0,
      height: this.props.height || 0
    };
  },
  handleTouch(event) {
    this.setState({ showMoonbox: true });
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
      imgClassName={"filter-" + this.props.pretentiousFilter || "none"}
      src={this.props.src}
      width={this.state.width}
      height={this.state.height}
      open={this.state.showMoonbox}
      onClose={this.closeMoonbox}
    />;
  },
  render() {
    const { ...leftoverProps } = this.props;
    return <div>
      <Image
        ref="image"
        onTouchTap={this.handleTouch}
        {...leftoverProps}
      />
      {this.renderMoonbox()}
    </div>;
  }
});