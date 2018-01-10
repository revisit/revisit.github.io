<template>
  <div id="app" @paste="onPaste"
    @drag.prevent.stop
    @dragstart.prevent.stop
    @dragend.prevent.stop
    @dragexit.prevent.stop
    @dragover.prevent.stop
    @dragenter.prevent.stop="handleDragOver(true)"
    @dragleave.prevent.stop="handleDragOver(false)"
    @drop.prevent.stop
    >

    <div class="grid-maximize z0" :class="{ 'hide-no-animation': !animationAvailable }">
      <!-- <canvas style="width:100%;height:100%;" ref="canvas"></canvas> -->
      <div id="canvas-container" ref="canvas-container"></div>
    </div>

    <div ref="settings" class="off-canvas" :class="{ 'slide-canvas': displaySettings }">

      <div class="settings z2">

        <h5>Global Settings</h5>

        <div class="settings-item">
          <div class="settings-button-group">
            <input class="settings-button" type="button" name="reset-camera" id="reset-camera">
            <label for="reset-camera" class="settings-label">Reset Camera</label>
          </div>
        </div>

        <div class="settings-item">
          <div class="toggle-switch-group">
            <input type="checkbox" name="loopToggle" id="loopToggle" v-model="loopPlayback">
            <label for="loopToggle" class="toggle-slider"></label>
            <label for="loopToggle" class="settings-label">Loop Playback</label>
          </div>
        </div>

        <hr>

        <h5>Model Settings</h5>

        <div class="settings-item" style="line-height: 1rem;">
          <treeselect
            v-if="optionsReady"
            placeholder="Select Object(s)..."
            v-model="selections"
            :multiple="true"
            :options="objectNames">
          </treeselect>
        </div>

        <div class="settings-item">
          <div class="settings-item-label"><label for="colorWell">Color</label></div>
          <div class="settings-item-content">
            <!-- <div style="overflow: hidden;"> -->
            <colorpicker :color="currentColor" v-on:change="changeColor"></colorpicker>
            <!-- </div> -->
          </div>
        </div>

        <!-- list of built-in textures -->

        <div class="settings-item">
          <div class="toggle-switch-group">
            <input type="checkbox" name="followToggle" id="followToggle">
            <label for="followToggle" class="toggle-slider"></label>
            <label for="followToggle" class="settings-label">Follow Model</label>
          </div>
        </div>

        <div class="settings-item">
          <div class="toggle-switch-group">
            <input type="checkbox" name="visibility" id="visibility">
            <label for="visibility" class="toggle-slider"></label>
            <label for="visibility" class="settings-label">Show Model</label>
          </div>
        </div>

      </div>
    </div>

    <div class="grid-maximize ui-grid">

      <dropzone
        ref="dropzone"
        v-on:data="dataReady"
        v-show="displayDropzone"
        class="ui-dropzone z3">
      </dropzone>

      <div class="ui-top-left z1" :disabled="!animationAvailable">
        <div class="ui-button" @click="toggleSettings">
          <i v-if="displaySettings" class="material-icons">close</i>
          <i v-else="displaySettings" class="material-icons">menu</i>
        </div>
      </div>

      <div class="ui-top-right z1" :disabled="!animationAvailable">
        <div class="ui-button" @click="closeVisualization">
          <i class="material-icons">close</i>
        </div>
      </div>

      <div class="ui-bottom z1" :disabled="!animationAvailable">
        <div class="player">

          <div class="ui-button" @click="togglePlayPause()">
            <i v-if="isPlaying" class="material-icons">pause</i>
            <i v-else="isPlaying" class="material-icons">play_arrow</i>
          </div>

          <div class="ui-button" @click="time = 0"><i class="material-icons">replay</i></div>

          <div class="player-text">{{time | formatTime}}</div>

          <div class="flex-auto">
            <input type="range" min="0" max="10" step="0.01"
              v-model.number="time"
              @mousedown="slidingTime = true"
              @mouseup="slidingTime = false">
          </div>

          <div class="player-text">{{timeEnd | formatTime}}</div>

          <div class="flex-20">
            <input type="range" min="-5" max="5" step="0.5" v-model.number="speed">
          </div>

          <div class="player-text" @click="speed = 1">{{speed | formatSpeed}}</div>

        </div>
      </div>

    </div>

  </div>
</template>


<!-- ********************************************************************** -->

<!-- ********************************************************************** -->

