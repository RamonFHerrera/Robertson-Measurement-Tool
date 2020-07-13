function setMoveSemiCircle2(p0, p1, ss, dx, dy, semiCircleGroup, labelGroup) { // p0: first endPoint, p1: second endPoint, s: semiCircle point
    var angle = getAngle(p0, p1);
    movedSemiPoint2 = new THREE.Vector3(ss.x + dx, ss.y + dy, ss.z)
    if (p1.x > p0.x) {
        if (movedSemi.x < p0.x) {
            movedSemiPoint2 = new THREE.Vector3(p0.x + 15, p0.y + 15, p0.z + 15)
        }
    } else {
        if (movedSemi.x > p0.x) {
            movedSemiPoint2 = new THREE.Vector3(p0.x - 15, p0.y - 15, p0.z - 15)
        }
    }
    removeLable(labelGroup);
    removeSemiCircle(semiCircleGroup);
    setSemiCircle(p0, p1, movedSemiPoint2, semiCircleGroup, labelGroup, angle);
}

function drawSemiCircle2(p0, p1, semiCircleGroup, labelGroup, id) { //set the semiCircle draw
    var angle = getAngle(p0, p1);
    if (p1.y > dataSetting.axisY - 0.6 && p1.y < dataSetting.axisY + 0.6 && p0.y > p1.y) {
        // add semicircle
        removeLable(labelGroup);
        removeSemiCircle(semiCircleGroup);
        var angleShowState = 1;
        if (angleShowState === 1) {
            firstSemiCircle2 = true;

            p0.x > p1.x ?
                semiCirclePoint2 = new THREE.Vector3(p1.x + 30, p1.y + 30, p1.z)
                : semiCirclePoint2 = new THREE.Vector3(p1.x - 30, p1.y + 30, p1.z);

            setSemiCircle(p1, p0, semiCirclePoint2, semiCircleGroup, labelGroup, angle);

            angleShowState = null;
            dataSetting.angleShowStatus2 = true;
        }
    }
    else {
        angleShowState = null;
        dataSetting.angleShowStatus2 = false;
        removeLable(labelGroup);
        removeSemiCircle(semiCircleGroup);
    }
    jQuery(id).html(":" + " " + angle + " °");

}