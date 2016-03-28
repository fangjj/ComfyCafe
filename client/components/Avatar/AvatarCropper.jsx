let {
  RaisedButton,
  FontIcon
} = mui;

AvatarCropper = React.createClass({
	getInitialState() {
    if (this.props.src) {
      return {
  			occupado: true,
  			src: this.props.src
  		};
    } else {
  		return {
  			occupado: false,
  			src: null
  		};
    }
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
			occupado: false
		});

		// I don't think cancelAction will ever be absent; I just did this because it's funny.
		(this.props.cancelAction || (() => {}))();
	},
  renderCropper() {
    if (this.state.occupado) {
      return <CropperComponent
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
      return <NativeListener onDrop={this.addToCropzone}>
        <div className="cropzone">
          <input className="addAvatar" type="file" onChange={this.addToCropzone} />
          <img className="newAvatar" />
        </div>
      </NativeListener>;
    }
  },
  renderInput() {
    if (! this.props.src) {
      return <div className="file-field input-field">
        <div className="btn">
          <span>File</span>
          <input className="addAvatar" type="file" onChange={this.addToCropzone} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>;
    }
  },
  renderActions() {
    return <Actions>
      <CancelButton
        onTouchTap={this.cancel}
      />
      <SubmitButton
        label="Crop"
        iconName="crop"
        onTouchTap={this.save}
      />
    </Actions>;
  },
  render() {
    return <div className="avatarCropper">
			{this.renderCropper()}
      {this.renderInput()}
      {this.renderActions()}
    </div>;
  }
});
