import React, { useState, useEffect } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';


export default function BodypixOutput() {
  const [video, setVid] = useState('');


    useEffect(() => {
        tf.disableDeprecationWarnings()
        let vid = document.getElementById('videoel');
        setVid(vid);

        async function detect(net) {
            const person = await net.estimatePersonSegmentation(video);

            const maskBackground = true;
            const maskImage = bodyPix.toMaskImageData(person, maskBackground);

            let overlay = document.getElementById('clm-canvas');
            let opacity = 1;

            bodyPix.drawMask(
                overlay, video, maskImage, opacity, 0, false);
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
        
    }, [video])
    return(<span></span>);
}
