
/**
 *
 * Visualize mechanic simulations.
 *
 * @author Anthony Clark
 *
 */

// TODO: teardown visualization after new log is loaded

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  Clock,
  AmbientLight,
  SpotLight,
  LightShadow,
  PlaneGeometry,
  ShadowMaterial,
  Mesh,
  GridHelper,
  AnimationMixer,
} from 'three';

import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/loaders/GLTFLoader';
// import 'three/examples/js/libs/stats.min';
import { Stats } from './stats';
/* global THREE */

import LogToGLTF from './logToGLTF';


// // Three.js core variables
// let scene, camera, renderer, mixer, clip, action, clock, axis;
// // Thee.js extras
// let controls, stats, loader, gui;

class Visualizer {

  constructor(fps, containerID) {
    // TODO: detect stuff
    // if (!Detector.webgl) {
    //   const warning = Detector.getWebGLErrorMessage();
    //   document.getElementById(container_id).appendChild(warning);
    // }


    // Visualization state
    this.time = 0;
    this.isPlaying = false;
    this.isShutdown = true;
    this.playbackSpeed = 1;


    // TODO: pass in the actual element instead?
    const container = document.getElementById(containerID);

    // TODO: should these be passed in?
    const width = window.innerWidth;
    const height = window.innerHeight;


    this.updateInterval = 1000 / fps;


    this.scene = new Scene();


    this.scene.add(new AmbientLight(0xffffff));


    this.spotLight = new SpotLight(0xffffff, 1.5);
    this.spotLight.position.set(0, 15, 5);
    this.spotLight.castShadow = true;
    this.spotLight.shadow = new LightShadow(new PerspectiveCamera(60, 1, 10, 200));
    this.spotLight.shadow.bias = -0.000222;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.scene.add(this.spotLight);


    // TODO: pass in device pixel ratio?
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xffffff);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);


    // fov in degrees, aspect ratio, near clip, far clip
    this.camera = new PerspectiveCamera(60, width / height, 0.01, 100);
    this.camera.position.set(-8, 8, 8);
    this.camera.lookAt(0, 0, 0);


    const groundMaterial = new ShadowMaterial({ opacity: 0.1 });
    const groundGeometry = new PlaneGeometry(100, 100);
    groundGeometry.rotateX(-Math.PI / 2);
    this.ground = new Mesh(groundGeometry, groundMaterial);
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);


    this.grid = new GridHelper(100, 100);
    this.grid.material.opacity = 0.5;
    this.grid.material.transparent = true;
    this.scene.add(this.grid);


    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);


    this.axis = new AxesHelper(100);
    this.scene.add(this.axis);


    this.loader = new THREE.GLTFLoader();


    this.clock = new Clock();


    this.stats = new Stats();
    // this.stats = Stats();
    container.appendChild(this.stats.dom);


    window.addEventListener('resize', this.onWindowResize, false);


    // const geometry = new BoxBufferGeometry();
    // const material = new MeshStandardMaterial();
    // const mesh = new THREE.Mesh(geometry, material);
    // mesh.castShadow = true;
    // mesh.position.y = 2;
    // this.scene.add(mesh);
  }


  loadAnimation(log) {
    const converter = new LogToGLTF();
    const gltf = converter.convert(log);

    // console.log(JSON.stringify(gltf, null, '  '));


    this.loader.parse(
      // glTF data in JSON format
      // gltf,
      JSON.stringify(gltf, null, '  '),

      // Path to resources
      '',

      // onLoad callback function
      (data) => {
        data.scene.traverse((child) => {
          if (child.isMesh) {
            // child.material.envMap = envMap;
            child.material.needsUpdate = true;
            child.castShadow = true;
          }
        });

        this.scene.add(data.scene);

        this.mixer = new AnimationMixer(data.scene);
        this.clips = data.animations;

        this.clips.forEach((clip) => {
          const action = this.mixer.clipAction(clip);
          action.play();
          action.paused = true;
        });

        // data.animations; // Array<THREE.AnimationClip>
        // data.scene;      // THREE.Scene
        // data.scenes;     // Array<THREE.Scene>
        // data.cameras;    // Array<THREE.Camera>

        // createGUI();
      },

      // onError callback function
      (error) => {
        // eslint-disable-next-line
        console.error(error);
      },
    );
  }


  getTime() {
    return this.time;
  }
  setTime(newTime) {
    this.time = newTime;
  }


  getIsPlaying() {
    return this.isPlaying;
  }
  setIsPlaying(newVal) {
    this.isPlaying = newVal;
  }


  getIsShutdown() {
    return this.isShutdown;
  }
  setIsShutdown(newVal) {
    this.isShutdown = newVal;
  }


  getPlaybackSpeed() {
    return this.playbackSpeed;
  }
  setPlaybackSpeed(newPlaybackSpeed) {
    this.playbackSpeed = newPlaybackSpeed;
  }


  togglePlayPause() {
    this.isPlaying = !this.isPlaying;

    this.clips.forEach((clip) => {
      const action = this.mixer.clipAction(clip);
      action.paused = !this.isPlaying;
    });
  }


  // reset() {

  // }


  // shutdown() {

  // }


  start() {
    let then = Date.now();

    const loop = () => {
      requestAnimationFrame(loop);

      const now = Date.now();
      const delta = now - then;

      // update();

      if (delta) { // } >= interval) {
        // render();
        this.stats.begin();
        if (this.mixer) this.mixer.update(this.clock.getDelta());
        this.renderer.render(this.scene, this.camera);
        then = Date.now();
        this.stats.end();
      }
    };

    loop();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}


export default Visualizer;


// var mesh;

// // Create an AnimationMixer, and get the list of AnimationClip instances
// var mixer = new THREE.AnimationMixer( mesh );
// var clips = mesh.animations;

// // Update the mixer on each frame
// function update () {
//     mixer.update( deltaSeconds );
// }

// // Play a specific animation
// var clip = THREE.AnimationClip.findByName( clips, 'dance' );
// var action = mixer.clipAction( clip );
// action.play();

// // Play all animations
// clips.forEach( function ( clip ) {
//     mixer.clipAction( clip ).play();
// } );
