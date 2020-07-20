function setCanvasSize() {
    canvas.style.top = offsetY + "px";
    canvas.style.left = offsetX + "px";
}

function addLights() {
    scene.add(new THREE.AmbientLight(0xf0f0f0));
    var light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 15, 2);
    scene.add(light);
}

function getControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.screenSpacePanning = true;
    controls.enableRotate = false;
    scene.add(controls)
}

function getPlane() {
    var planeGroup = new THREE.Group();
    var planeMap = new THREE.TextureLoader().load("./images/background.jpg");
    var planeGeo = new THREE.BoxGeometry(styleSetting.imageWidth / 1.5, 0.1, styleSetting.imageHeight / 1.5);
    var planeMat = new THREE.MeshPhongMaterial({ color: 0xffeeff, map: planeMap }); //, transparent:true, opacity:0.05
    var planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeGroup.add(planeMesh)

    var backgroundGeometry = new THREE.PlaneBufferGeometry(400000, 400000);
    var backgroundMaterial = new THREE.MeshBasicMaterial({ color: 0x282828 });
    var backgroundPlane = new THREE.Mesh(backgroundGeometry, backgroundMaterial)
    backgroundPlane.position.y = -0.1;
    backgroundPlane.rotateX(-Math.PI * 0.5)
    planeGroup.add(backgroundPlane);

    var helper = new THREE.GridHelper(40000, 840);
    helper.material.opacity = 0.15;
    helper.material.transparent = true;
    helper.material.position
    planeGroup.add(helper);

    planeGroup.rotateX(Math.PI * 0.5)
    return planeGroup;
}

function addSVGLoad() {
    var loader = new THREE.SVGLoader();
    loader.load(dataSetting.svgURL, function (data) {
        var paths = data.paths;
        var group = new THREE.Group();
        group.scale.multiplyScalar(0.02);
        group.position.set(-10, 8, 0.1)
        group.scale.y *= - 1;

        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var fillColor = path.userData.style.fill;
            var material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setStyle(fillColor),
                opacity: path.userData.style.fillOpacity,
                transparent: path.userData.style.fillOpacity < 1,
                side: THREE.DoubleSide,
                depthWrite: false,
            });
            var shapes = path.toShapes(true);

            for (var j = 0; j < shapes.length; j++) {
                var shape = shapes[j];
                var geometry = new THREE.ShapeBufferGeometry(shape);
                var mesh = new THREE.Mesh(geometry, material);
                group.add(mesh);
            }
        }
        scene.add(group);
    });
}

function getMouseObject(event, mouse, raycaster, camera, arr) {
    
    mouse.x = ((event.clientX - offsetX) / styleSetting.imageWidth) * 2 - 1;
    mouse.y = -((event.clientY - offsetY) / styleSetting.imageHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersect = raycaster.intersectObjects(arr);

    return intersect[0];
}

function moveVector(pos0, pos1, interPlane, shift0, shift1, lineGroup) {
    pos0.addVectors(interPlane.point, shift0);
    pos1.addVectors(interPlane.point, shift1);

    resetLine(pos0, pos1, lineGroup)
}

function magneticResetPosition(pos0, pos1, lineGroup, distanceLabel, distanceID,) {
    // pos1.y = dataSetting.axisY;
    resetLine(pos0, pos1, lineGroup);
    addDistanceLabel(pos0, pos1, distanceLabel, distanceID)
}

function setAudio() {
    

    var listener = new THREE.AudioListener();
    camera.add(listener);
    // create a global audio source
    var sound = new THREE.Audio(listener);

    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('./audio/audio.ogg', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(0.5);
        sound.play();
    });

    
}

