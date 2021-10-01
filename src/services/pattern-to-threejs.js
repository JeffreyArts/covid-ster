import {Algorithm, Grid, Polyline} from 'visual-pattern-generator';
import _  from 'lodash';
import * as THREE from 'three';

const mergePattern = (pattern, map) => {
    Grid.loop(map, (x,y) => {
        var current = map[y][x];
        if (current.char == "─") {
            var polylines = Polyline.getLinesAtPoint(x,y,pattern)
            if (polylines.length == 2) {
                var line1 = polylines[0];
                var line2 = polylines[1];
                var line1Min = _.minBy(line1.line, 'x');
                var line2Min = _.minBy(line2.line, 'x');
                var line1Max = _.maxBy(line1.line, 'x');
                var line2Max = _.maxBy(line2.line, 'x');

                if (line1Min.x < line2Min.x) {
                    line1Max.x = line2Max.x;
                } else {
                    line1Min.x = line2Min.x
                }
                _.remove(pattern, (val,index) => {
                    return index == line2.index
                })
            }
        } else if (current.char == "│") {
            var polylines = Polyline.getLinesAtPoint(x,y,pattern)
            if (polylines.length == 2) {
                var line1 = polylines[0];
                var line2 = polylines[1];
                var line1Min = _.minBy(line1.line, 'y');
                var line2Min = _.minBy(line2.line, 'y');
                var line1Max = _.maxBy(line1.line, 'y');
                var line2Max = _.maxBy(line2.line, 'y');

                if (line1Min.y < line2Min.y) {
                    line1Max.y = line2Max.y;
                } else {
                    line1Min.y = line2Min.y
                }
                _.remove(pattern, (val,index) => {
                    return index == line2.index
                })
            }
        }
    })
}

const patternToThreejsService = (pattern, options = {
        width: 10,
        height: 10,
        tube: false,
        dev: false,
        tubeThickness:0.0125, // tube=true specific
        type: "cylinder",
        beamWidth: .5,      // type=box specific
        beamHeight: .5,     // type=box specific
        segments: 16,       // type=cylinder specific
        diameter: .1        // type=cylinder specific
    }) => {

        const type      = _.isUndefined(options.type) ? "cylinder" : options.type;
        const parts     =  new THREE.Object3D();
        let   radius    = 0;

        if (type.indexOf["box", "cylinder"] == -1) {
            return console.error("Provide correct type ('box' or 'cylinder')")
        }

        if (type == "cylinder") {
            var segments = options.segments || 32;
            radius = options.diameter/2 || .5;
        }

        if (type == "box") {
            options.beamWidth = options.beamWidth || .5;
            options.beamHeight = options.beamHeight || .5;
            radius = options.beamWidth;
        }

        if (options.tube && !options.tubeThickness){
            options.tubeThickness = radius/10
        }

        if (!options.color){
            options.color = "#333"
        }


        const material  = new THREE.MeshLambertMaterial( { color: options.color });
        const map = Polyline.createMap(pattern, options.width, options.height);

        mergePattern(pattern, map);
        pattern.forEach((polyline, polylineIndex) => {
            polyline.forEach((cord, ii) => {
                if (ii == 0) {
                    return;
                }
                var length = 0;
                var xOffset = cord.x;
                var zOffset = cord.y;
                var orientation = "vert";

                if (polyline[ii-1].x == polyline[ii].x) {
                    orientation = "hor"

                    // Set length
                    if (polyline[ii-1].y > polyline[ii].y) {
                        length = polyline[ii-1].y - polyline[ii].y + radius*2;
                        zOffset += length/2 - radius;
                    } else {
                        length = polyline[ii].y - polyline[ii-1].y + radius*2;
                        zOffset -= length/2 - radius;
                    }

                    if (type == "cylinder") {
                        var geometry = new THREE.CylinderGeometry(radius, radius , length, segments);
                        var cuttingGeometry = new THREE.CylinderGeometry(radius-options.tubeThickness, radius-options.tubeThickness , length, segments);
                    } else if (type == "box") {
                        length -= options.beamWidth
                        var geometry = new THREE.BoxGeometry(options.beamWidth, length, options.beamHeight);
                        var cuttingGeometry = new THREE.BoxGeometry(options.beamWidth-options.tubeThickness, length, options.beamHeight-options.tubeThickness);
                    }
                    geometry.rotateX(Math.PI/180*90);
                    cuttingGeometry.rotateX(Math.PI/180*90);

                } else if (polyline[ii-1].y == polyline[ii].y) {

                    // Set length
                    if (polyline[ii-1].x > polyline[ii].x) {
                        length = polyline[ii-1].x - polyline[ii].x + radius*2;
                        xOffset += length/2 - radius
                    } else {
                        length = polyline[ii].x - polyline[ii-1].x + radius*2;
                        xOffset -= length/2 - radius;
                    }

                    if (type == "cylinder") {
                        var geometry = new THREE.CylinderGeometry(radius, radius , length, segments);
                        var cuttingGeometry = new THREE.CylinderGeometry(radius-options.tubeThickness, radius-options.tubeThickness , length, segments);
                    } else if (type == "box") {
                        length -= options.beamWidth
                        var geometry = new THREE.BoxGeometry(options.beamWidth, length, options.beamHeight);
                        var cuttingGeometry = new THREE.BoxGeometry(options.beamWidth-options.tubeThickness, length, options.beamHeight-options.tubeThickness);
                    }

                    geometry.rotateZ(Math.PI/180*90);
                    geometry.rotateX(Math.PI/180*90); // Only required for box type
                    cuttingGeometry.rotateZ(Math.PI/180*90);
                    cuttingGeometry.rotateX(Math.PI/180*90); // Only required for box type

                } else {
                    console.error('Unsupported input', polyline[ii], polyline[ii-1]);
                }

                if (type == "box") {
                    geometry.translate(xOffset, options.beamHeight/2, zOffset)
                    cuttingGeometry.translate(xOffset, options.beamHeight/2, zOffset)
                } else {
                    geometry.translate(xOffset, radius, zOffset)
                    cuttingGeometry.translate(xOffset, radius, zOffset)
                }

                var newPartMesh = new THREE.Mesh(geometry)

                newPartMesh.material = material;
                newPartMesh.orientation = orientation
                newPartMesh.polyline = polyline
                newPartMesh.polylineIndex = polylineIndex;
                newPartMesh.updateMatrix();

                if (options.dev) {
                    newPartMesh.material.transparent = true;
                    newPartMesh.material.opacity = .64;
                } else {
                    newPartMesh.castShadow = true;
                }

                parts.add(newPartMesh)
            });
        });

        return parts

};


export default patternToThreejsService