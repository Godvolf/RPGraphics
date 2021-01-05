import React, { useState, useEffect } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';


export default function BodypixOutput() {
  const [video, setVid] = useState('');
  
  let base_image = new Image();
  base_image.src = './src/components/Bodypix/Background/win.jpg';


    useEffect(() => {

        const canvas = document.getElementById('clm-canvas');

        tf.disableDeprecationWarnings()
        let vid = document.getElementById('videoel');
        setVid(vid);

        async function detect(net) {
            const person = await net.estimatePersonSegmentation(video);

            const maskBackground = false;
            const backgroundDarkeningMask = bodyPix.toMaskImageData(person, maskBackground);

            addBackground(backgroundDarkeningMask);
        }

        async function runBodySegments() {
            const net = await bodyPix.load();
            setInterval(() => {
                detect(net);
            }, 100)
        }
        vid.onloadeddata = function() {
            runBodySegments();
        }

        async function addBackground(backgroundDarkeningMask) {
            if (!backgroundDarkeningMask) return;
            var ctx = canvas.getContext('2d');
            ctx.putImageData(backgroundDarkeningMask, 0, 0);
            ctx.globalCompositeOperation = 'source-out';
            ctx.drawImage(base_image, 0, 0, 640, 480);
        }
        
    }, [video])
    return(<span></span>);
}
