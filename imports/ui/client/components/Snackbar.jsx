import React from "react";

export default React.createClass({
  autoHide(props) {
    if (props.open) {
      const duration = props.autoHideDuration || 4000;
      this.timeoutId = window.setTimeout(() => {
        props.onRequestClose();
      }, duration);
    } else {
      window.clearTimeout(this.timeoutId);
    }
  },
  componentDidMount() {
    this.autoHide(this.props);
  },
  componentWillReceiveProps(nextProps) {
    this.autoHide(nextProps);
  },
  componentWillUnmount() {
    window.clearTimeout(this.timeoutId);
  },
  render() {
    if (this.props.unexist) {
      return null;
    }

    const style = {};
    const y = this.props.open ? 0 : 52; // 52 = snackbar height (hopefully)
    style.transform = "translate3d(0, " + y + "px, 0)";
    return <div className="snackbar" style={style}>
      <div>
        {this.props.message}
      </div>
    </div>;
  }
});
