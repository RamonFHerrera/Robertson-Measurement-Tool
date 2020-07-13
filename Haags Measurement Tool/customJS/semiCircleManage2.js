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
    if(angle == 0.00) {
        angle = ' ';
    }
    setSemiCircle(p0, p1, movedSemiPoint2, semiCircleGroup, labelGroup, angle);
}

function drawSemiCircle2(p0, p1, semiCircleGroup, labelGroup, id) { //set the semiCircle draw
    var angle = getAngle(p0, p1);
        // add semicircle
        removeLable(labelGroup);
        removeSemiCircle(semiCircleGroup);
        var angleShowState = 1;
        if (angleShowState === 1) {
            firstSemiCircle2 = true;

            p0.x > p1.x ?
                semiCirclePoint2 = new THREE.Vector3(p1.x + 30, p1.y + 30, p1.z)
                : semiCirclePoint2 = new THREE.Vector3(p1.x - 30, p1.y + 30, p1.z);
                
            if(angle == 0.00) {
                angle = ' ';
            }
            setSemiCircle(p1, p0, semiCirclePoint2, semiCircleGroup, labelGroup, angle);

            angleShowState = null;
            dataSetting.angleShowStatus2 = true;
        }

        if(angle == ' '){
            jQuery(id).html(":" + " " + "0.00" + "°");
        }else{
            jQuery(id).html(":" + " " + angle + "°");
        }
    

}