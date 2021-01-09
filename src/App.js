import React, { useEffect, useState } from 'react';
import Clmtrackr from './components/Clmtrackr/Clmtrackr'
import BodypixOutput from './components/Bodypix/BodypixOutput';
import './App.css';
import './style.css';


function App() {
  const [video, setVid] = useState('');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const updateWindowDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  useEffect(() => {
  
  /* Handle window resizes */

  updateWindowDimensions();
  window.addEventListener('resize', updateWindowDimensions);

  /* Get camera */
  let vid = document.getElementById('videoel');
  setVid(vid);


  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
  // check for camerasupport
  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({video : true}).then(
      ( stream ) => {
        let vid = document.getElementById('videoel');
        vid.srcObject = stream;
        vid.onloadedmetadata = () => {
            vid.play();
        }
      }
    ).catch((reason) => {
        console.log(reason);
    });
  } else if (navigator.getUserMedia) {
      navigator.getUserMedia({video : true});
  } else {
      alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
  }

  return function cleanup() {
    window.removeEventListener('resize', updateWindowDimensions);
  }}, [video])
  
  return (
    <div>
      <div className="container">
          <video id="videoel" preload="auto" className="hidden" loop playsInline autoPlay width={width} height={height}></video>
          
          <canvas id="clm-canvas" width={width} height={height}></canvas>
          <canvas id="bodypix-canvas" width={width} height={height}></canvas>
          <canvas id="webgl" width={width} height={height}></canvas>
          <canvas id="text-canvas" width={width} height={height}></canvas>

          <img id="skull" className="masks" src="./src/components/Clmtrackr/Masks/skullmask.jpg" alt="skull"></img>
          <img id="halfElf" className="masks" src="./src/components/Clmtrackr/Masks/half-elf.jpg" alt="halfElf"></img>
          <img id="elf" className="masks" src="./src/components/Clmtrackr/Masks/elf.jpg" alt="elf"></img>
          <img id="orc" className="masks" src="./src/components/Clmtrackr/Masks/orc.jpg" alt="orc"></img>
      </div>
      {/*
      <Clmtrackr />
      */}
      <BodypixOutput/>
    </div>
  );
}

export default App;
