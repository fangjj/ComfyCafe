Medium = React.createClass({
  getInitialState() {
    return {
      showMoonbox: false
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
  renderMoonbox(type, src) {
    if (type === "image") {
      return <Moonbox src={src} open={this.state.showMoonbox} onClose={this.closeMoonbox} />;
    }
  },
  render() {
    const medium = this.props.medium;
    const type = medium.contentType.split("/")[0];
    const src = "/gridfs/media/" + medium.md5;
    let classes = classConcat("medium", this.props.className);
    const mediumCmp = {
      image: <PretentiousImage
        className={classes}
        src={src}
        width={medium.width}
        height={medium.height}
        pretentiousFilter={this.props.pretentiousFilter}
        onTouchTap={this.handleTouch}
      />,
      video: <video className="medium" id={"video" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </video>,
      audio: <audio className="medium" id={"audio" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </audio>
    }[type];
    return <div className="mediumContainer">
      {mediumCmp}
      {this.renderMoonbox(type, src)}
    </div>;
  }
});