<!-- ********************************************************************** -->

<!-- ********************************************************************** -->


<script>

/* eslint no-unused-expressions: ["error", { "allowShortCircuit": true, "allowTernary": true }] */

import Treeselect from '@riophae/vue-treeselect';
import ColorPicker from './components/ColorPicker';
import Dropzone from './components/Dropzone';
import Visualizer from './assets/js/visualizer';


export default {
  name: 'app',
  data() {
    return {
      // Playback parameters
      time: 0,
      timeEnd: 0,
      isPlaying: false,
      slidingTime: false,
      animation: null,

      // Configuration settings
      speed: 1,
      loopPlayback: true,
      autoPlay: false,
      currentColor: '#18453B',
      animationAvailable: false,

      // Display settings
      displaySettings: false,
      displayDropzone: true,

      // Select input settings
      selections: [],
      objectNames: [],
      optionsReady: true,
    };
  },
  methods: {
    togglePlayPause() {
      this.isPlaying = !this.isPlaying;
      this.visualizer.togglePlayPause();
    },
    changeColor(color) {
      if (this.animation && this.selections.length > 0) {
        this.selections.forEach((id) => { this.animation[0].objects[id].color = color; });
      }
    },
    handleDragOver(status) {
      this.displayDropzone = status || this.$refs.dropzone.isDragover || !this.animationAvailable;
    },
    dataReady(files) {
      // eslint-disable-next-line
      // console.log('parent', json);

      const jsonData = files[0];

      this.animationAvailable = true;
      // this.animation = json;
      this.displayDropzone = false;
      this.isPlaying = false;
      this.speed = 1;
      this.timeEnd = jsonData.duration;
      this.time = 0;
      this.hideSettings();
      // this.updateObjects();

      this.visualizer.loadAnimation(jsonData);
    },
    updateObjects() {
      this.selections = [];

      this.animation[0].objects.forEach((obj, idx) => {
        this.objectNames.push({ id: idx, label: obj.name });
      });

      // // eslint-disable-next-line
      // for (const [key, value] of Object.entries(this.animation[0].objects)) {
      //   this.objectNames.push({ id: key, label: key });
      // }

      // eslint-disable-next-line
      // console.log(this.objectNames);

      this.optionsReady = false;
      this.$nextTick(() => { this.optionsReady = true; });
    },
    closeVisualization() {
      this.animationAvailable = false;
      this.isPlaying = false;
      this.timeEnd = 0.0;
      this.time = 0;
      this.displaySettings = false;
      this.displayDropzone = true;
    },
    onPaste() {
      // eslint-disable-next-line
      // console.log(Treeselect);

      this.selections = [];
      this.objectNames.push({ id: 'new', label: 'New' });
      this.optionsReady = false;
      this.$nextTick(() => { this.optionsReady = true; });
    },
    showSettings() {
      this.$nextTick(() => {
        document.addEventListener('click', this.documentClick);
      });
      this.displaySettings = true;
    },
    hideSettings() {
      document.removeEventListener('click', this.documentClick);
      this.displaySettings = false;
    },
    toggleSettings() {
      this.displaySettings ? this.hideSettings() : this.showSettings();
    },
    documentClick(e) {
      const el = this.$refs.settings;
      const target = e.target;
      if (el !== target && !el.contains(target)) {
        this.hideSettings();
      }
    },
  },
  filters: {
    formatTime(t) {
      return t.toFixed(2);
    },
    formatSpeed(s) {
      return `x ${s.toFixed(1)}`;
    },
  },
  mounted() {
    this.visualizer = new Visualizer(10, 'canvas-container');
    this.visualizer.start();

    // // Determine the width and height of the renderer wrapper element.
    // const canvas = this.$refs.canvas;
    // const ctx = canvas.getContext('2d');
    // let previousTime = null;
    // const self = this;

    // function draw() {
    //   canvas.width = window.innerWidth;
    //   canvas.height = window.innerHeight;

    //   // eslint-disable-next-line
    //   // console.log('animation', self.animation);

    //   // if (self.selectedObject) {
    //   //   self.scene[self.selectedObject].color = self.colors.hex;
    //   //   self.scene[self.selectedObject].opacity = self.colors.a;
    //   // }

    //   const frame = self.time / self.animation[0].timeStep;
    //   const index = Math.floor(frame);
    //   const alpha = frame - index;
    //   const invAlpha = 1 - alpha;

    //   const i2 = (index + 1 >= self.animation[0].frames.length) ? index : index + 1;
    //   const frame1 = self.animation[0].frames[index];
    //   const frame2 = self.animation[0].frames[i2];

    //   // eslint-disable-next-line
    //   self.animation[0].objects.forEach((obj) => {
    //     const w = obj.scale[0];
    //     const h = obj.scale[1];
    //     const x = (frame1[obj.name][0] * invAlpha) + (frame2[obj.name][0] * alpha);
    //     const y = (frame1[obj.name][1] * invAlpha) + (frame2[obj.name][1] * alpha);

    //     ctx.fillStyle = obj.color;
    //     ctx.fillRect(x, y, w, h);
    //   });
    // }

    // function update(timestamp) {
    //   if (!previousTime) previousTime = timestamp;
    //   const deltaTime = timestamp - previousTime;
    //   previousTime = timestamp;

    //   if (!self.slidingTime && self.isPlaying) {
    //     self.time += (deltaTime / 1000) * self.speed;

    //     if (!self.loopPlayback && (self.time < 0 || self.time > self.timeEnd)) {
    //       self.isPlaying = false;
    //       self.time = Math.max(0, Math.min(self.time, self.timeEnd));
    //     } else if (self.time > self.timeEnd) {
    //       self.time = 0;
    //     } else if (self.time < 0) {
    //       self.time = self.timeEnd;
    //     }
    //   }

    //   if (self.animationAvailable) draw();
    //   window.requestAnimationFrame(update);
    // }

    // // draw();
    // window.requestAnimationFrame(update);
  },
  components: {
    colorpicker: ColorPicker,
    treeselect: Treeselect,
    dropzone: Dropzone,
  },
};
</script>


