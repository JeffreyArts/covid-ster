<style src="./covid-star.scss"></style>
<template>

        <div :title="lng.main.downloadStar" class="covid-star">
            <img :src="image" class="covid-star-view" v-if="filetype == 'png'">
        </div>
</template>

<script>
import _ from 'lodash';
import * as THREE from 'three';
// import { OrbitControls } from './../../../node_modules/three/examples/jsm/controls/OrbitControls.js';

import {PolylineAlgorithm, Grid, Polyline} from 'visual-pattern-generator';
import seedrandom  from "seedrandom";

import patternToThreejs from './../../services/pattern-to-threejs.js'
import Potrace from './../../services/potrace';
import LNG from './../../services/languages.js'
import { CSG } from 'three-csg-ts';

var camera, renderer, scene;
var container =  {
    width: 256,
    height: 256,
}
var pattern3D   = new THREE.Object3D();
var cube        =  {
    top: new THREE.Object3D(),
    bottom: new THREE.Object3D(),
    left: new THREE.Object3D(),
    right: new THREE.Object3D(),
    front: new THREE.Object3D(),
    back: new THREE.Object3D(),
}

var symbols = [
    {
        polylines: [
            [{x:0, y:0},{ x:1, y:0}]
        ],
        connectCords: [
            {x:0, y:0},
            {x:1, y:0}
        ],
        width:2,
        height:1
    },
    {
        polylines: [
            [{x:0, y:0},{ x:0, y:1}]
        ],
        connectCords: [
            {x:0, y:0},
            {x:0, y:1}
        ],
        width:1,
        height:2
    }
];

const algorithmConfig = {
    width: 5,
    height: 5,
    symbols: symbols,
    algorithm: {
        type: "polylines",
        startPoint: {x:0, y:0},
        mirrorX: 1,
        mirrorY: 1,
        drawConnectLines: true
    }
}

var masks = []
for (var i = 0; i < 5; i++) {
    masks.push([
        [1,0,0,0,1],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [1,0,0,0,1],
    ])
}
for (var i = 0; i < 4; i++) {
    masks.push([
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
    ])
}
masks.push([
    [1,1,0,1,1],
    [1,0,0,0,1],
    [0,0,0,0,0],
    [1,0,0,0,1],
    [1,1,0,1,1],
])

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

