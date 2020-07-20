var canvas, camera, scene, renderer, controls;
var mouse = new THREE.Vector2(); var raycaster = new THREE.Raycaster();
var planeGroup = new THREE.Group(); var groundlineGroup = new THREE.Group();

var ballGroup1 = new THREE.Group(); var lineGroup1 = new THREE.Group();
var ballGroup2 = new THREE.Group(); var lineGroup2 = new THREE.Group();
var setBallNum1 = -1; var setBallNum2 = -1;
var magneticIndex1 = -1; var magneticIndex2 = -1;

var ballShift0 = new THREE.Vector3(); var ballShift1 = new THREE.Vector3(); var ballShift2 = new THREE.Vector3(); var ballShift3 = new THREE.Vector3();

var angleShowState = null;
var semiCircleGroup1 = new THREE.Group(); var semiCircleGroup2 = new THREE.Group();

var semiCirclePoint1 = new THREE.Vector3(); var semiCirclePoint2 = new THREE.Vector3(); // semiCirlce postion.

var currentSemi1 = new THREE.Vector3(); var currentSemi2 = new THREE.Vector3()// current mouse position before semiCirle moves
var movedSemi = new THREE.Vector3(); // moving mouse position 

var point0 = new THREE.Vector3(); var point1 = new THREE.Vector3(); var point2 = new THREE.Vector3(); var point3 = new THREE.Vector3();

var movedSemiPoint1 = new THREE.Vector3(); var movedSemiPoint2 = new THREE.Vector3();// semiCircle position after moving
var firstSemiCircle1 = true; var firstSemiCircle2 = true;

var sceneStatus = 1;

var styleSetting = {
    "top": 30,
    "imageWidth": 800,
    "imageHeight": 480
}

var dataSetting = {
    "mouseStatus": " ",
    "lineShowStatus1": false,
    "lineShowStatus2": false,
    "angleShowStatus1": false,
    "angleShowStatus2": false,
    "downPosition": null,
    "axisY": -60,
    "axisY1": 12,

    "axisY2": -48,
    "axisY3": -72,
    "reduction": 1,
    "fontSize": 10,
    "svgURL": "../svgs/tiger.svg",
    "angleMove1": false,
    "angleMove2": false,
    "movedAngle1": '',
    "movedAngle2": '',
    "ballMoved1": false,
    "ballMoved2": false,
    "lineMove1": false,
    "lineMove2": false,
    "beforePointX1": null,
    "beforePointX2": null,
    "beforeAngleX1": null,
    "beforeAngleX2": null,
    "angleFlag1": false,
    "angleFlag2": false
}
var colorSetting = {
    "ballColor": 0xfafc00,
    "ballOverColor": 0xfafc00,
    "lineColor": 0xfefefe,
    "lineOverColor": 0xFFFF00,
    "semiCircleColor": 0xFFFF00,
    "semiCircleOverColor": 0xfefefe,
    "centerLineColor1": 0xfefefe
}

var deleteLine = 0;

var offsetX = (window.innerWidth - styleSetting.imageWidth) * 0.5;
var offsetY = (window.innerHeight - styleSetting.imageHeight) * 0.2;

// font label
var loader = new THREE.FontLoader();
var angleLabel1 = new THREE.Group(); var angleLabel2 = new THREE.Group(); // group for angle display
var distanceLabel1 = new THREE.Group(); var distanceLabel2 = new THREE.Group(); // group for distance display

init();
animate();

function init() {
    canvas = document.getElementById('canvas');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 200);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(styleSetting.imageWidth, styleSetting.imageHeight);
    canvas.appendChild(renderer.domElement);
    addLights();
    getControls();
    setCanvasSize();
    // addSVGLoad();
    setAudio();
    horizontalLine();

    planeGroup = getPlane();
    scene.add(planeGroup);

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('click', onMouseClick, false);
}

