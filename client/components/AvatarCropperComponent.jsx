AvatarCropperComponent = React.createClass({
  render() {
    return <div className="avatarCropper">
      <div className="cropzone">
        <input className="addAvatar" type="file" />
        <img className="newAvatar" />
      </div>
      <div className="file-field input-field">
        <div className="btn">
          <span>File</span>
          <input className="addAvatar" type="file" />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <a className="toggleChangeAvatar waves-effect waves-light btn grey darken-2">
        <i className="material-icons left">cancel</i>
        Cancel
      </a>
      <a className="setAvatar waves-effect waves-light btn">
        <i className="material-icons left">crop</i>
        Crop
      </a>
    </div>;
  }
});
