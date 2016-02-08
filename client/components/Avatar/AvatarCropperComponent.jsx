var cropperOptions = {
	aspectRatio: 1,
	dragMode: "move",
	toggleDragModeOnDblclick: false
};

AvatarCropperComponent = React.createClass({
  addToCropzone(event) {
    var files = getFiles(event);
    var reader  = new FileReader();
    reader.onloadend = function () {
      var cropperInitialized = $(".newAvatar").hasClass("cropper-hidden");
      if (cropperInitialized) {
        $(".newAvatar").one("built.cropper", function () {

        }).cropper("reset").cropper("replace", reader.result).cropper(cropperOptions);
      } else {
        $(".cropzone").addClass("active");
        $(".newAvatar").attr("src", reader.result);
        $(".newAvatar").cropper(cropperOptions);
      }
    }
    reader.readAsDataURL(files[0]);
  },
  save(event) {
    //Template.instance().isChangingAvatar.set(false);
    var canvas = $(".newAvatar").cropper("getCroppedCanvas");
    canvas.toBlob(function (blob) {
      blob.name = "avatar.png";
      blob.source = "avatar";
      media.resumable.addFile(blob);
    });
  },
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
      <a className="setAvatar waves-effect waves-light btn" onClick={this.save}>
        <i className="material-icons left">crop</i>
        Crop
      </a>
    </div>;
  }
});
