import React, { useState, useEffect } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';


export default function BodypixOutput(width, height, fillterType) {
  const [video, setVid] = useState('');

  //////////////Could be props//////////////////

  // all available filters in array below
  let filterType = [
      "Rainbow",
      "B&W",
      "Sepia",
      "Invert",
      "Blur",
      "Hue", //"smart recolor"
    ][5]; //switch between filters for fast preview

  let imgSrc = './src/components/Bodypix/Background/room.jpg';


  //////////////////////////////////////////////

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
        let width = window.innerWidth;
        let height = window.innerHeight;
        let qualityFlag = 0;    // 0- fast, 1- accurate
        let filterSettings = {
            type: fillterType, // one of filterTypes or null for no filters
            value: 40,        // 1-100- strenght of filter
        }

        const canvas = document.getElementById('clm-canvas');
        let hueOffset = 0;
        let base_image = new Image(width, height);
        base_image.src = imgSrc;

        let neuralNetworkComplexity =  {
            architecture: qualityFlag ? 'ResNet50' : 'MobileNetV1',
            outputStride: 16,
            multiplier: qualityFlag ? 1 : 0.75,
            quantBytes: qualityFlag ? 1 : 4
        };

        tf.disableDeprecationWarnings()
        let vid = document.getElementById('videoel');
        setVid(vid);

        async function detect(net) {
            const person = await net.segmentPerson(video);

            const foregroundColor = {r: 0, g: 0, b: 0, a: 255};
            const backgroundColor = {r: 0, g: 0, b: 0, a: 0};
            const backgroundDarkeningMask = bodyPix.toMask(person, foregroundColor, backgroundColor);

            combined(backgroundDarkeningMask);
        }

        async function runBodySegments() {
            const net = await bodyPix.load(neuralNetworkComplexity);
            setInterval(() => {
                detect(net);
                hueOffset = (hueOffset + 7) % 360;
            }, 100)
        }
        vid.onloadeddata = function() {
            runBodySegments();
        }

        async function combined(backgroundDarkeningMask) {
            if (!backgroundDarkeningMask) return;
            let ctx = canvas.getContext('2d');
            ctx.putImageData(backgroundDarkeningMask, 0, 0);
            ctx.globalCompositeOperation = 'source-in';
            if(filterSettings.type) {
                switch(filterSettings.type) {
                    case "Rainbow": ctx.filter = `hue-rotate(${hueOffset}deg)`; break;
                    case "B&W": ctx.filter = `grayscale(${filterSettings.value}%)`; break;
                    case "Invert": ctx.filter = `invert(${filterSettings.value}%)`; break;
                    case "Sepia": ctx.filter = `sepia(${filterSettings.value}%)`; break;
                    case "Blur": ctx.filter = `blur(${filterSettings.value}px)`; break;
                    case "Hue": ctx.filter = `hue-rotate(${filterSettings.value*360/100}deg)`; break;
                    default: break;
                }
            }
            ctx.drawImage(video, 0, 0, width, height);
            //Custom filters:
            //let myImageData = ctx.getImageData(0, 0, 640, 480);
            //customFilter(myImageData.data);
            //ctx.putImageData(myImageData, 0, 0);
            ctx.filter = "none";    
            ctx.globalCompositeOperation = 'destination-atop';
            ctx.drawImage(base_image, 0, 0, width, height);
        }

        /*function customFilter(data) {
            for (var i = 0; i < data.length; i+= 4) {
              data[i] = data[i] ^ 255;
              data[i+1] = data[i+1] ^ 255;
              data[i+2] = data[i+2] ^ 255;
            }
        }*/
    }, [imgSrc, fillterType, width, height])
    return(<span></span>);
}
