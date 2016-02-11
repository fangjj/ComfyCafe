AvatarCropperComponent = React.createClass({
	getInitialState() {
		return {
			occupado: false,
			src: null
		};
	},
  addToCropzone(event) {
		var self = this;
    var files = getFiles(event);
    var reader  = new FileReader();
    reader.onloadend = function () {
			self.setState({
				occupado: true,
				src: reader.result
			});
    }
    reader.readAsDataURL(files[0]);
  },
  save(event) {
		var canvas = this.refs.cropper.getCroppedCanvas();
    canvas.toBlob(function (blob) {
      blob.name = "avatar.png";
      blob.source = "avatar";
      media.resumable.addFile(blob);
    });

		this.cancel(event);
  },
	cancel(event) {
		this.setState({
			occupado: true
		});

		// I don't think cancelAction will ever be absent; I just did this because it's funny.
		(this.props.cancelAction || (() => {}))();
	},
  render() {
		var cropper;
		if (this.state.occupado) {
			cropper = <CropperComponent
				ref="cropper"
				src={this.state.src}
				aspectRatio={1}
				dragMode="move"
				toggleDragModeOnDblclick={false}
			/>;
		} else {
			cropper = <div className="cropzone" onDrop={this.addToCropzone}>
        <input className="addAvatar" type="file" onChange={this.addToCropzone} />
        <img className="newAvatar" />
      </div>;
		}
    return <div className="avatarCropper">
			{cropper}
      <div className="file-field input-field">
        <div className="btn">
          <span>File</span>
          <input className="addAvatar" type="file" onChange={this.addToCropzone} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <a className="toggleChangeAvatar waves-effect waves-light btn grey darken-2" onClick={this.cancel}>
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