<!-- ********************************************************************** -->

<!-- ********************************************************************** -->

<!-- ********************************************************************** -->

<!-- ********************************************************************** -->


<style>

@import 'normalize.css';
@import '@riophae/vue-treeselect/dist/vue-treeselect.min.css';

$settingsWidth: 260px;
$borderRadius: 4px;
$cornerSize: 50px;

#app {
  font-family: 'Roboto';
  width: 100vw;
  height: 100vh;

  line-height: 0;

  display: grid;
  grid-gap: 0;
  grid-template-rows: repeat(12, 1fr);
  grid-template-columns: repeat(12, 1fr);

  overflow: hidden;
}


.show-dropzone {
  z-index: 5;
}

.off-canvas {
  display: flex;
  align-items: stretch;

  position: absolute;
  width: $settingsWidth;
  left: -$settingsWidth;
  top: calc($cornerSize + 10px);
  bottom: calc($cornerSize + 10px);

  border-radius: $borderRadius;
  background: rgba(#ddd, 0.25);

  transition: 0.1s;

  &.slide-canvas {
    transform: translate3d($settingsWidth, 0, 0);
  }

  & .settings {

    overflow-x: hidden;
    overflow-y: auto;
    max-height: calc(100vh - ($cornerSize + 10px) * 2 - 20px);

    display: flex;
    flex-flow: row wrap;
    /*align-items: center;*/
    /*justify-content: space-between;*/
    align-content: start;

    margin: 1rem;
    font-size: 14px;

    & input[type=text] {
      width: 100%;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }

    & hr {
      display: block;
      width: 100%;
      height: 1px;
      border: 0;
      border-top: medium solid gray;
      margin-bottom: 0.5rem;
    }

    & .settings-item {
      flex: 0 0 100%;
      display: flex;
      align-items: center;

      margin-bottom: 0.5rem;

      height: 30px;

      border-radius: $borderRadius;
      background-color: #fff;
      opacity: 0.90;

      & .settings-label {
        cursor: pointer;
      }

      & .settings-item-label {
        flex: 0 0 40%;

        & label {
          margin-left: 5px;
        }
      }

      & .settings-item-content {
        flex: 0 0 60%;

      }

      &:hover {
        opacity: 1;
      }
    }
  }
}

.grid-maximize {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}

.z0 { z-index: 0; }
.z1 { z-index: 1; }
.z2 { z-index: 2; }
.z3 { z-index: 3; }

.hide-no-animation {
  display: none;
}

.ui-grid {
  display: grid;
  grid-template-rows: [top-start] $cornerSize [top-end] auto [bottom-start] $cornerSize [bottom-end];
  grid-template-columns: [left-start] $cornerSize [left-end] auto [right-start] $cornerSize [right-end];

  & .ui-top-left {
    grid-row: top;
    grid-column: left;
  }

  & .ui-top-right {
    grid-row: top;
    grid-column: right;
  }

  & .ui-dropzone {
    /*align-self: stretch;*/
    /*text-align: center;*/

    /*display: flex;*/
    /*align-items: stretch;*/

    /*background: rgba(100, 100, 255, 0.1);*/
    /*border: medium dotted green;*/
    /*border-radius: $borderRadius;*/

    /*margin: 1rem;*/

    grid-row: top-end / bottom-start;
    grid-column: 1 / -1;

    /*& div {
      max-width: 200px;
      line-height: 1.2rem;
      font-size: 1.2rem;
      margin: auto;
      color: gray
    }*/

    /*&.hide-dropzone {
      opacity: 0;
      z-index: -1;
      &.use-dropzone {
        z-index: 2;
      }
    }*/
  }

  & .ui-bottom {
    grid-row: bottom;
    grid-column: 1 / -1;
  }
}

.player {
  opacity: 0.4;
  background: white;
  border-radius: $borderRadius;
  transition: opacity 0.25s ease-in-out;

  line-height: 0;
  margin: 0 auto;

  display: flex;
  align-items: center;

  width: 100%;
  max-width: 600px;

  &:hover {
    opacity: 1.0;
  }

  & input {
    width: 100%;
  }

  & .flex-auto {
    flex: 1 1 auto;
  }

  & .flex-20 {
    flex: 1 1 20%;
  }
}

.player-text {
  width: $cornerSize;
  text-align: right;
  margin-right: 10px;

  font-size: responsive 0.7rem 1rem;
  font-range: 320px 600px;
}

.ui-button {
  cursor: pointer;

  padding: 0;
  margin: 0;
  width: $cornerSize;
  height: $cornerSize;
  text-align: center;
  border-radius: $borderRadius;

  &:hover {
    background: rgb(50, 50, 50, 0.1);
  }

  &:active {
    background: rgb(50, 50, 50, 0.2);
  }

  & i {
    font-size: responsive 24px 36px;
    font-range: 320px 600px;
    margin-top: calc($cornerSize/2 - (24px + 12 * ( (100vw - 320px) / 280))/2);
  }
}

@media screen and (min-width: 600px) {
  .ui-button i {
    margin-top: calc($cornerSize/2 - 36px/2);
  }
}

[disabled] {
  pointer-events: none;
  opacity: 0.25;
}

input[type=range]::-moz-focus-outer {
  border: 0;
}

.toggle-switch-group {
  display: flex;
  align-items: center;

  /*cursor: pointer;*/

  & .toggle-slider {
    cursor: pointer;

    position: relative;
    margin-right: 10px;
    width: 40px;
    height: 20px;
    background: #ddd;
    transition: 0.4s;
    border-radius: 15px;
  }

  & .toggle-slider::before {
    position: absolute;
    content: "";
    width: 16px;
    height: 16px;
    left: 4px;
    top: 2px;
    background: white;
    transition: 0.4s;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  }

  & input {
    display: none;
  }

  & input:checked + .toggle-slider {
    background: #039be5;
  }

  & input:checked + .toggle-slider:before {
    transform: translate(16px);
  }
}

.settings-button-group {
  display: flex;
  align-items: center;

  & .settings-button {
    cursor: pointer;
    border: 0;
    box-shadow: none;

    background-color: #039be5;
    width: 40px;
    height: 20px;
    border-radius: 15px;
    margin-right: 10px;

    &:hover {
      background-color: #006596;
    }

    &:active {
      background-color: #00a6f8;
    }
  }
}


</style>

<!--
        <md-icon>play_arrow</md-icon>
        <md-icon>settings</md-icon>
        <md-icon>code</md-icon>
        <md-icon>fast_forward</md-icon>
        <md-icon>fast_rewind</md-icon>
        <md-icon>forward_10</md-icon>
        <md-icon>forward_30</md-icon>
        <md-icon>forward_5</md-icon>
        <md-icon>pause</md-icon>
        <md-icon>replay_10</md-icon>
        <md-icon>replay_30</md-icon>
        <md-icon>replay_5</md-icon>
        <md-icon>replay</md-icon>
        clear
        close
        add
        undo
        redo
        record
        menu
        fullscreen
 -->
