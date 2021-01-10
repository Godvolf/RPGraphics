import React, { useState, useEffect } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';


export default function BodypixOutput(props) {
  //////////////Could be props//////////////////


    useEffect(() => {
        let imgSrc = './src/components/Bodypix/Background/' + props.picture;
        let vidSrc = './src/components/Bodypix/Background/' + props.video;

        let isCancelled = false;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let backgroundType;
        if (props.imgSelected) {
            backgroundType = "img";
        } else if (props.vidSelected) {
            backgroundType = "vid";
        } else {
            backgroundType = "none";
        }
        let filterSettings = {
            type: props.fillterType, // one of filterTypes or null for no filters
            value: 40,        // 1-100- strenght of filter
        }

        const canvas = document.getElementById('clm-canvas');
        let hueOffset = 0;
        let imageBackground = new Image(width, height);
        imageBackground.src = imgSrc;

        let detection;
        tf.disableDeprecationWarnings()
        let vid = document.getElementById('videoel');

        async function detect(net) {
            const person = await net.segmentPerson(vid);

            const foregroundColor = {r: 0, g: 0, b: 0, a: 255};
            const backgroundColor = {r: 0, g: 0, b: 0, a: 0};
            const backgroundDarkeningMask = bodyPix.toMask(person, foregroundColor, backgroundColor);

            combined(backgroundDarkeningMask);
        }

        async function runBodySegments() {
            const net = await bodyPix.load(getNeuralNetworkComplexity());
            detection = setInterval(() => {
                if (!isCancelled) {
                    detect(net);
                    hueOffset = (hueOffset + 7) % 360;
                } else {
                    clearInterval(detection);
                }
            }, 300);
        }

        runBodySegments();

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
            ctx.drawImage(vid, 0, 0, width, height);
            //Custom filters:
            //let myImageData = ctx.getImageData(0, 0, 640, 480);
            //customFilter(myImageData.data);
            //ctx.putImageData(myImageData, 0, 0);
            ctx.filter = "none";    
            ctx.globalCompositeOperation = 'destination-atop';
            if(backgroundType === "img") {
                ctx.drawImage(imageBackground, 0, 0, width, height);
            } else if(backgroundType === "vid") {
                let videoBackground = document.createElement('video');
                videoBackground.src = vidSrc;
                videoBackground.width = width;
                videoBackground.height = height;
                videoBackground.preload="auto";
                videoBackground.loop = true;
                videoBackground.playsInline = true;
                videoBackground.autoplay = true;
                ctx.drawImage(videoBackground, 0, 0, width, height);
            }
        }

        function getNeuralNetworkComplexity() {

            switch(props.architectureComplexity) {
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
                default : {
                    return ({
                        architecture: 'MobileNetV1',
                        outputStride: 16,
                        multiplier: 0.5,
                        quantBytes: 1
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
        return( () => {
            isCancelled = true;
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, width, height);
        }
        )
    }, [props.fillterType])
    return(<span></span>);
}
