UploadFAB = React.createClass({
  render() {
    return <div id="fabUpload" className="fixed-action-btn">
      <a className="btn-floating btn-large waves-effect waves-light tooltipped"
        data-position="left" data-tooltip="Upload a file! You can also just drop one anywhere."
      >
        <i className="material-icons">add</i>
        <input className="addFile" type="file" title="" />
      </a>
    </div>;
  }
});
