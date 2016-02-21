/*
https://github.com/roadmanfong/react-cropper

The MIT License (MIT)

Copyright (c) 2015 Kuanghui Fong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

CropperComponent = React.createClass({
  propTypes: {
    // react cropper options
    crossOrigin: React.PropTypes.string,
    src: React.PropTypes.string,
    alt: React.PropTypes.string,

    // cropper options
    aspectRatio: React.PropTypes.number,
    crop: React.PropTypes.func,
    preview: React.PropTypes.string,
    strict: React.PropTypes.bool,
    responsive: React.PropTypes.bool,
    checkImageOrigin: React.PropTypes.bool,
    background: React.PropTypes.bool,
    modal: React.PropTypes.bool,
    guides: React.PropTypes.bool,
    highlight: React.PropTypes.bool,
    autoCrop: React.PropTypes.bool,
    autoCropArea: React.PropTypes.number,
    dragCrop: React.PropTypes.bool,
    movable: React.PropTypes.bool,
    cropBoxMovable: React.PropTypes.bool,
    cropBoxResizable: React.PropTypes.bool,
    doubleClickToggle: React.PropTypes.bool,
    zoomable: React.PropTypes.bool,
    mouseWheelZoom: React.PropTypes.bool,
    touchDragZoom: React.PropTypes.bool,
    rotatable: React.PropTypes.bool,
    minContainerWidth: React.PropTypes.number,
    minContainerHeight: React.PropTypes.number,
    minCanvasWidth: React.PropTypes.number,
    minCanvasHeight: React.PropTypes.number,
    minCropBoxWidth: React.PropTypes.number,
    minCropBoxHeight: React.PropTypes.number,
    build: React.PropTypes.func,
    built: React.PropTypes.func,
    dragstart: React.PropTypes.func,
    dragmove: React.PropTypes.func,
    dragend: React.PropTypes.func,
    zoomin: React.PropTypes.func,
    zoomout: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      src: null
    };
  },

  componentDidMount() {
    console.log('componentDidMount');
    var options = {};
    for(var prop in this.props){
      if(prop !== 'src' && prop !== 'alt' && prop !== 'crossOrigin'){
        options[prop] = this.props[prop];
      }
    }
    this.img = ReactDOM.findDOMNode(this.refs.img);
    console.log('options');
    console.log(options)
    this.cropper =  new Cropper(this.img, options);
  },

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps');
    if(nextProps.src !== this.props.src){
      this.cropper.reset().clear().replace(nextProps.src);
    }
    if(nextProps.aspectRatio !== this.props.aspectRatio){
      this.setAspectRatio(nextProps.aspectRatio);
    }
  },

  componentWillUnmount() {
    console.log('componentWillUnmount');
    if(this.img) {
      // Destroy the cropper, this makes sure events such as resize are cleaned up and do not leak
      this.cropper.destroy();
      delete this.img;
      delete this.cropper;
    }
  },

  crop() {
    return this.cropper.crop;
  },

  move(offsetX, offsetY){
    return this.cropper.move(offsetX, offsetY);
  },

  zoom(ratio){
    return this.cropper.zoom(ratio);
  },

  rotate(degree){
    return this.cropper.rotate(degree);
  },

  enable(){
    return this.cropper.enable();
  },

  disable(){
    return this.cropper.disable();
  },

  reset(){
    return this.cropper.reset();
  },

  clear(){
    return this.cropper.clear();
  },

  replace(url){
    return this.cropper.replace(url);
  },

  getData(rounded){
    return this.cropper.getData(rounded);
  },

  setData(data) {
    return this.cropper.setData(data);
  },

  getContainerData(){
    return this.cropper.getContainerData();
  },

  getImageData(){
    return this.cropper.getImageData();
  },

  getCanvasData(){
    return this.cropper.getCanvasData();
  },

  setCanvasData(data){
    return this.cropper.setCanvasData(data);
  },

  getCropBoxData(){
    return this.cropper.getCropBoxData();
  },

  setCropBoxData(data){
    return this.cropper.setCropBoxData(data);
  },

  getCroppedCanvas(options){
    return this.cropper.getCroppedCanvas(options);
  },

  setAspectRatio(aspectRatio){
    return this.cropper.setAspectRatio(aspectRatio);
  },

  setDragMode(){
    return this.cropper.setDragMode();
  },

  render() {
    return (
      <div {...this.props} src={null} crossOrigin={null} alt={null} style={{}}>
        <img
          crossOrigin={this.props.crossOrigin}
          ref='img'
          src={this.props.src}
          alt={this.props.alt === undefined ? 'picture' : this.props.alt}
          style={{opacity: 0}}
          />
      </div>
    );
  }
});
