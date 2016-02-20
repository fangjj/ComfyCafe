MediumComponent = React.createClass({
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
    var medium = this.props.medium;
    var type = medium.contentType.split("/")[0];
    var src = "/gridfs/media/" + medium.md5;
    var medium = {
      image: <img className="medium" src={src} onTouchTap={this.handleTouch} />,
      video: <video className="medium" id={"video" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </video>,
      audio: <audio className="medium" id={"audio" + medium._id} src={src} controls>
        <source src={src} type={medium.contentType} />
      </audio>
    }[type];
    return <div className="mediumContainer">
      {medium}
      {this.renderMoonbox(type, src)}
    </div>;
  }
});
