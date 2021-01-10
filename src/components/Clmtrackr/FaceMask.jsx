import React, { useEffect, useState } from 'react';
import clm from 'clmtrackr';
import faceDeformer from './face_deformer.js'
import { pModel } from './models/pmodel.js';
import { masks } from './models/masks';

export default function FaceMask(props) {


  const [video, setVid] = useState('');

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    let currentMask = props.mask;
    var fd = new faceDeformer();

    let vid = document.getElementById('videoel');
    let overlay = document.getElementById('bodypix-canvas');
    let overlayCC = overlay.getContext('2d');
    var webgl_overlay = document.getElementById('webgl');

    var positions;
    var animationRequest;

    setVid(vid);
    fd.init(webgl_overlay);


    let ctrack = new clm.tracker({
      faceDetection: {
        useWebWorkers: false,
      },
    });
    ctrack.init(pModel);

    ctrack.start(video);
    let gridloop;

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
      console.log(props.mask);
      if (pn < 500 && props.mask !== 4) {
        switchMasks();
        gridloop = requestAnimationFrame(drawMaskLoop);
      } else {
        gridloop = requestAnimationFrame(drawGridLoop);
      }
    }

    function switchMasks() {
      // get mask
      var maskname = Object.keys(masks)[currentMask];
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
    return (
      () => {
        cancelAnimationFrame(animationRequest);
        cancelAnimationFrame(gridloop);
        fd.clear();
        overlayCC.clearRect(0, 0, width, height);
      }
    )

  }, [props.mask])

  return (<span></span>);
}