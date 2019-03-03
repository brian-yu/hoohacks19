import React, { Component } from 'react';
import Camera, {
  IMAGE_TYPES,
  FACING_MODES
} from 'react-html5-camera-photo';
import {BeatLoader} from 'react-spinners';

import './MobileView.css';

// taken from the example save photo to local file js at
// https://github.com/MABelanger/react-html5-camera-photo/blob/b0b76f4114fb572e3d95e2f8c4fd4b955b7c5682/src/demo/AppSaveToLocalFile.js
function dataURItoBlob (dataURI) {
  let byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  let blob = new Blob([ab], {type: mimeString});
  return blob;
}

function padWithZeroNumber (number, width) {
  number = number + '';
  return number.length >= width
    ? number
    : new Array(width - number.length + 1).join('0') + number;
}

function getFileExtention (blobType) {
  // by default the extention is .png
  let extention = IMAGE_TYPES.PNG;

  if (blobType === 'image/jpeg') {
    extention = IMAGE_TYPES.JPG;
  }
  return extention;
}

function getFileName (imageNumber, blobType) {
  const prefix = 'photo';
  const photoNumber = padWithZeroNumber(imageNumber, 4);
  const extention = getFileExtention(blobType);

  return `${prefix}-${photoNumber}.${extention}`;
}

function downloadImageFileFomBlob (blob, imageNumber) {
  window.URL = window.webkitURL || window.URL;

  let anchor = document.createElement('a');
  anchor.download = getFileName(imageNumber, blob.type);
  anchor.href = window.URL.createObjectURL(blob);
  let mouseEvent = document.createEvent('MouseEvents');
  mouseEvent.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
  anchor.dispatchEvent(mouseEvent);
}

class MobileView extends Component {
  constructor(props){
    super(props);
    this.state = {extracting: false}
  }

  onTakePhoto(dataUri){
    // dataUri is the string of the image
    this.state.extracting = true;
    let blob = dataURItoBlob(dataUri); // the blob contains the image representation

    var oReq = new XMLHttpRequest();
    oReq.open("POST", "https://horum.serveo.net/upload", true);
    oReq.onload = function (oEvent) {
      console.log(oEvent);
      if (oReq.readyState === oReq.DONE) {
        if (oReq.status === 200) {
            console.log(oReq.response);
        }
      }
    };
    oReq.send(blob);
    console.log("took photo");
    this.state.extracting = false;
  }
  
  render() {
    return (
      <div className="App">
        <Camera 
          onTakePhoto={ (dataURL) => {this.onTakePhoto(dataURL);} }
          imageType={IMAGE_TYPES.PNG}
          idealFacingMode={FACING_MODES.ENVIRONMENT}
          isImageMirror={false}
        />
        <BeatLoader
          sizeUnit={"px"}
          size={150}
          loading={this.state.extracting}
        />
      </div>
    
    );
  }
}

export default MobileView;
