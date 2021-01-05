import React, { useState, useEffect } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';


export default function BodypixOutput() {
  const [video, setVid] = useState('');


    useEffect(() => {

        const canvas = document.getElementById('clm-canvas');

        tf.disableDeprecationWarnings()
        let vid = document.getElementById('videoel');
        setVid(vid);

        async function detect(net) {
            const person = await net.estimatePersonSegmentation(video);

            const maskBackground = false;
            const backgroundDarkeningMask = bodyPix.toMaskImageData(person, maskBackground);

            compositeFrame(backgroundDarkeningMask);

            // console.log(person);

            // let overlay = document.getElementById('clm-canvas');
            // let opacity = 1;

            // bodyPix.drawMask(
            //     overlay, video, maskImage, opacity, 0, false);
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

        async function compositeFrame(backgroundDarkeningMask) {
            if (!backgroundDarkeningMask) return;
            // grab canvas holding the bg image
            var ctx = canvas.getContext('2d');
            // composite the segmentation mask on top
            ctx.globalCompositeOperation = 'destination-over';
            ctx.putImageData(backgroundDarkeningMask, 0, 0);
            // composite the video frame
            ctx.globalCompositeOperation = 'source-in';
            ctx.drawImage(video, 0, 0, 640, 480);
        }
        
    }, [video])
    return(<span></span>);
}
