import React from "react";

import classConcat from "/imports/ui/client/utils/classConcat";
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
    if (event.nativeEvent.which === 1) {
      this.setState({ showMoonbox: true });
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
      imgClassName={"filter-" + this.props.pretentiousFilter || "none"}
      src={this.props.src}
      width={this.state.width}
      height={this.state.height}
      open={this.state.showMoonbox}
      onClose={this.closeMoonbox}
    />;
  },
  render() {
    const { className, filter, ...leftoverProps } = this.props;
    const classes = classConcat(className, "filter-" + filter || "none");
    return <div>
      <img
        ref="image"
        className={classes}
        onTouchTap={this.handleTouch}
        {...leftoverProps}
      />
      {this.renderMoonbox()}
    </div>;
  }
});