function deleteLine1() {
    dataSetting.angleShowStatus1 = false;
    dataSetting.lineShowStatus1 = false;
    sceneStatus = 1;
    magneticIndex1 = -1;
    deleteLine = 0;
    distanceLabel1.position.set(0, 0, 0);

    setTimeout(function(){ 
        removeLable(distanceLabel1);
        removeLable(angleLabel1);                    
        $('#angle1').html(" ");
        $("#distance1").html(" ");
        removeBall(ballGroup1, lineGroup1);
        removeSemiCircle(semiCircleGroup1);
    }, 150);
}

function deleteLine2() {
    dataSetting.angleShowStatus2 = false;
    dataSetting.lineShowStatus2 = false;
    sceneStatus = 1;
    magneticIndex2 = -1;
    deleteLine = 0;
    distanceLabel2.position.set(0, 0, 0);

    setTimeout(function(){
        $("#distance2").html(" ");
        $('#angle2').html(" ");
        removeLable(distanceLabel2);
        removeLable(angleLabel2);
        removeBall(ballGroup2, lineGroup2);
        removeSemiCircle(semiCircleGroup2);
    }, 150);
}

function onMouseClick() {

    var interLine1 = getMouseObject(event, mouse, raycaster, camera, lineGroup1.children);
    var interLine2 = getMouseObject(event, mouse, raycaster, camera, lineGroup2.children);
    
    if (dataSetting.lineShowStatus1) {
        if (interLine1) {
            lineGroup1.children[0].material.color.setHex(colorSetting.lineOverColor);
            deleteLine = 1;
        }else{

        }
    }else{
        
    }

    if (dataSetting.lineShowStatus2) {
        if (interLine2) {
            lineGroup2.children[0].material.color.setHex(colorSetting.lineOverColor);
            deleteLine = 2;
        }else{

        }
    }else{

    }
}

