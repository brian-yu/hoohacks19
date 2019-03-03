import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
//import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {

    fetch('backend:5000')
      .then(function(response) {
        console.log(response.body);
        return response.json();
      })
      .then(function(myJson) {
        console.log(JSON.stringify(myJson));
      });
      console.log("dsfaasfsa")
    return (
      <Camera 
        onTakePhoto="send_photo"
        onCameraError="camera_error"
      />
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
