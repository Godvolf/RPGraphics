import React, { useState, useEffect } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';
import consts from "../../consts";


export default function BodypixOutput(props) {

    useEffect(() => {
        console.log(props.picture);
        let imgSrc;
        if (props.imgUploaded) {
            imgSrc = props.imgUploaded;
        } else {
            imgSrc = './src/components/Bodypix/Background/' + props.picture;
        }
        let vidSrc = './src/components/Bodypix/Background/' + props.video;

        let isCancelled = false;
        let videoBackground = null;
        let backgroundType;
        if (props.imgSelected) {
            backgroundType = "img";
        } else if (props.vidSelected) {
            backgroundType = "vid";
            videoBackground = document.createElement('video');
            videoBackground.src = vidSrc;
            videoBackground.width = consts.width;
            videoBackground.height = consts.height;
            videoBackground.preload="auto";
            videoBackground.loop = true;
            videoBackground.playsInline = true;
            videoBackground.autoplay = true;
        } else {
            backgroundType = "none";
        }
        let filterSettings = {
            type: props.fillterType, // one of filterTypes or null for no filters
            value: 40,        // 1-100- strenght of filter
        }

        const canvas = document.getElementById('clm-canvas');
        let hueOffset = 0;
        let imageBackground = new Image(consts.width, consts.height);
        imageBackground.src = imgSrc;

        let detection;
        tf.disableDeprecationWarnings()
        let vid = document.getElementById('videoel');

        async function detect(net) {
            console.log('lece');
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
            }, consts.bpDelay);
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
                    case "B&W": ctx.filter = `grayscale(100%)`; break;
                    case "Invert": ctx.filter = `invert(100%)`; break;
                    case "Sepia": ctx.filter = `sepia(100%)`; break;
                    case "Blur": ctx.filter = `blur(10px)`; break;
                    case "Color shift 1": ctx.filter = `hue-rotate(150deg)`; break;
                    case "Color shift 2": ctx.filter = `hue-rotate(70deg)`; break;
                    case "Color shift 3": ctx.filter = `hue-rotate(250deg)`; break;
                    default: break;
                }
            }
            ctx.drawImage(vid, 0, 0, consts.width, consts.height);
            //Custom filters:
            //let myImageData = ctx.getImageData(0, 0, 640, 480);
            //customFilter(myImageData.data);
            //ctx.putImageData(myImageData, 0, 0);
            ctx.filter = "none";    
            ctx.globalCompositeOperation = 'destination-atop';
            if(backgroundType === "img") {
                ctx.drawImage(imageBackground, 0, 0, consts.width, consts.height);
            } else if(backgroundType === "vid") {
                ctx.drawImage(videoBackground, 0, 0, consts.width, consts.height);
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
        function resolveAfter2Seconds(x) {
            return new Promise(resolve => {
              setTimeout(() => {
                let ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, consts.width, consts.height);
                let vid = document.getElementById('videoel');
                ctx = vid.getContext('2d');
                ctx.clearRect(0, 0, consts.width, consts.height);
                resolve(x);
              }, 2000);
            });
          }
        return( async () => {
            isCancelled = true;
            
            return await resolveAfter2Seconds(1).then();
        }
        )
    }, [props.fillterType, props.imgSelected, props.picture, props.architectureComplexity, props.vidSelected, props.video])
    return(<span></span>);
}
