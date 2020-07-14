function setMoveSemiCircle1(p0, p1, ss, dx, dy, semiCircleGroup, labelGroup) { // p0: first endPoint, p1: second endPoint, s: semiCircle point
    var angle = getAngle(p0, p1);
    movedSemiPoint1 = new THREE.Vector3(ss.x + dx, ss.y + dy, ss.z);
    if (p1.x > p0.x) {
        if (movedSemiPoint1.x < p0.x) {
            movedSemiPoint1 = new THREE.Vector3(p0.x + 15, p0.y + 15, p0.z + 15)
        }
    } else {
        if (movedSemiPoint1.x > p0.x) {
            movedSemiPoint1 = new THREE.Vector3(p0.x - 15, p0.y - 15, p0.z - 15)
        }
    }
    
    removeLable(labelGroup);
    removeSemiCircle(semiCircleGroup);
    if(angle == 0.00) {
        angle = ' ';
    }
    // ***
    dataSetting.movedAngle1 = movedSemiPoint1;
    dataSetting.angleFlag1 = true;
    
    setSemiCircle(p0, p1, movedSemiPoint1, semiCircleGroup, labelGroup, angle);
}

function drawSemiCircle1(p0, p1, semiCircleGroup, labelGroup, id, flag = 'no') { //set the semiCircle draw

    var angle = getAngle(p0, p1);

    removeLable(labelGroup);
    removeSemiCircle(semiCircleGroup);
    var angleShowState1 = 1;
    if (angleShowState1 === 1) {
        firstSemiCircle1 = true;

        if(!dataSetting.angleMove1) {
            p0.x > p1.x ?
                semiCirclePoint1 = new THREE.Vector3(p1.x + 30, p1.y + 30, p1.z)
                : semiCirclePoint1 = new THREE.Vector3(p1.x - 30, p1.y + 30, p1.z);
        }else{
            var tmp =  dataSetting.movedAngle1;
            if(dataSetting.beforeAngleX1 != null && !dataSetting.angleFlag1) {
                tmp.x = dataSetting.beforeAngleX1;
            }   
            if(dataSetting.lineMove1) {
                var ppp = dataSetting.beforePointX1;
                var minus = 0;
                if(ppp < p1.x) {
                    minus = p1.x - ppp;
                    tmp.x += minus;
                }else{
                    minus = ppp - p1.x ;
                    tmp.x -= minus;
                }
            }
            semiCirclePoint1 = tmp;
            // ***
            dataSetting.beforeAngleX1 = tmp.x;
        }

        if(angle == 0.00) {
            angle = ' ';
        }

        setSemiCircle(p1, p0, semiCirclePoint1, semiCircleGroup, labelGroup, angle);

        // ***
        dataSetting.beforePointX1 = p1.x;
        

        angleShowState1 = null;
        dataSetting.angleShowStatus1 = true;
    }

    if(angle == ' '){
        jQuery(id).html(":" + " " + "0.00" + "°");
    }else{
        jQuery(id).html(":" + " " + angle + "°");
    }
    

    return dataSetting.angleShowStatus1;
}





