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
            const rainbow = [
                [158, 1, 66],    [181, 26, 71],   [202, 50, 74],   [219, 73, 74],
                [232, 94, 73],   [242, 117, 75],  [248, 142, 83],  [251, 167, 96],
                [253, 190, 112], [254, 210, 129], [254, 227, 149], [254, 240, 166],
                [251, 248, 176], [243, 249, 172], [231, 245, 163], [213, 238, 159],
                [190, 229, 160], [164, 218, 163], [137, 207, 165], [110, 192, 168],
                [86, 173, 174],  [70, 150, 179],  [67, 127, 180],  [77, 103, 173]
              ];
            const coloredPartImage = bodyPix.toColoredPartImageData(person, rainbow);
            const opacity = 0.7;
            let overlay = document.getElementById('bodypix-canvas');
            bodyPix.drawMask(
                overlay, video, coloredPartImage, opacity, 0, false);
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
