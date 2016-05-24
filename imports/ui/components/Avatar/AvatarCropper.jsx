import React from "react";
import NativeListener from "react-native-listener";

import media from "/imports/api/media/collection";
import { getFiles } from "/imports/api/media/eachFile";
import Icon from "/imports/ui/components/Daikon/Icon";
import Actions from "/imports/ui/components/Actions";
import CancelButton from "/imports/ui/components/Button/CancelButton";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import CropperComponent from "/imports/ui/components/extern/CropperComponent";

export default React.createClass({
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
          <input
						className="addAvatar"
						type="file"
						accept="image/*"
						onChange={this.addToCropzone}
					/>
          <img className="newAvatar" />
        </div>
      </NativeListener>;
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
      {this.renderActions()}
    </div>;
  }
});
