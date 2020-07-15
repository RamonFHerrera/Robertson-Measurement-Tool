function getBallMesh() {
    var ballGeo = new THREE.SphereGeometry(3, 32, 32);
    var ballMat = new THREE.MeshLambertMaterial({ color: colorSetting.ballColor, transparent: true, opacity: 1 });
    var Ball = new THREE.Mesh(ballGeo, ballMat);
    return Ball;
}

function getLineMesh(pos0, pos1, color, opa) {
    var points = [];
    points.push(new THREE.Vector3(pos0.x, pos0.y, 0));
    points.push(new THREE.Vector3(pos1.x, pos1.y, 0));
    var lineGeo = new THREE.Geometry().setFromPoints(points);
    var lineMat = new THREE.LineBasicMaterial({ color: color, linewidth: 10 });
    if (opa) { lineMat.transparent = true; lineMat.opacity = opa;}
    else { lineMat.depthTest = false; lineMat.transparent = true; }
    var Line = new THREE.Line(lineGeo, lineMat);
    return Line;
}

function createBall(pos0, pos1, ballGroup, lineGroup) {
    removeBall(ballGroup, lineGroup);

    var sMesh = getBallMesh(),
        eMesh = getBallMesh();
    sMesh.ballNum = 0; eMesh.ballNum = 1;
    ballGroup.add(sMesh); ballGroup.add(eMesh);
    sMesh.position.set(pos0.x, pos0.y, pos0.z);
    eMesh.position.set(pos1.x, pos1.y, pos1.z);

    var lineMesh = getLineMesh(pos0, pos1, colorSetting.lineColor, 1);
    lineGroup.add(lineMesh);
    // addDistanceLabel(pos0, pos1, distanceLabel1, distance1);

    
    scene.add(lineGroup);
    scene.add(ballGroup);
}

function horizontalLine() {
    var groundLineMesh = getLineMesh(new THREE.Vector3(-300, dataSetting.axisY, 0.1),
        new THREE.Vector3(300, dataSetting.axisY, 0.1),
        colorSetting.centerLineColor);
    groundlineGroup.add(groundLineMesh);
    scene.add(groundlineGroup)
}

function setBallPos(ballNum, pos, ballGroup, lineGroup) {
    if (pos.x) ballGroup.children[ballNum].position.x = pos.x;
    if (pos.y) ballGroup.children[ballNum].position.y = pos.y;
    if (pos.z) ballGroup.children[ballNum].position.z = pos.z;
    var sPos = ballGroup.children[0].position;
    var ePos = ballGroup.children[1].position;
    var points = [sPos, ePos];
    lineGroup.children[0].geometry = new THREE.BufferGeometry().setFromPoints(points);
}

function resetLine(pos0, pos1, lineGroup) {
    var points = [pos0, pos1];
    lineGroup.children[0].geometry = new THREE.BufferGeometry().setFromPoints(points);
}

function getAngle(pos0, pos1) {
    var originVector = new THREE.Vector3(pos1.x - pos0.x, pos1.y - pos0.y, pos1.z - pos0.z)
    var theta_X = setAngle(originVector, new THREE.Vector3(1, 0, 0))
    angle = theta_X.toFixed(2);
    if (angle > 90) angle = (180 - angle).toFixed(2);
    return angle;
}

function setAngle(originAngle, groundAngle) {
    var dot = originAngle.dot(groundAngle);
    var lengthA = originAngle.length();
    var lengthB = groundAngle.length();
    var theta = (Math.acos(dot / (lengthA * lengthB)) * 180) / Math.PI; //degree
    return theta;
}

function removeBall(ballGroup, lineGroup) {
    for (let i = ballGroup.children.length - 1; i >= 0; i--) {
        ballGroup.remove(ballGroup.children[i]);
    }
    for (let i = lineGroup.children.length - 1; i >= 0; i--) {
        lineGroup.remove(lineGroup.children[i]);
    }
}

function setBallOver(ballNum, group) {
    group.children.forEach(ball => {
        var colVal = (ball.ballNum === ballNum) ? colorSetting.ballOverColor : colorSetting.ballColor;
        ball.material.color.setHex(colVal);
    });
}