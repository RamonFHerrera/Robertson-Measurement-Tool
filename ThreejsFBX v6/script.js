"use strict";

import * as THREE from './build/three.module.js';

import { OrbitControls } from './jsm/orbit/orbitControl.js';

import { FBXLoader } from './jsm/loaders/FBXLoader.js';

var container, stats, controls, element;
var camera, scene, renderer, light;

var clock = new THREE.Clock();

var mixer;
var elapsedTime = 0;

var mesh;

var isDrag = false;

var dX1, dY1, dX2, dY2;
var dis = 500;

var t = 0;

init();
animate();

function downListener(e) {
    isDrag = true;

    dX1 = e.pageX;
    dY1 = e.pageY;
}

function upListener(e) {
    isDrag = false;
    dX2 = e.pageX;
    dY2 = e.pageY;

    var dX = Math.abs(dX2 - dX1);
    var dY = Math.abs(dY2 - dY1);

    dis = Math.floor(Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2)));
    t = 0;
    
    var fbxObject = scene.getObjectByName("RightUpperLeg")
    // Make sure this object exists before accessing it
    if (fbxObject) {
       fbxObject.rotation.x = -0.0011111;
    }
    elapsedTime = 0
}

function init() {
    container = document.createElement( 'div' );
    container.addEventListener('mousedown', downListener);
    container.addEventListener('mouseup', upListener);

    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 40, 100, 400 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

    light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 200, 100 );
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    scene.add( light );

    // scene.add( new CameraHelper( light.shadow.camera ) );

    // ground
    // mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );

    // model
    var loader = new FBXLoader();
    loader.load( './models/BH-2 Free.fbx', function ( object ) {
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );
        scene.add( object );
    }, function onProgress(argument){  }, function onError(e) {
        console.log("e:", e)
    });

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate(param) {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    var fbxObject = scene.getObjectByName("RightUpperLeg")
    // Make sure this object exists before accessing it
    if (fbxObject && dis != 0) {
        elapsedTime += delta*4;
        fbxObject.rotation.x = Math.sin( elapsedTime ) * Math.PI/2 * Math.sin(dis/window.innerWidth*(Math.PI/2));
    }
    renderer.render( scene, camera );
}