function base64SvgToBase64Png (originalBase64, width) {
    return new Promise(resolve => {
        let img = document.createElement('img');
        img.onload = function () {
            document.body.appendChild(img);
            let canvas = document.createElement("canvas");
            let ratio = (img.clientWidth / img.clientHeight) || 1;
            document.body.removeChild(img);
            canvas.width = width;
            canvas.height = width / ratio;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            try {
                let data = canvas.toDataURL('image/png');
                resolve(data);
            } catch (e) {
                resolve(null);
            }
        };
        img.src = originalBase64;
    });
}
export default {
    props: ['seed', 'filetype', 'outline', 'output'],
    data() {
        return {
            lng: LNG.data,
            image:'',
            faces:[
                {
                    title: "top / bottom",
                    polylines: [],
                    three: null,
                    mirrorX:true,
                    mirrorY:true,
                    width: algorithmConfig.width,
                    height: algorithmConfig.height
                },
                {
                    title: "front / back",
                    polylines: [],
                    three: null,
                    mirrorX:true,
                    mirrorY:true,
                    width: algorithmConfig.width,
                    height: algorithmConfig.height

                },
                {
                    title: "left / right",
                    polylines: [],
                    three: null,
                    mirrorX:true,
                    mirrorY:true,
                    width: algorithmConfig.width,
                    height: algorithmConfig.height
                }
            ],
        }
    },
    methods: {
        removeObject(object) {
            if (object.children.length > 0) {
                _.each(object.children, childObject => {
                    this.removeObject(childObject)
                })
            }

            if (object.geometry && object.geometry.dispose) {
                object.geometry.dispose();
            }

            if (object.dispose) {
                object.dispose();
            }

            scene.remove(object)
        },
        create3DPattern(faceIndex) {
            const diameter = .2;

            const face3D = patternToThreejs(_.map(this.faces[faceIndex].polylines, polyline => {
                    return _.map(polyline, cord => {
                        return {
                            x:cord.x - (algorithmConfig.width - 1)/2,
                            y:cord.y - (algorithmConfig.height - 1)/2
                        }
                    })
                }), {
                width: algorithmConfig.width,
                height: algorithmConfig.height,
                type: "box",
                diameter: diameter,
                beamWidth: diameter,
                beamHeight: diameter,
                tube: false,
                color: "#444",
                tubeThickness: .0125,
            });

            let mergedObject = face3D[0];

            for (var i = 1; i < face3D.length; i++) {
                mergedObject = CSG.toMesh(CSG.fromMesh(mergedObject).union(CSG.fromMesh(face3D[i])), mergedObject.matrix)
            }


            if (this.faces[faceIndex].title.indexOf("top") != -1) {
                _.remove(pattern3D.children, childObject => {
                    if (childObject.name == "face-top") {
                        this.removeObject(cube.top)
                        this.removeObject(childObject)
                        return true;
                    }
                })
                cube.top = mergedObject.clone();
                cube.top.material = face3D[0].material;
                cube.top.name = "face-top"
                cube.top.rotateZ(degrees_to_radians(180));

                cube.top.position.x = 0;
                cube.top.position.y = -(algorithmConfig.width-1)/2 + diameter / 2
                cube.top.position.z = 0;

                pattern3D.add(cube.top);
            }

            if (this.faces[faceIndex].title.indexOf("bottom") != -1) {
                _.remove(pattern3D.children, childObject => {
                    if (childObject.name == "face-bottom") {
                        this.removeObject(cube.bottom)
                        this.removeObject(childObject)
                        return true;
                    }
                })
                cube.bottom = mergedObject.clone();
                cube.bottom.material = face3D[0].material;
                cube.bottom.name = "face-bottom"
                // cube.bottom.rotateZ(degrees_to_radians(180));

                cube.bottom.position.x = 0;
                cube.bottom.position.y = (algorithmConfig.width-1)/2 - diameter / 2
                cube.bottom.position.z = 0;
                pattern3D.add(cube.bottom);
            }

            if (this.faces[faceIndex].title.indexOf("front") != -1) {
                _.remove(pattern3D.children, childObject => {
                    if (childObject.name == "face-front") {
                        this.removeObject(cube.front)
                        this.removeObject(childObject)
                        return true;
                    }
                })
                cube.front = mergedObject.clone();
                cube.front.material = face3D[0].material;
                cube.front.name = "face-front"
                cube.front.rotateZ(degrees_to_radians(180));
                cube.front.rotateX(degrees_to_radians(90));

                cube.front.position.x = 0;
                cube.front.position.y = 0;
                cube.front.position.z =  (algorithmConfig.width-1)/2 - diameter / 2;
                pattern3D.add(cube.front);
            }

            if (this.faces[faceIndex].title.indexOf("back") != -1) {
                _.remove(pattern3D.children, childObject => {
                    if (childObject.name == "face-back") {
                        this.removeObject(cube.back)
                        this.removeObject(childObject)
                        return true;
                    }
                })
                cube.back = mergedObject.clone();
                cube.back.material = face3D[0].material;
                cube.back.name = "face-back"
                cube.back.rotateZ(degrees_to_radians(180));
                cube.back.rotateY(degrees_to_radians(180));
                cube.back.rotateX(degrees_to_radians(90));

                cube.back.position.x = 0;
                cube.back.position.y = 0;
                cube.back.position.z =  -(algorithmConfig.width-1)/2 + diameter / 2;
                pattern3D.add(cube.back);
            }


            if (this.faces[faceIndex].title.indexOf("left") != -1) {
                _.remove(pattern3D.children, childObject => {
                    if (childObject.name == "face-left") {
                        this.removeObject(cube.left)
                        this.removeObject(childObject)
                        return true;
                    }
                })
                cube.left = mergedObject.clone();
                cube.left.material = face3D[0].material;
                cube.left.name = "face-left"
                cube.left.rotateZ(degrees_to_radians(180));
                cube.left.rotateY(degrees_to_radians(90));
                cube.left.rotateX(degrees_to_radians(90));

                cube.left.position.x =  -(algorithmConfig.width-1)/2 + diameter / 2;;
                cube.left.position.y = 0;
                cube.left.position.z = 0;

                pattern3D.add(cube.left);
            }

            if (this.faces[faceIndex].title.indexOf("right") != -1) {
                _.remove(pattern3D.children, childObject => {
                    if (childObject.name == "face-right") {
                        this.removeObject(cube.right)
                        this.removeObject(childObject)
                        return true;
                    }
                })
                cube.right = mergedObject.clone();
                cube.right.material = face3D[0].material;
                cube.right.name = "face-right"
                cube.right.rotateZ(degrees_to_radians(180));
                cube.right.rotateY(degrees_to_radians(270));
                cube.right.rotateX(degrees_to_radians(90));

                cube.right.position.x =  (algorithmConfig.width-1)/2 - diameter / 2;
                cube.right.position.y = 0;
                cube.right.position.z = 0;
                pattern3D.add(cube.right);
            }
        },
        getSeededValue(array, seed){
            return array[Math.floor(new Math.seedrandom(seed)() * array.length)];
        },
        procesSeed(){

            this.safeSeed = this.seed
            if (!this.seed) {
                this.safeSeed = "D3f4uLt";
            }

            _.each(this.faces, (face, faceIndex) => {
                this.updateFace(faceIndex)
            })
            _.each(scene.children, childObject => {
                if (childObject.modelValue == true) {
                    removeObject(childObject)
                }
            })

            _.each(this.faces,(face, faceIndex) => {
                if (face.polylines.length > 0) {
                    this.create3DPattern(faceIndex)
                }
            });

            pattern3D.rotation.x = degrees_to_radians(54.75);
            pattern3D.rotation.y = degrees_to_radians(45);

            if (pattern3D && pattern3D.uuid && pattern3D.children.length > 0) {
                scene.add(pattern3D)
            }


            renderer.setClearColor( 0xffffff, 0 );
            if (this.filetype == 'svg' || this.outline) {
                renderer.setClearColor( 0xffffff, 1 );
            }


            var svgElement = this.$el.querySelector('svg');
            if (svgElement) svgElement.remove();

            renderer.render(scene, camera);
            if (!this.outline) {
                this.image = renderer.domElement.toDataURL("image/png");
            }
            if(this.output && !this.outline) {
                this.output.png = this.image
            }


            if (this.filetype == 'svg' || this.outline) {
                Potrace.loadImageFromUrl(renderer.domElement.toDataURL("image/png"))

                Potrace.process(()=> {
                    this.svg = '<svg id="svg" version="1.1" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">';
                    var svgPath = Potrace.getSVG(1);
                    if (this.outline) {
                        this.svg += `<path d="M${svgPath.split("M")[1]}" stroke="white" stroke-width="180" fill="white"/>`;
                    }
                    this.svg += `<path d="${svgPath}" fill="black"/>`;
                    this.svg += `</svg>`;


                    // Remove any characters outside the Latin1 range
                    var decoded = unescape(encodeURIComponent(this.svg));
                    // Now we can use btoa to convert the svg to base64
                    var base64 = btoa(decoded);

                    if(this.output) {
                        this.output.svg = `data:image/svg+xml;base64,${base64}`;
                    }

                    if (this.filetype == 'svg') {
                        this.$el.insertAdjacentHTML('beforeend',this.svg)
                    }

                    if (this.outline) {
                        base64SvgToBase64Png(`data:image/svg+xml;base64,${base64}`, 2048).then(pngBlob => {

                            if (this.filetype == 'png') {
                                this.image = pngBlob;
                            }

                            if(this.output) {
                                this.output.png = pngBlob
                            }
                        })
                    }
                });
            }
        },
        updateFace(faceIndex) {
                var mirrorOptions = [
                    [
                        {
                            mirrorX: true,
                            mirrorY: true,
                        },{
                            mirrorX: true,
                            mirrorY: true,
                        },
                        {
                            mirrorX: true,
                            mirrorY: true,
                        }
                    ],

                    [
                        {
                            mirrorX: true,
                            mirrorY: true,
                        },{
                            mirrorX: false,
                            mirrorY: true,
                        },{
                            mirrorX: true,
                            mirrorY: true,
                        }
                    ],

                    [
                        {
                            mirrorX: true,
                            mirrorY: true,
                        },{
                            mirrorX: true,
                            mirrorY: true,
                        },{
                            mirrorX: false,
                            mirrorY: true,
                        }
                    ],

                ]

                this.faces[faceIndex].mirrorX = this.getSeededValue(mirrorOptions, this.safeSeed+faceIndex)[faceIndex].mirrorX
                this.faces[faceIndex].mirrorY = this.getSeededValue(mirrorOptions, this.safeSeed+faceIndex)[faceIndex].mirrorY

                var query = _.merge({}, algorithmConfig, {
                    seed: this.safeSeed + faceIndex,
                })

                _.merge(query.algorithm, {
                    mirrorX: this.faces[faceIndex].mirrorX === true ? 1 : 0,
                    mirrorY: this.faces[faceIndex].mirrorY === true ? 1 : 0,
                    mask: this.getSeededValue(masks, query.seed)
                })
                this.faces[faceIndex].polylines = PolylineAlgorithm(query).polylines;
        }
    },
    watch: {
        seed: {
            handler(val, oldVal) {
                this.procesSeed();
            }
        },
    },
    mounted() {
        container.width = this.$el.clientWidth;
        container.height = this.$el.clientWidth;
        var allowedTypes = ['svg', 'png']
        if (allowedTypes.indexOf(this.filetype) == -1) {
            console.error("Invalid filetype for covid star component", this.filetype)
        }

        const dimensions = {
          width: 36,
          height: 36,
          depth: 36
        }

        renderer = new THREE.WebGLRenderer({
            alpha: true,
            powerPreference: "low-power",
            antialias: true
        });
        renderer.setSize( 2048, 2048);

        scene        = new THREE.Scene();
        camera       = new THREE.OrthographicCamera( -16, 16, -16, 16, 0, 100 );
        camera.position.set( 0, 8, 0)
        camera.zoom = 4.2
        camera.lookAt( 0, 0, 0)

        const cameraHelper = new THREE.CameraHelper(camera);
        this.procesSeed();
        document.addEventListener("languageChange",() => {
            this.lng = LNG.data;
        },false);
    }

}

</script>