function onMouseDown() {
    var interPlane = getMouseObject(event, mouse, raycaster, camera, [planeGroup.children[0]]);
    var interBall1 = getMouseObject(event, mouse, raycaster, camera, ballGroup1.children);
    var interBall2 = getMouseObject(event, mouse, raycaster, camera, ballGroup2.children);
    var interLine1 = getMouseObject(event, mouse, raycaster, camera, lineGroup1.children);
    var interLine2 = getMouseObject(event, mouse, raycaster, camera, lineGroup2.children);
    var interAngle1 = getMouseObject(event, mouse, raycaster, camera, semiCircleGroup1.children);
    var interAngle2 = getMouseObject(event, mouse, raycaster, camera, semiCircleGroup2.children);

    

    if (event.button !== 0) {
        if (interLine1) {
            dataSetting.angleShowStatus1 = false;
            dataSetting.lineShowStatus1 = false;
            sceneStatus = 1;
            magneticIndex1 = -1;
            distanceLabel1.position.set(0, 0, 0);

            jQuery('#distance1').html(" "); jQuery('#angle1').html(" ");
            removeBall(ballGroup1, lineGroup1);
            removeLable(distanceLabel1); removeLable(angleLabel1);
            removeSemiCircle(semiCircleGroup1);
        }
        if (interLine2) {
            dataSetting.angleShowStatus2 = false;
            dataSetting.lineShowStatus2 = false;
            sceneStatus = 2;
            magneticIndex2 = -1;
            distanceLabel2.position.set(0, 0, 0);

            jQuery('#distance2').html(" "); jQuery('#angle2').html(" ");
            removeBall(ballGroup2, lineGroup2);
            removeLable(angleLabel2); removeLable(distanceLabel2);
            removeSemiCircle(semiCircleGroup2);
        }
        return;
    }

    if (interPlane) {
        dataSetting.mouseStatus = "plane";
        dataSetting.downPosition = interPlane.point;
    }

    if (interBall1) {
        // console.log("ball1")
        // ***111
        dataSetting.ballMoved1 = true;

        dataSetting.mouseStatus = "ball1";
        setBallNum1 = interBall1.object.ballNum;
        ballShift0.subVectors(ballGroup1.children[0].position, interPlane.point);
        ballShift1.subVectors(ballGroup1.children[1].position, interPlane.point);
    }

    if (interBall2) {
        // console.log("ball2")
        // ***222
        dataSetting.ballMoved2 = true;

        dataSetting.mouseStatus = "ball2";
        setBallNum2 = interBall2.object.ballNum;
        ballShift2.subVectors(ballGroup2.children[0].position, interPlane.point);
        ballShift3.subVectors(ballGroup2.children[1].position, interPlane.point);
    }

    if (dataSetting.lineShowStatus1) {
        // console.log("lineShowStatus1")
        if (interLine1) {
            // console.log("interLine1")
            dataSetting.mouseStatus = "line1";
            lineGroup1.children[0].material.color.setHex(colorSetting.lineOverColor);

            ballShift0.subVectors(ballGroup1.children[0].position, interPlane.point);
            ballShift1.subVectors(ballGroup1.children[1].position, interPlane.point);
        }
        else if (dataSetting.angleShowStatus1) {
            // console.log("angleShowStatus1")
            if (interAngle1) {
                // console.log("interAngle1")
                // ***111
                dataSetting.angleMove1 = true;

                dataSetting.mouseStatus = "angle1";

                // // this is for angle move flag
                // dataSetting.angleMove1 = true;

                semiCircleGroup1.children[0].material.color.setHex(colorSetting.semiCircleOverColor);
                currentSemi1 = interPlane.point;
                if (!firstSemiCircle1) {
                    // console.log("not firstSemiCircle1")
                    // semiCirclePoint1 = movedSemiPoint1;
                }
            }else{
                
            }
        }
    }
    
    if (dataSetting.lineShowStatus2) {
        // console.log("lineShowStatus2")
        if (interLine2) {
            // console.log("interLine2")
            dataSetting.mouseStatus = "line2";
            lineGroup2.children[0].material.color.setHex(colorSetting.lineOverColor);
            ballShift2.subVectors(ballGroup2.children[0].position, interPlane.point);
            ballShift3.subVectors(ballGroup2.children[1].position, interPlane.point);
        }
        else if (dataSetting.angleShowStatus2) {
            // console.log("angleShowStatus2")
            if (interAngle2) {
                // console.log("interAngle2")
                // ***222
                dataSetting.angleMove2 = true;

                dataSetting.mouseStatus = "angle2";
                semiCircleGroup2.children[0].material.color.setHex(colorSetting.semiCircleOverColor);
                currentSemi2 = interPlane.point;
                if (!firstSemiCircle2) {
                    // console.log("not firstSemiCircle2")
                    semiCirclePoint2 = movedSemiPoint2;
                }
            }
        }
    }
}

