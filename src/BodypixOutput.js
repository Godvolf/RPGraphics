import React from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';

export default function ClmtrackrOutput() {
    const load = () => {
        let processor = {
          timerCallback: function() {
            if (this.video.paused || this.video.ended) {
              return;
            }
            this.computeFrame();
            let self = this;
            setTimeout(function () {
                self.timerCallback();
              }, 0);
          },
        
          doLoad: function() {
            this.video = document.getElementById("webcam");
            this.c1 = document.getElementById("c1");
            this.ctx1 = this.c1.getContext("2d");
            this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
            let self = this; 
            this.video.addEventListener("play", function() {
                self.width = self.video.videoWidth / 2;
                self.height = self.video.videoHeight / 2;
                self.timerCallback();
              }, false);
          },
        
          computeFrame: function() {

            const img = document.getElementById('c1');

            async function loadAndPredict() {
            const net = await bodyPix.load();
            const segmentation = await net.segmentPerson(img);
            console.log(segmentation);
            }
            loadAndPredict();
            return;
            
          }
        };
      
      document.addEventListener("DOMContentLoaded", () => {
        processor.doLoad();
  
      });
      }
    return (
    <div>
        {load()}
    </div>);
}