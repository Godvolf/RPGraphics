import React from 'react';
import clm from 'react-clmtrackr';

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
            let self = this; 
            this.video.addEventListener("play", function() {
                self.width = self.video.videoWidth / 2;
                self.height = self.video.videoHeight / 2;
                self.timerCallback();
              }, false);
          },
        
          computeFrame: function() {
            var canvasInput = document.getElementById('c2');
            var cc = canvasInput.getContext('2d');
            cc.drawImage(this.video, 0, 0, this.width, this.height);
            var ctracker = new clm.tracker();
            ctracker.init();
            function drawLoop() {
              requestAnimationFrame(drawLoop);
              cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
              ctracker.draw(canvasInput);
            }
            drawLoop();
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