function EllipseArc(center, vertex1, vertex2, maxBoxSize, depth) {

    // Get distances to center
    let centerDistanceVertex1 = vertex1.distanceTo(center);
    let centerDistanceVertex2 = vertex2.distanceTo(center);
    let isVertex1Larger = centerDistanceVertex1 > centerDistanceVertex2;

    // Translate vectors to origin
    let modifiedVertex1 = vertex1.clone().sub(center);
    let modifiedVertex2 = vertex2.clone().sub(center);

    // Angle between vectors
    let angle1 = modifiedVertex1.angle();
    let angle2 = modifiedVertex2.angle();
    let theta = angle1 > angle2 ? angle1 - angle2 : angle2 - angle1;
    let startAngle = 0;
    let endAngle = theta;
    let clockwise = false;

    if ((isVertex1Larger && angle1 > angle2) || (!isVertex1Larger && angle2 > angle1)) {
        endAngle *= -1;
        clockwise = true;
    }

    if (theta > Math.PI) {
        clockwise = !clockwise;
    }

    // Rotate vectors to align with axis
    let alpha = isVertex1Larger ? angle1 : angle2;
    let origin = new THREE.Vector2(0, 0);
    modifiedVertex1.rotateAround(origin, -alpha);
    modifiedVertex2.rotateAround(origin, -alpha);

    // Find radiuses (solve system of two equations by substitution)
    let radiusX = (Math.pow(modifiedVertex1.x, 2) - Math.pow(modifiedVertex2.x, 2)) /
        (-1 * Math.pow(modifiedVertex2.x, 2) * Math.pow(modifiedVertex1.y, 2) + Math.pow(modifiedVertex2.y, 2) * Math.pow(modifiedVertex1.x, 2));

    let radiusY = (1 - Math.pow(modifiedVertex1.y, 2) * radiusX) / Math.pow(modifiedVertex1.x, 2);

    radiusX = Math.sqrt(1 / radiusX);
    radiusY = Math.sqrt(1 / radiusY);

    // Arc
    let curve = new THREE.EllipseCurve(
        0, 0,
        radiusX, radiusY,
        startAngle, endAngle,
        clockwise,
        0
    );

    let points = curve.getPoints(100);
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.computeBoundingBox();
    let material = new THREE.LineDashedMaterial({
        color: colorSetting.semiCircleColor,
        dashSize: 0.9 * maxBoxSize,
        gapSize: 0.9 * maxBoxSize,
    });
    let ellipse = new THREE.Line(geometry, material);
    ellipse.renderOrder = 1;
    ellipse.rotation.z = alpha;
    ellipse.position.x = center.x;
    ellipse.position.y = center.y;
    ellipse.position.z = depth;
    ellipse.computeLineDistances();

    return ellipse;
}

function setSemiCircle(p0, p1, p, semiGroup, labelGroup, angle) { // p0: center p: semiCircle

    var D = p1.distanceTo(p0);
    var d = p.distanceTo(p0);
    var x = (d / D) * (p1.x - p0.x);
    var y = (d / D) * (p1.y - p0.y);

    var v1 = new THREE.Vector2(p0.x + x, p0.y + y);
    var v2; p0.x < p1.x ? v2 = new THREE.Vector2(p0.x + d, p0.y) : v2 = new THREE.Vector2(p0.x - d, p0.y);
    var c = new THREE.Vector2(p0.x, p0.y);
    var s = EllipseArc(c, v1, v2, 300, 0.06)
    semiGroup.add(s);
    scene.add(semiGroup);
    loader.load('./fonts/gentilis_regular.typeface.json', function (font) {
        var location;
        p0.x < p1.x ? location = new THREE.Vector3(v2.x, (v1.y + dataSetting.axisY - dataSetting.fontSize / 2) / 2, 0.1)
            : location = new THREE.Vector3(v2.x - 30, (v1.y + dataSetting.axisY - dataSetting.fontSize / 2) / 2, 0.1)
        if(angle == ' ') {
            setLabel(angle, location, font, labelGroup);
        }else{
            setLabel(angle + "°", location, font, labelGroup);
        }
        
    });
}

function setLabel(name, location, font, group) {

    removeLable(group);
    var textGeo = new THREE.TextBufferGeometry(name, {
        font: font,
        size: dataSetting.fontSize,
        height: 0.01,
        curveSegments: 1
    });

    var textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var textMesh = new THREE.Mesh(textGeo, textMaterial);
    textMesh.position.copy(location);
    group.add(textMesh);
    scene.add(group);
}

function addDistanceLabel(point0, point1, group, id) {

    loader.load('./fonts/gentilis_regular.typeface.json', function (font) {
        var location;
        var distance = (point0.distanceTo(point1) * dataSetting.reduction).toFixed(2);

        if (point0.y > point1.y) {
            point0.x < point1.x ?
                location = new THREE.Vector3((point0.x + point1.x) / 2, (point0.y + point1.y) / 2, 0.1)
                : location = new THREE.Vector3((point0.x + point1.x) / 2 - 50, (point0.y + point1.y) / 2, 0.1)
        } else {
            point0.x < point1.x ?
                location = new THREE.Vector3((point1.x + point0.x) / 2 - 50, (point0.y + point1.y) / 2, 0.1)
                : location = new THREE.Vector3((point1.x + point0.x) / 2, (point0.y + point1.y) / 2, 0.1)
        }
        setLabel(distance + "ft", location, font, group);
        jQuery(id).html(":" + " " + distance + " ft");
    });
}

function removeSemiCircle(group) {
    for (let i = group.children.length - 1; i >= 0; i--) {
        group.remove(group.children[i]);
    }
}

function removeLable(group) {
    for (let i = group.children.length - 1; i >= 0; i--) {
        group.remove(group.children[i]);
    }
}

$(document).ready(function(){
    $('html').keyup(function(e){
        if(e.keyCode == 46) {
            deleteLine1();
        }else{
            deleteLine2();
        }
    });
});