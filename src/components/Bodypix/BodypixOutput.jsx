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

  let architectureComplexity = [
      "MobileNet basic",
      "MobileNet standard",
      "MobileNet full",
      "ResNet basic",
      "ResNet standard",
      "ResNet full",
    ][2]; //switch between settings for fast preview

  let imgSrc = './src/components/Bodypix/Background/room.jpg';
  let vidSrc = './src/components/Bodypix/Background/flower.webm';

    useEffect(() => {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let backgroundType = "img"; // vid, img
        let filterSettings = {
            type: fillterType, // one of filterTypes or null for no filters
            value: 40,        // 1-100- strenght of filter
        }

        const canvas = document.getElementById('clm-canvas');
        let hueOffset = 0;
        let imageBackground = new Image(width, height);
        imageBackground.src = imgSrc;

        let videoBackground = document.createElement('video');
        videoBackground.src = vidSrc;
        videoBackground.width = width;
        videoBackground.height = height;
        videoBackground.preload="auto";
        videoBackground.loop = true;
        videoBackground.playsInline = true;
        videoBackground.autoplay = true;

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
            const net = await bodyPix.load(getNeuralNetworkComplexity());
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
            if(backgroundType === "img") {
                ctx.drawImage(imageBackground, 0, 0, width, height);
            } else {
                ctx.drawImage(videoBackground, 0, 0, width, height);
            }
        }

        function getNeuralNetworkComplexity() {

            switch(architectureComplexity) {
                case "MobileNet basic": {
                    return ({
                        architecture: 'MobileNetV1',
                        outputStride: 16,
                        multiplier: 0.5,
                        quantBytes: 1
                    });
                }
                case "MobileNet standard": {
                    return ({
                        architecture: 'MobileNetV1',
                        outputStride: 8,
                        multiplier: 0.75,
                        quantBytes: 2
                    });
                }
                case "MobileNet full": {
                    return ({
                        architecture: 'MobileNetV1',
                        outputStride: 8,
                        multiplier: 1.0,
                        quantBytes: 4
                    });
                }
                case "ResNet basic": {
                    return ({
                        architecture: 'ResNet50',
                        outputStride: 32,
                        quantBytes: 1
                    });
                }
                case "ResNet standard": {
                    return ({
                        architecture: 'ResNet50',
                        outputStride: 16,
                        quantBytes: 2
                    });
                }
                case "ResNet full": {
                    return ({
                        architecture: 'ResNet50',
                        outputStride: 16,
                        quantBytes: 4
                    });
                }
            }
        }

        /*function customFilter(data) {
            for (var i = 0; i < data.length; i+= 4) {
              data[i] = data[i] ^ 255;
              data[i+1] = data[i+1] ^ 255;
              data[i+2] = data[i+2] ^ 255;
            }
        }*/
    }, [imgSrc, vidSrc, architectureComplexity, fillterType, width, height])
    return(<span></span>);
}
