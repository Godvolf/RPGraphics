import React, { useState, useEffect } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';


export default function BodypixOutput() {
  const [video, setVid] = useState('');

  // if we are going to support video backgrounds: 
  // https://stackoverflow.com/questions/19251983/dynamically-create-a-html5-video-element-without-it-being-shown-in-the-page/20611625
  /*let videoBackground = document.createElement('video');
  videoBackground.src = './src/components/Bodypix/Background/crash.mp4';
  videoBackground.width="640";
  videoBackground.height="480";
  videoBackground.preload="auto";
  videoBackground.loop = true;
  videoBackground.playsInline = true;
  videoBackground.autoplay = true;*/


    useEffect(() => {

        let qualityFlag = 1;    // 0- fast, 1- accurate
        let filterType = 3;     // 0 or 1 or 2 or 3

        let hueOffset = 0;
        let base_image = new Image(640, 480);
        base_image.src = './src/components/Bodypix/Background/room.jpg';

        let neuralNetworkComplexity =  {
            architecture: qualityFlag ? 'ResNet50' : 'MobileNetV1',
            outputStride: 16,
            multiplier: qualityFlag ? 1 : 0.75,
            quantBytes: qualityFlag ? 1 : 4
        };

        const canvas = document.getElementById('clm-canvas');

        tf.disableDeprecationWarnings()
        let vid = document.getElementById('videoel');
        setVid(vid);

        async function detect(net) {
            const person = await net.segmentPerson(video);

            const foregroundColor = {r: 0, g: 0, b: 0, a: 255};
            const backgroundColor = {r: 0, g: 0, b: 0, a: 0};
            const backgroundDarkeningMask = bodyPix.toMask(person, foregroundColor, backgroundColor);

            switch(filterType) {
                case 0: addBackground(backgroundDarkeningMask);
                        break;
                case 1: modifyBackground(backgroundDarkeningMask);
                        break;
                case 2: modifyPerson(backgroundDarkeningMask);
                        break;
                case 3: combined(backgroundDarkeningMask);
                        break;
            }
        }

        async function runBodySegments() {
            const net = await bodyPix.load(neuralNetworkComplexity);
            setInterval(() => {
                detect(net);
                hueOffset = (hueOffset + 5) % 360;
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

        async function modifyBackground(backgroundDarkeningMask) {
            if (!backgroundDarkeningMask) return;
            var ctx = canvas.getContext('2d');
            ctx.putImageData(backgroundDarkeningMask, 0, 0);
            ctx.globalCompositeOperation = 'source-out';
            ctx.drawImage(video, 0, 0, 640, 480);
            ctx.filter = "blur(5px)";
        }

        async function modifyPerson(backgroundDarkeningMask) {
            if (!backgroundDarkeningMask) return;
            var ctx = canvas.getContext('2d');
            ctx.filter = `hue-rotate(${hueOffset}deg)`;
            ctx.globalCompositeOperation = 'destination-over';
            ctx.putImageData(backgroundDarkeningMask, 0, 0);
            ctx.globalCompositeOperation = 'source-in';
            ctx.drawImage(video, 0, 0, 640, 480);
        }
        async function combined(backgroundDarkeningMask) {
            if (!backgroundDarkeningMask) return;
            let ctx = canvas.getContext('2d');
            ctx.putImageData(backgroundDarkeningMask, 0, 0);
            ctx.globalCompositeOperation = 'source-in';
            ctx.filter = `hue-rotate(${hueOffset}deg)`;
            ctx.drawImage(video, 0, 0, 640, 480);
            //let myImageData = ctx.getImageData(0, 0, 640, 480);
            //invertColors(myImageData.data);
            //ctx.putImageData(myImageData, 0, 0);
            ctx.filter = "none";    
            ctx.globalCompositeOperation = 'destination-atop';
            ctx.drawImage(base_image, 0, 0, 640, 480);
        }
        function invertColors(data) {
            for (var i = 0; i < data.length; i+= 4) {
              data[i] = data[i] ^ 255;
              data[i+1] = data[i+1] ^ 255;
              data[i+2] = data[i+2] ^ 255;
            }
        }
        
    }, [video])
    return(<span></span>);
}
