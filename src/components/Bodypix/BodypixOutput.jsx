import React, { useState, useEffect } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';


export default function BodypixOutput() {
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

  let filterSettings = {
      type: filterType, // one of filterTypes or null for no filters
      value: 40,        // 1-100- strenght of filter
  }
  let qualityFlag = 1;    // 0- fast, 1- accurate
  let imgSrc = './src/components/Bodypix/Background/room.jpg';
  let vidSrc = './src/components/Bodypix/Background/flower.webm';
  let txtSettings = {
      text: "Host Zbigniew",
      offsetX: 0,
      offsetY: 200,
      color: "white",
      font: "32px Consolas",
  }

  //////////////////////////////////////////////

  // if we are going to support video backgrounds: 
  // https://stackoverflow.com/questions/19251983/dynamically-create-a-html5-video-element-without-it-being-shown-in-the-page/20611625
  
    useEffect(() => {
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
    }, [txtSettings]);

    useEffect(() => {
        const canvas = document.getElementById('clm-canvas');
        let hueOffset = 0;
        let base_image = new Image(640, 480);
        base_image.src = imgSrc;

        let videoBackground = document.createElement('video');
        videoBackground.src = vidSrc;
        videoBackground.width="640";
        videoBackground.height="480";
        videoBackground.preload="auto";
        videoBackground.loop = true;
        videoBackground.playsInline = true;
        videoBackground.autoplay = true;

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
                    default: console.log("no such filter"); break;
                }
            }
            ctx.drawImage(video, 0, 0, 640, 480);
            //Custom filters:
            //let myImageData = ctx.getImageData(0, 0, 640, 480);
            //customFilter(myImageData.data);
            //ctx.putImageData(myImageData, 0, 0);
            ctx.filter = "none";    
            ctx.globalCompositeOperation = 'destination-atop';
            ctx.drawImage(videoBackground, 0, 0, 640, 480);
        }

        /*function customFilter(data) {
            for (var i = 0; i < data.length; i+= 4) {
              data[i] = data[i] ^ 255;
              data[i+1] = data[i+1] ^ 255;
              data[i+2] = data[i+2] ^ 255;
            }
        }*/
    }, [video, imgSrc, filterSettings])
    return(<span></span>);
}