function onMouseUp() {
    dataSetting.downPosition = null;
    dataSetting.mouseStatus = "none";
    setBallNum1 = -1; setBallNum2 = -1;

    // first line move
    if(Math.abs(point0.y - dataSetting.axisY) <= dataSetting.axisY1) {
        if(Math.abs(point1.y - dataSetting.axisY) <= dataSetting.axisY1) {
            point1.y = dataSetting.axisY
        }else{
            point1.y -= point0.y - dataSetting.axisY
            if(Math.abs(point1.y - dataSetting.axisY) <= dataSetting.axisY1) {
                point1.y = dataSetting.axisY;
            }
        }
        point0.y = dataSetting.axisY;
    }

    if(Math.abs(point1.y - dataSetting.axisY) <= dataSetting.axisY1) {
        if(Math.abs(point0.y - dataSetting.axisY) <= dataSetting.axisY1) {
            point0.y = dataSetting.axisY;
        }else{
            point0.y -= point1.y - dataSetting.axisY;
            if(Math.abs(point0.y - dataSetting.axisY) <= dataSetting.axisY1) {
                point0.y = dataSetting.axisY;
            }
        }
        point1.y = dataSetting.axisY;
    }
    
    // second line move
    if(Math.abs(point2.y - dataSetting.axisY) <= dataSetting.axisY1) {
        if(Math.abs(point3.y - dataSetting.axisY) <= dataSetting.axisY1) {
            point3.y = dataSetting.axisY
        }else{
            point3.y -= point2.y - dataSetting.axisY;
            if(Math.abs(point3.y - dataSetting.axisY) <= dataSetting.axisY1) {
                point3.y = dataSetting.axisY;
            }
        }
        point2.y = dataSetting.axisY;
    }
    if(Math.abs(point3.y - dataSetting.axisY) <= dataSetting.axisY1) {
        if(Math.abs(point2.y - dataSetting.axisY) <= dataSetting.axisY1) {
            point2.y = dataSetting.axisY
        }else{
            point2.y -= point3.y - dataSetting.axisY;
            if(Math.abs(point2.y - dataSetting.axisY) <= dataSetting.axisY1) {
                point2.y = dataSetting.axisY;
            }
        }
        point3.y = dataSetting.axisY;
    }

    // initial setting
    if (dataSetting.lineShowStatus1) {
        // console.log("lineShowStatus1 Up")

        lineGroup1.children[0].material.color.setHex(colorSetting.lineColor);
        sceneStatus = 2;
        if (dataSetting.angleShowStatus1) {
            // console.log("angleShowStatus1 UP")
            // semiCircleGroup1.children[0].material.color.setHex(colorSetting.semiCircleColor);
        }else{
            // console.log("not angleShowStatus1 Up")
        }
        magneticResetPosition(point0, point1, lineGroup1, distanceLabel1, "#distance1");
    }

    if (magneticIndex1 === -1) {
        // console.log("magneticIndex1 == -1")  
        if(point0.y == dataSetting.axisY) {
            drawSemiCircle1(point1, point0, semiCircleGroup1, angleLabel1, '#angle1');
        }
        if(point1.y == dataSetting.axisY){
            drawSemiCircle1(point0, point1, semiCircleGroup1, angleLabel1, '#angle1');
        }
    }

    if (dataSetting.lineShowStatus2) {
        // console.log("lineShowStatus2 UP")
        lineGroup2.children[0].material.color.setHex(colorSetting.lineColor);
        sceneStatus = -1;
        if (dataSetting.angleShowStatus2) {
            // console.log("angleShowStatus2 UP")
            // semiCircleGroup2.children[0].material.color.setHex(colorSetting.semiCircleColor);
        }
        magneticResetPosition(point2, point3, lineGroup2, distanceLabel2, "#distance2");
        if (magneticIndex2 === -1) {
            // console.log("magneticIndex2 == -1")
            if(point2.y == dataSetting.axisY) {
                drawSemiCircle2(point3, point2, semiCircleGroup2, angleLabel2, '#angle2');
            }
    
            if(point3.y == dataSetting.axisY) {
                drawSemiCircle2(point2, point3, semiCircleGroup2, angleLabel2, '#angle2');
            }
        }
    }
}

