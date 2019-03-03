import React, { Component } from 'react';
import Camera, {IMAGE_TYPES} from 'react-html5-camera-photo';

//import logo from './logo.svg';
import './App.css';

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

function downloadImageFile (dataUri, imageNumber) {
  let blob = dataURItoBlob(dataUri);
  downloadImageFileFomBlob(blob, imageNumber);
}


class App extends Component {
  constructor(){
    super();
    this.imageNumber = 0;
  }

  onTakePhoto(dataUri){
    // dataUri

    //downloadImageFile(dataUri, this.imageNumber);
    let blob = dataURItoBlob(dataUri);
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    var data = reader.result;
    data = data.split(",").pop();

    var oReq = new XMLHttpRequest();
    oReq.open("POST", "http://localhost:3001/upload", true);
    oReq.onload = function (oEvent) {
      console.log(oEvent);
    };

    //var blob = new Blob(['abc123'], {type: 'text/plain'});

    oReq.send(blob);
    // fetch('http://localhost:3001/upload', {
    //   method: 'POST',
    //   headers: {"Content-Type": "application/json"},
    //   body: JSON.stringify(data)
    // }).then(function(response){
    //   console.log(response.body);
    //   return response.text();
    // }).then(function(text){
    //   console.log(text);
    // });

    // fetch('http://localhost:3001/')
    // .then(function(response) {
    //   console.log(response.body);
    //   return response.text();
    // })
    // .then(function(text) {
    //   console.log(text);
    // });

    this.imageNumber += 1;
    console.log("took photo");
  }
  
  render() {


    return (
      <div className="App">
        <Camera 
          onTakePhoto={ (dataURL) => {this.onTakePhoto(dataURL);} }
          imageType={IMAGE_TYPES.PNG}
        />
      </div>
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.js</code> and save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
    );
  }
}

export default App;
