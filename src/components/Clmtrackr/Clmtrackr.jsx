import React, { useEffect, useState } from 'react';
import clm from 'clmtrackr';

export default function Clmtrackr() {
    const [video, setVid] = useState('');

    useEffect(() => {
        let vid = document.getElementById('videoel');
        let overlay = document.getElementById('bodypix-canvas');
        let overlayCC = overlay.getContext('2d');

        setVid(vid);

        let ctrack = new clm.tracker({
            faceDetection: {
              useWebWorkers: false,
            },
          });
        ctrack.init();
        
        ctrack.start(video);
        function drawLoop() {
            requestAnimationFrame(drawLoop);
            overlayCC.clearRect(0, 0, 400, 300);
            ctrack.draw(overlay);
            }
            drawLoop();
    }, [video])

    return(<span></span>);
}