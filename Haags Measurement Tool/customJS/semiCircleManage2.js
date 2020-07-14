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

    dataSetting.movedAngle2 = movedSemiPoint2;
    dataSetting.angleFlag2 = true;

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

            if(!dataSetting.angleMove2) {
                p0.x > p1.x ?
                    semiCirclePoint2 = new THREE.Vector3(p1.x + 30, p1.y + 30, p1.z)
                    : semiCirclePoint2 = new THREE.Vector3(p1.x - 30, p1.y + 30, p1.z);
            }else{
                var tmp =  dataSetting.movedAngle2;
                if(dataSetting.beforeAngleX2 != null && !dataSetting.angleFlag2) {
                    tmp.x = dataSetting.beforeAngleX2;
                }   
                if(dataSetting.lineMove2) {
                    var ppp = dataSetting.beforePointX2;
                    var minus = 0;
                    if(ppp < p1.x) {
                        minus = p1.x - ppp;
                        tmp.x += minus;
                    }else{
                        minus = ppp - p1.x ;
                        tmp.x -= minus;
                    }
                }
                semiCirclePoint2 = tmp;
                // ***
                dataSetting.beforeAngleX2 = tmp.x;
            }
                
            if(angle == 0.00) {
                angle = ' ';
            }
            setSemiCircle(p1, p0, semiCirclePoint2, semiCircleGroup, labelGroup, angle);

            // ***
            dataSetting.beforePointX2 = p1.x;

            angleShowState = null;
            dataSetting.angleShowStatus2 = true;
        }

        if(angle == ' '){
            jQuery(id).html(":" + " " + "0.00" + "°");
        }else{
            jQuery(id).html(":" + " " + angle + "°");
        }
    

}