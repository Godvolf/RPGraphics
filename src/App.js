import React from 'react';
import Webcam from "react-webcam";
import ClmtrackrOutput from './ClmtrackrOutput'
import BodypixOutput from './BodypixOutput'
import './App.css';

function App() {

  
  return (
    <div>
      <Webcam id="webcam"/>
      <div>
        <canvas id="c1" width="300" height="300"></canvas>
        <canvas id="c2" width="300" height="300"></canvas>
      </div>
      <ClmtrackrOutput />
      <BodypixOutput />
    </div>
  );
}

export default App;
