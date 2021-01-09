import React, { useEffect, useState } from 'react';
import Clmtrackr from './components/Clmtrackr/Clmtrackr'
import Clmtrackr2 from './components/Clmtrackr/Clmtrackr2'
import BodypixOutput from './components/Bodypix/BodypixOutput';
import './App.css';
import './style.css';


function App() {
  const [video, setVid] = useState('');


  useEffect(() => {
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
  }, [video])
  
  return (
    <div>
      <div className="container">
        <div id="container">
          <video id="videoel" className="hidden" width="640" height="480" preload="auto" loop playsInline autoPlay></video>
          <canvas id="clm-canvas" width="640" height="480"></canvas>
          <canvas id="bodypix-canvas" width="640" height="480"></canvas>
          <canvas id="webgl" width="640" height="480"></canvas>
          <canvas id="text-canvas" width="640" height="480"></canvas>
          <img id="skull" className="masks" src="./src/components/Clmtrackr/Masks/skullmask.jpg" alt="skull"></img>
          <img id="halfElf" className="masks" src="./src/components/Clmtrackr/Masks/half-elf.jpg" alt="halfElf"></img>
          <img id="elf" className="masks" src="./src/components/Clmtrackr/Masks/elf.jpg" alt="elf"></img>
          <img id="orc" className="masks" src="./src/components/Clmtrackr/Masks/orc.jpg" alt="orc"></img>
        </div>
      </div>
      
      <BodypixOutput />
      <Clmtrackr2/>
    </div>
  );
}

export default App;