function onMouseMove() {
    var interPlane = getMouseObject(event, mouse, raycaster, camera, [planeGroup.children[0]]);
    var interBall1 = getMouseObject(event, mouse, raycaster, camera, ballGroup1.children);
    var interBall2 = getMouseObject(event, mouse, raycaster, camera, ballGroup2.children);

    if (dataSetting.mouseStatus === "plane" && sceneStatus === 1) { // draw first line
        if (interPlane) {
            // console.log("draw first line")
            if (dataSetting.downPosition) {
                createBall(dataSetting.downPosition, { x: interPlane.point.x, y: interPlane.point.y}, ballGroup1, lineGroup1);
                dataSetting.downPosition = null;
            } else {
                setBallPos(1, interPlane.point, ballGroup1, lineGroup1);
                point0 = ballGroup1.children[0].position;
                point1 = ballGroup1.children[1].position;

                addDistanceLabel(point0, point1, distanceLabel1, "#distance1");
                // drawSemiCircle1(point0, point1, semiCircleGroup1, angleLabel1, '#angle1');
                if(point0.y == dataSetting.axisY) {
                    drawSemiCircle1(point1, point0, semiCircleGroup1, angleLabel1, '#angle1');
                }
                if(point1.y == dataSetting.axisY){
                    drawSemiCircle1(point0, point1, semiCircleGroup1, angleLabel1, '#angle1');
                }
                dataSetting.lineShowStatus1 = true;
            }
        }
    }

    if (dataSetting.mouseStatus === "plane" && sceneStatus === 2) { // draw second line
        if (interPlane) {
            // console.log("draw second line")
            if (dataSetting.downPosition) {
                createBall(dataSetting.downPosition, { x: interPlane.point.x, y: interPlane.point.y }, ballGroup2, lineGroup2);
                dataSetting.downPosition = null;
            }
            else {
                setBallPos(1, interPlane.point, ballGroup2, lineGroup2);
                point2 = ballGroup2.children[0].position;
                point3 = ballGroup2.children[1].position;

                addDistanceLabel(point2, point3, distanceLabel2, "#distance2")

                if(point2.y == dataSetting.axisY) {
                    drawSemiCircle2(point3, point2, semiCircleGroup2, angleLabel2, '#angle2');
                }
    
                if(point3.y == dataSetting.axisY) {
                    drawSemiCircle2(point2, point3, semiCircleGroup2, angleLabel2, '#angle2');
                }
                dataSetting.lineShowStatus2 = true;
            }
        }
    }

    if (dataSetting.mouseStatus === "ball1") { //select ball
        if (interPlane) {
            // console.log("select ball 1")



            removeSemiCircle(semiCircleGroup1);   
            removeLable(angleLabel1);
        
            if (setBallNum1 === 1) {
                setBallPos(setBallNum1, { x: interPlane.point.x, y: interPlane.point.y }, ballGroup1, lineGroup1);
            } else {
                setBallPos(setBallNum1, { x: interPlane.point.x, y: interPlane.point.y }, ballGroup1, lineGroup1);
            }
            if(point0.y == dataSetting.axisY) {
                drawSemiCircle1(point1, point0, semiCircleGroup1, angleLabel1, '#angle1');
            }
            if(point1.y == dataSetting.axisY){
                drawSemiCircle1(point0, point1, semiCircleGroup1, angleLabel1, '#angle1');
            }
            addDistanceLabel(point0, point1, distanceLabel1, "#distance1");
        }
    } else { // select Ball
        // console.log("select ball 1 false")
        if (interBall1) {
            setBallOver(interBall1.object.ballNum, ballGroup1); 
        }else {
            setBallOver(-1, ballGroup1);
        }
    }

    if (dataSetting.mouseStatus === "line1") {
        if (interPlane) {
            // console.log("Line1")

            // console.log("runtime:", dataSetting.beforePoint1)
            // ***111
            dataSetting.lineMove1 = true;
            dataSetting.angleFlag1 = false;

            if (setBallNum1 === 1 || setBallNum1 === 0) {  

                removeSemiCircle(semiCircleGroup1);   
                removeLable(angleLabel1);

                setBallPos(setBallNum1, { x: interPlane.point.x, y: interPlane.point.y }, ballGroup1, lineGroup1);
                if(point0.y == dataSetting.axisY) {
                    drawSemiCircle1(point1, point0, semiCircleGroup1, angleLabel1, '#angle1');
                }
                if(point1.y == dataSetting.axisY){
                    drawSemiCircle1(point0, point1, semiCircleGroup1, angleLabel1, '#angle1');
                }
            }else{
                moveVector(point0, point1, interPlane, ballShift0, ballShift1, lineGroup1)
                addDistanceLabel(point0, point1, distanceLabel1, "#distance1");
                if(point1.y !== dataSetting.axisY || point0.y !== dataSetting.axisY) {
                    removeSemiCircle(semiCircleGroup1);   
                    removeLable(angleLabel1);
                }
            }
            
        }
    }

    if (dataSetting.mouseStatus === "angle1") { // moving semiCircle
        // console.log("moving semicircle")
        movedSemi = interPlane.point;
        
        var dx1 = movedSemi.x - currentSemi1.x;
        var dy1 = movedSemi.y - currentSemi1.y;

        firstSemiCircle1 = false;
        if(point1.y == dataSetting.axisY) {
            setMoveSemiCircle1(point1, point0, semiCirclePoint1, dx1, dy1, semiCircleGroup1, angleLabel1);
        }

        if(point0.y == dataSetting.axisY) {
            setMoveSemiCircle1(point0, point1, semiCirclePoint1, dx1, dy1, semiCircleGroup1, angleLabel1);
        }

        
    }

    if (dataSetting.mouseStatus === "ball2") { //select ball
        if (interPlane) {
            // console.log("select ball2")
            removeSemiCircle(semiCircleGroup2);   
            removeLable(angleLabel2);

            if (setBallNum2 === 1) {
                setBallPos(setBallNum2, { x: interPlane.point.x, y: interPlane.point.y }, ballGroup2, lineGroup2);
            } else {
                setBallPos(setBallNum2, { x: interPlane.point.x, y: interPlane.point.y }, ballGroup2, lineGroup2);
            }
            // drawSemiCircle2(point2, point3, semiCircleGroup2, angleLabel2, '#angle2');
            if(point2.y == dataSetting.axisY) {
                drawSemiCircle2(point3, point2, semiCircleGroup2, angleLabel2, '#angle2');
            }

            if(point3.y == dataSetting.axisY) {
                drawSemiCircle2(point2, point3, semiCircleGroup2, angleLabel2, '#angle2');
            }
            addDistanceLabel(point2, point3, distanceLabel2, "#distance2")
        }
    } else { // select Ball
        // console.log("select ball 2 false")
        if (interBall2) setBallOver(interBall2.object.ballNum, ballGroup2); else setBallOver(-1, ballGroup2);
    }

    if (dataSetting.mouseStatus === "line2") {
        if (interPlane) {

            // ***222
            dataSetting.lineMove2 = true;
            dataSetting.angleFlag2 = false;

            // console.log("line2")
            if (setBallNum2 === 1 || setBallNum2 === 0) {
                removeSemiCircle(semiCircleGroup2);   
                removeLable(angleLabel2);
                setBallPos(setBallNum2, { x: interPlane.point.x, y: interPlane.point.y }, ballGroup2, lineGroup2);
                if(point2.y == dataSetting.axisY) {
                    drawSemiCircle2(point3, point2, semiCircleGroup2, angleLabel2, '#angle2');
                }
    
                if(point3.y == dataSetting.axisY) {
                    drawSemiCircle2(point2, point3, semiCircleGroup2, angleLabel2, '#angle2');
                }
            }else{
                moveVector(point2, point3, interPlane, ballShift2, ballShift3, lineGroup2)
                addDistanceLabel(point2, point3, distanceLabel2, "#distance2")
                // drawSemiCircle2(point2, point3, semiCircleGroup2, angleLabel2, '#angle2');
                if(point2.y !== dataSetting.axisY || point3.y !== dataSetting.axisY) {
                    removeSemiCircle(semiCircleGroup2);   
                    removeLable(angleLabel2);
                }
            }
        }
    }
    
    if (dataSetting.mouseStatus === "angle2") { // moving semiCircle
        // console.log("moving semicircle2")
        movedSemi = interPlane.point;

        var dx2 = movedSemi.x - currentSemi2.x;
        var dy2 = movedSemi.y - currentSemi2.y;

        firstSemiCircle2 = false;
        if(point3.y == dataSetting.axisY) {
            setMoveSemiCircle2(point3, point2, semiCirclePoint2, dx2, dy2, semiCircleGroup2, angleLabel2);
        }

        if(point2.y == dataSetting.axisY) {
            setMoveSemiCircle2(point2, point3, semiCirclePoint2, dx2, dy2, semiCircleGroup2, angleLabel2);
        }

    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
    controls.update();
}
