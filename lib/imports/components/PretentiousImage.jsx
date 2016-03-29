import React from "react";

import Moonbox from "./Moonbox";

const PretentiousImage = React.createClass({
  getInitialState() {
    return {
      showMoonbox: false,
      width: this.props.width || 0,
      height: this.props.height || 0
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
  handleResize() {
    const $img = $(this.refs.image);
    this.setState({
      width: $img.width(),
      height: $img.height()
    });
  },
  componentDidMount() {
    if (this.props.moonbox) {
      const $img = $(this.refs.image);

      $img.one("load", () => {
        this.setState({
          width: $img.width(),
          height: $img.height()
        });
      });

      window.addEventListener("resize", this.handleResize);
    }
  },
  componentWillUnmount: function() {
    if (this.props.moonbox) {
      window.removeEventListener("resize", this.handleResize);
    }
  },
  renderMoonbox() {
    if (this.props.moonbox) {
      return <Moonbox
        imgClassName={"filter-" + this.props.pretentiousFilter || "none"}
        src={this.props.src}
        width={this.state.width}
        height={this.state.height}
        open={this.state.showMoonbox}
        onClose={this.closeMoonbox}
      />;
    }
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
      {this.renderMoonbox()}
    </div>;
  }
});

export default PretentiousImage;
