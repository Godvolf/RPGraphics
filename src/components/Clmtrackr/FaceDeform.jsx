import React, { useEffect, useState } from 'react';
import clm from 'clmtrackr';
import faceDeformer from './face_deformer.js'
import { pModel } from './models/pmodel.js';
import { presets } from './models/presets';
import { mouth_vertices } from './models/mouth_vertices';
import { extendVertices } from './models/extendVerices';

export default function Clmtrackr2(props) {

  const [video, setVid] = useState('');

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;

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
        if (pn < 500 && props.deform !== 10) {
            switchMasks();
            gridloop = requestAnimationFrame(drawMaskLoop);
        } else {
            gridloop = requestAnimationFrame(drawGridLoop);
        }
    }
    function switchMasks() {
        // get mask
        var maskname = Object.keys(presets)[props.deform];
        console.log(maskname);
        fd.load(document.getElementById(maskname), presets[maskname], pModel);
      }

    function drawMaskLoop() {
       overlay.getContext('2d').drawImage(vid,0,0,width,height);

        var pos = ctrack.getCurrentPosition();

        if (pos) {
            // create additional points around face
            var tempPos;
            var addPos = [];
            for (var i = 0;i < 23;i++) {
                tempPos = [];
                tempPos[0] = (pos[i][0] - pos[62][0])*1.3 + pos[62][0];
                tempPos[1] = (pos[i][1] - pos[62][1])*1.3 + pos[62][1];
                addPos.push(tempPos);
            }
            // merge with pos
            var newPos = pos.concat(addPos);

            var newVertices = pModel.path.vertices.concat(mouth_vertices);
            // merge with newVertices
            newVertices = newVertices.concat(extendVertices);

            fd.load(overlay, newPos, pModel, newVertices);

            var parameters = ctrack.getCurrentParameters();
            for (var i = 6;i < parameters.length;i++) {
                parameters[i] += ph['component '+(i-3)];
            }
            positions = ctrack.calculatePositions(parameters);
            
            
            overlayCC.clearRect(0, 0, width, height);
            if (positions) {
                // add positions from extended boundary, unmodified
                newPos = positions.concat(addPos);
                // draw mask on top of face
                fd.draw(newPos);
            }
        }
        animationRequest = requestAnimationFrame(drawMaskLoop);
    }
    
    var pnums = pModel.shapeModel.eigenValues.length -2;
    var parameterHolder = function() {
        for (var i = 0;i < pnums;i++) {
            this['component '+(i+3)] = 0;
        }
        this.presets = 0;
    };
    var ph = new parameterHolder();
    

    for (var i = 0;i < pnums;i++) {
        ph['component '+(i+3)] = presets['unwell'][i];
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

  }, [props.deform])

  return (<span></span>);
}