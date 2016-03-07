let {
  RaisedButton,
  FontIcon
} = mui;

AvatarCropperComponent = React.createClass({
	getInitialState() {
		return {
			occupado: false,
			src: null
		};
	},
  addToCropzone(event) {
    event.preventDefault();
    event.stopPropagation();
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
        className="cropzone active"
				ref="cropper"
				src={this.state.src}
				aspectRatio={1}
				dragMode="move"
        built={function () {
          this.cropper.setCropBoxData({
            left: 0,
            top: 0,
            width: 512,
            height: 512
          });
        }}
			/>;
		} else {
      // Use NativeListener to prevent bubbling to the global dropzone on <html>
      cropper = <NativeListener onDrop={this.addToCropzone}>
        <div className="cropzone">
          <input className="addAvatar" type="file" onChange={this.addToCropzone} />
          <img className="newAvatar" />
        </div>
      </NativeListener>;
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
			<CancelButton
				onTouchTap={this.cancel}
			/>
			<RaisedButton
				label="Crop"
        labelStyle={{fontSize: "18px"}}
				secondary={true}
				icon={<FontIcon className="material-icons">crop</FontIcon>}
				onTouchTap={this.save}
			/>
    </div>;
  }
});
