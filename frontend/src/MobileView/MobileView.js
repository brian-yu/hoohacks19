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

class MobileView extends Component {
  constructor(props){
    super(props);
    this.state = {
      extracting: false,
      showResult: false,
      textResult: "",
    }
  }

  onTakePhoto(dataUri){
    // dataUri is the string of the image
    this.setState({extracting: true});
    let blob = dataURItoBlob(dataUri); // the blob contains the image representation

    var oReq = new XMLHttpRequest();
    oReq.open("POST", "https://notenodes.net/api/upload", true);
    oReq.onload = (oEvent) => {
      console.log(oEvent);
      if (oReq.readyState === oReq.DONE) {
        if (oReq.status === 200) {
            console.log(oReq.response);
            this.setState({textResult: oReq.response});
            this.setState({showResult: true});
            this.setState({extracting: false});
            this.myFunction();
        }
      }
    };
    oReq.send(blob);
    console.log("took photo");
    
  }

  showResult(){
    var txt;
    if(this.state.textResult === "No text detected"){
      txt = this.state.textResult;
    }
    else{
      txt = "Text scanned in! Result: \n" + this.state.textResult;
    }
    return (
      <div className="text-container">
        <div className="text-result" id="snackbar">{txt}</div>
      </div>
    );
  }
  hideResult(){
    this.setState({showResult: false, textResult: ""});
  }

  myFunction() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 10000);
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
          size={40}
          loading={this.state.extracting}
        />
        {this.state.showResult && this.showResult()}
      </div>
    
    );
  }
}

export default MobileView;
