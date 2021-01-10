import React, { useEffect, useState } from 'react';
import clm from 'clmtrackr';
import faceDeformer from './face_deformer.js'
import { pModel } from './models/pmodel.js';
import { masks } from './models/masks';

export default function Clmtrackr() {

  var fd = new faceDeformer();

  var currentMask = 3;

  const [video, setVid] = useState('');

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    console.log(width, height);
  
    let vid = document.getElementById('videoel');
    let overlay = document.getElementById('bodypix-canvas');
    let overlayCC = overlay.getContext('2d');
    var webgl_overlay = document.getElementById('webgl');

    var positions;
    var animationRequest;

    setVid(vid);
    console.log(webgl_overlay);
    fd.init(webgl_overlay);


    let ctrack = new clm.tracker({
      faceDetection: {
        useWebWorkers: false,
      },
    });
    ctrack.init();

    ctrack.start(video);

    function drawGridLoop() {
      // get position of face
      positions = ctrack.getCurrentPosition();
      overlayCC.clearRect(0, 0, width, height);
      if (positions) {
        // draw current grid
        ctrack.draw(overlay);
      }
      // check whether mask has converged
      var pn = ctrack.getConvergence();
      // console.log(pn);
      if (pn < 1000) {
        switchMasks();
        requestAnimationFrame(drawMaskLoop);
      } else {
        requestAnimationFrame(drawGridLoop);
      }
    }

    function switchMasks() {
      // get mask
      var maskname = Object.keys(masks)[currentMask];
      console.log(maskname);
      fd.load(document.getElementById(maskname), masks[maskname], pModel);
    }

    function drawMaskLoop() {
      // get position of face
      positions = ctrack.getCurrentPosition();
      overlayCC.clearRect(0, 0, width, height);
      if (positions) {
        // draw mask on top of face
        fd.draw(positions);
      }
      animationRequest = requestAnimationFrame(drawMaskLoop);
    }

    drawGridLoop();

  }, [video, currentMask, fd, masks])

  return (<span></span>);
}