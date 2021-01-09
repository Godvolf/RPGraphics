import React, { useEffect, useState } from 'react';
import clm from 'clmtrackr';
import faceDeformer from './face_deformer.js'
import { pModel } from './pmodel.js';

export default function Clmtrackr() {

  var fd = new faceDeformer();

  var currentMask = 3;

  var masks = {
    "skull": [[94.36614797199479, 301.0803014941178], [103.3112341317163, 370.94425891220794], [120.32682383634102, 423.44019820073913], [136.47515990999432, 479.5313526801685], [144.0368892689739, 530.2345465095229], [172.36671158523987, 580.3629853084399], [217.01976787749376, 619.1929480747351], [269.34754914721543, 625.5185645282593], [326.48254316405735, 621.3861472887296], [367.5697682338512, 588.2815093455445], [396.3225813396373, 544.5241298700507], [423.17220298223486, 485.34023789625417], [433.9843247454375, 424.6310467376783], [459.5753658677024, 376.88741971189734], [465.6871064619868, 309.4410229689395], [439.2202424949693, 261.17900856324786], [404.95656878888406, 237.16839138607617], [349.4475953084992, 224.72336816106127], [307.5262703136751, 246.56374069983377], [111.59908955786085, 255.73818792771897], [140.77843006651088, 236.25905776423554], [198.25614310392174, 221.75964368670276], [238.0607640650076, 244.705502740957], [147.51722669161887, 322.2920755920064], [179.96374258674177, 303.20283557208495], [219.89652431504095, 321.63741406437117], [181.93382178127874, 336.62855114616417], [181.67029281471235, 321.84674383355735], [409.08887297158253, 319.49332724817634], [372.08555159755235, 302.6637205310945], [332.21673690859785, 314.25212117506817], [371.9034386455536, 336.7928247239386], [370.73203771018734, 318.2549362647991], [275, 262], [241.49292248091808, 382.6509156918952], [228.65540058230079, 403.67602315679153], [246.4207645046435, 428.633436281585], [281.6262637981823, 429.7101230850766], [320.3090052424696, 429.4111504923561], [337.71957018298144, 408.9834145077307], [324.9443408840292, 383.11655691739367], [277, 336], [262.6247652804272, 418.02062856158705], [305.62131595904475, 419.9849042391749], [192.0888434079335, 501.27870633434], [227.89330220055228, 491.767986224554], [254.82152484033276, 488.28172522414377], [274.58325738122585, 496.93117201682657], [298.6427918040954, 490.9689564164321], [325.48328507490595, 499.3328015524256], [350.42668910649365, 508.3776245292422], [327.3034449428819, 532.1604992353581], [302.413708672554, 539.1078344701017], [266.7645104587291, 540.3023216343349], [237.0072802317868, 530.3260142620247], [215.71258213035736, 519.4068856743318], [222.47713501183063, 502.96356939871526], [278.19882029298384, 511.73001012850216], [321.89078331130554, 511.2982898921548], [318.4792941712966, 518.8634093151715], [277.74782145336667, 522.9574136207773], [230.31017878122015, 512.4917843225409], [281.2762389085891, 407.8752450214805], [163.2415047021451, 306.7465365446632], [202.42996875366381, 307.91977418268493], [204.91393138279884, 330.1328065429834], [161.72396129164846, 332.9605656535211], [394.08708850976745, 308.0776176192674], [354.1514690637372, 305.45718896085043], [349.5616880820385, 328.5223891568975], [391.4980892099413, 331.1427807886423]],
    "halfElf": [
      [67, 202],
      [72, 241],
      [78, 227],
      [85, 314],
      [100, 342],
      [122, 367],
      [147, 381],
      [176, 387],
      [206, 381],
      [228, 358],
      [245, 336],
      [265, 310],
      [273, 270],
      [275, 234],
      [276, 169],
      [256, 175],
      [234, 177],
      [216, 181],
      [194, 190],
      [84, 176],
      [105, 177],
      [128, 182],
      [152, 194],
      [88, 201],
      [113, 187],
      [140, 203],
      [113, 213],
      [113, 199],
      [254, 201],
      [230, 188],
      [207, 204],
      [232, 212],
      [230, 199],
      [170, 189],
      [151, 251],
      [143, 265],
      [151, 276],
      [173, 280],
      [197, 277],
      [203, 263],
      [192, 251],
      [171, 223],
      [157, 266],
      [192, 267],
      [131, 311],
      [144, 306],
      [161, 303],
      [173, 308],
      [183, 304],
      [200, 306],
      [215, 312],
      [201, 323],
      [188, 329],
      [174, 330],
      [159, 329],
      [146, 322],
      [157, 315],
      [173, 317],
      [191, 313],
      [191, 313],
      [173, 317],
      [157, 315],
      [173, 259],
      [97, 190],
      [131, 194],
      [126, 211],
      [96, 210],
      [247, 190],
      [217, 195],
      [217, 211],
      [247, 211]
    ],
    "elf": [
      [336, 712],
      [357, 844],
      [372, 940],
      [412, 1037],
      [460, 1135],
      [522, 1227],
      [604, 1299],
      [670, 1311],
      [736, 1300],
      [837, 1236],
      [892, 1144],
      [943, 1042],
      [984, 934],
      [1009, 822],
      [1002, 684],
      [922, 603],
      [844, 615],
      [768, 637],
      [697, 670],
      [387, 625],
      [457, 631],
      [538, 655],
      [570, 678],
      [390, 709],
      [480, 673],
      [558, 718],
      [477, 751],
      [481, 703],
      [940, 696],
      [826, 673],
      [745, 708],
      [838, 753],
      [828, 705],
      [618, 724],
      [580, 886],
      [546, 946],
      [561, 969],
      [621, 1002],
      [723, 973],
      [744, 931],
      [676, 884],
      [622, 837],
      [576, 958],
      [699, 963],
      [535, 1097],
      [569, 1080],
      [605, 1073],
      [643, 1082],
      [686, 1070],
      [739, 1081],
      [787, 1102],
      [736, 1126],
      [691, 1144],
      [650, 1145],
      [614, 1145],
      [574, 1122],
      [610, 1099],
      [647, 1111],
      [689, 1099],
      [689, 1099],
      [647, 1111],
      [610, 1099],
      [614, 960],
      [426, 682],
      [522, 688],
      [528, 746],
      [428, 746],
      [893, 628],
      [780, 683],
      [780, 743],
      [896, 740]
    ],  
    "orc": [
      [215.5, 259.5],
      [200.5, 317.0],
      [199, 378],
      [210.5, 434.5],
      [249, 485],
      [288, 522],
      [326.5, 552.5],
      [374, 572],
      [416, 552],
      [477.5, 512],
      [525.5, 466.5],
      [552.0, 411.5],
      [552.5, 346.5],
      [550.5, 294.5],
      [546.5, 248.5],
      [512, 225.5],
      [484, 206.5],
      [447, 206],
      [417.5, 222.5],
      [246, 222],
      [278.5, 203.5],
      [317, 203.5],
      [347.5, 222],
      [270, 257.5],
      [298.5, 244],
      [332.5, 258],
      [298, 269],
      [298, 255.3],
      [494, 260],
      [261.5, 245.5],
      [261.5, 245.5],
      [430, 261],
      [462, 271.5],
      [380, 243],
      [341.5, 325.5],
      [326, 348.7],
      [342, 368.5],
      [382, 370],
      [423, 369],
      [437, 350.5],
      [421, 320.5],
      [380.5, 293.5],
      [356.5, 360],
      [408.5, 357],
      [312.9, 431.1],
      [305.3, 402],
      [350.4, 403.8],
      [376.7, 406.4],
      [408.2, 400.4],
      [457, 401.5],
      [461.2, 433.5],
      [463.5, 479.5],
      [431.8, 483.3],
      [379, 472.8],
      [339, 478.5],
      [310.8, 463.8],
      [331, 456.2],
      [378.8, 450],
      [446, 458.5],
      [443, 409.8],
      [377.5, 415.2],
      [318.8, 415.2],
      [382, 345.3],
      [283.2, 248],
      [320.2, 248.2],
      [320.5, 265],
      [283.5, 263.2],
      [479.5, 250.2],
      [443.2, 249.5],
      [445, 265.5],
      [479.5, 266.8]
    ],
  };

  const [video, setVid] = useState('');

  useEffect(() => {
    let vid = document.getElementById('videoel');
    let overlay = document.getElementById('bodypix-canvas');
    let overlayCC = overlay.getContext('2d');
    var webgl_overlay = document.getElementById('webgl');

    var positions;
    var animationRequest;

    setVid(vid);
    fd.init(webgl_overlay);


    let ctrack = new clm.tracker({
      faceDetection: {
        useWebWorkers: false,
      },
    });
    ctrack.init();

    ctrack.start(video);

    function drawGridLoop() {
      // get position of face
      positions = ctrack.getCurrentPosition();
      overlayCC.clearRect(0, 0, 640, 480);
      if (positions) {
        // draw current grid
        ctrack.draw(overlay);
      }
      // check whether mask has converged
      var pn = ctrack.getConvergence();
      // console.log(pn);
      if (pn < 1000) {
        switchMasks();
        requestAnimationFrame(drawMaskLoop);
      } else {
        requestAnimationFrame(drawGridLoop);
      }
    }

    function switchMasks() {
      // get mask
      var maskname = Object.keys(masks)[currentMask];
      console.log(maskname);
      fd.load(document.getElementById(maskname), masks[maskname], pModel);
    }

    function drawMaskLoop() {
      // get position of face
      positions = ctrack.getCurrentPosition();
      overlayCC.clearRect(0, 0, 640, 480);
      if (positions) {
        // draw mask on top of face
        fd.draw(positions);
      }
      animationRequest = requestAnimationFrame(drawMaskLoop);
    }

    drawGridLoop();

  }, [video, currentMask, fd, masks])

  return (<span></span>);
}