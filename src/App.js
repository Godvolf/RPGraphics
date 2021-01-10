import React, { useEffect, useState } from 'react';
import Clmtrackr from './components/Clmtrackr/Clmtrackr'
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import { ReorderTwoTone } from '@material-ui/icons';
import { Button, TextField } from '@material-ui/core';
import BodypixOutput from './components/Bodypix/BodypixOutput';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useForm, Controller } from "react-hook-form";


import './App.css';
import './style.css';


function App() {
  const [video, setVid] = useState('');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [modal, setModal] = useState(false);
  const [mouseClicked, setMouseClicked] = useState(false);

  const [textChecked, setChecked] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [textColor, setTextColor] = useState('black');
  
  const [backgroundChecked, setBackgroundChecked] = useState(false);

  const [faceMaskChecked, setFaceMaskChecked] = useState(false);
  

  /* Handlers */
  const handleTextCheckbox = (event) => {
    setChecked(event.target.checked);
  };

  const handleBackgroundCheckbox = (event) => {
    setBackgroundChecked(event.target.checked);
  };

  const handlefaceMaskCheckbox = (event) => {
    setFaceMaskChecked(event.target.checked);
  };

  const handleCloseModal = () => {
    setModal(false);
  }

  /* Text */
  useEffect(() => {
    if (textValue !== '' ) {
      let txtSettings = {
          text: textValue,
          offsetX: 0,
          offsetY: 200,
          color: textColor,
          font: "32px Consolas",
      }
      if(!txtSettings.text) return;
      const txtCanvas = document.getElementById('text-canvas');
      let ctx = txtCanvas.getContext('2d');
      ctx.textAlign = "center";
      drawStroked(txtSettings)

      function drawStroked(settings) {
          ctx.font = settings.font;
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 8;
          ctx.lineJoin="miter";
          ctx.miterLimit=2;
          ctx.strokeText(settings.text, txtCanvas.width/2 + settings.offsetX, txtCanvas.height/2 - settings.offsetY);
          ctx.fillStyle = settings.color;
          ctx.fillText(settings.text, txtCanvas.width/2 + settings.offsetX, txtCanvas.height/2 - settings.offsetY);
      }
    }
  }, [width, height, video, textValue, textColor]);

  const updateWindowDimensions = (e) => {
    if (e) {
    e.preventDefault();
    }
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  useEffect(() => {
    const onMouseClick = (e) => {
      e.preventDefault();
      if (e.target.id === 'text-canvas') {
        setMouseClicked(!mouseClicked);
      }
    }

  /* Handle mouse click */

  window.addEventListener("click", onMouseClick);

  return function cleanup() {
    window.removeEventListener("click", onMouseClick);
  }}, [mouseClicked])


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

  const { handleSubmit, control } = useForm();
  const onSubmit = data => { 
    console.log(data);
    setTextValue(data.text);
    setTextColor(data.textColor);
    handleCloseModal();
  }
  
  return (
    <div>
      <div className="container">
          <video id="videoel" preload="auto" loop playsInline autoPlay width={width} height={height}></video>
          
          <canvas id="clm-canvas" width={width} height={height}></canvas>
          <canvas id="bodypix-canvas" width={width} height={height}></canvas>
          <canvas id="webgl" width="800px" height="600px"></canvas>
          <canvas id="text-canvas" width={width} height={height}></canvas>

          {mouseClicked &&
            <div id="options-button">
              <Button style={{ backgroundColor: 'white' }} onClick={() => { setModal(true) }}>
                <ReorderTwoTone style={{ color: 'black' }} />
              </Button>
            </div>
          }


          <img id="skull" className="hidden" src="./src/components/Clmtrackr/Masks/skullmask.jpg" alt="skull"></img>
          <img id="halfElf" className="hidden" src="./src/components/Clmtrackr/Masks/half-elf.jpg" alt="halfElf"></img>
          <img id="elf" className="hidden" src="./src/components/Clmtrackr/Masks/elf.jpg" alt="elf"></img>
          <img id="orc" className="hidden" src="./src/components/Clmtrackr/Masks/orc.jpg" alt="orc"></img>

          <Dialog open={modal} onClose={handleCloseModal} style={{ height: '400px'}}>
            <DialogTitle id="dialogTitle">Settings</DialogTitle>
            <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>

              <div id="dialogContainer">
                <div id="textOptions" className="dialogBox">
                  <FormControlLabel
                    control={
                      <Checkbox
                      checked={textChecked}
                      onChange={handleTextCheckbox}
                      color="primary"
                    />
                    }
                    label="Text"
                  />
                  <Controller
                    as={<TextField disabled={!textChecked} variant="filled"/>}
                    name="text"
                    label="Text"
                    control={control}
                    defaultValue=""
                  />
                  <Controller
                    as={<TextField disabled={!textChecked} variant="filled"/>}
                    name="textColor"
                    label="textColor"
                    control={control}
                    defaultValue=""
                  />
                </div>
                <div id="backGroundOptions" className="dialogBox">
                  <FormControlLabel
                    control={
                      <Checkbox
                      checked={backgroundChecked}
                      onChange={handleBackgroundCheckbox}
                      color="primary"
                    />
                    }
                    label="Enable body segmentation"
                  />
                </div>
                <div id="faceMaskOptions" className="dialogBox">
                  <FormControlLabel
                    control={
                      <Checkbox
                      checked={faceMaskChecked}
                      onChange={handlefaceMaskCheckbox}
                      color="primary"
                    />
                    }
                    label="Enable face masking"
                  />
                </div>
              </div>
              </form>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleSubmit(onSubmit)}>
              submit
            </Button>
            </DialogActions>
        </Dialog>
      </div>
      <Clmtrackr/>
      <BodypixOutput width={width} height={height}/>
    </div>
  );
}

export default App;
