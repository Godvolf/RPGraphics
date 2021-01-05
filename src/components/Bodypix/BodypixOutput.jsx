import React, { useState, useEffect } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';


export default function BodypixOutput() {
  const [video, setVid] = useState('');
  
  let base_image = new Image();
  base_image.src = './src/components/Bodypix/Background/forest.jpg';

  // if we are going to support video backgrounds: 
  // https://stackoverflow.com/questions/19251983/dynamically-create-a-html5-video-element-without-it-being-shown-in-the-page/20611625
  let videoBackground = document.createElement('video');
  videoBackground.src = './src/components/Bodypix/Background/crash.mp4';
  videoBackground.width="640";
  videoBackground.height="480";
  videoBackground.preload="auto";
  videoBackground.loop = true;
  videoBackground.playsInline = true;
  videoBackground.autoplay = true;


    useEffect(() => {

        const canvas = document.getElementById('clm-canvas');

        tf.disableDeprecationWarnings()
        let vid = document.getElementById('videoel');
        setVid(vid);

        async function detect(net) {
            const person = await net.segmentPerson(video);

            const foregroundColor = {r: 0, g: 0, b: 0, a: 255};
            const backgroundColor = {r: 0, g: 0, b: 0, a: 0};
            const backgroundDarkeningMask = bodyPix.toMask(person, foregroundColor, backgroundColor);

            addBackground(backgroundDarkeningMask);
        }

        async function runBodySegments() {
            const net = await bodyPix.load({
                architecture: 'ResNet50',
                outputStride: 16,
                quantBytes: 1
              });
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
