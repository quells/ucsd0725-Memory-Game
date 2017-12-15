import React, { Component } from "react";
import MemoryGameTile from "./MemoryGameTile";

const TileImageCount = 20;
const AnimationFrameCount = 10;

var tileImageLocs = new Array(TileImageCount);
for (let i = 0; i < TileImageCount; i++) {
  tileImageLocs[i] = require(`./tile_imgs/${i}.jpg`);
}

function shuffle(arr) {
    // Fisher-Yates (Knuth) Algorithm
    var shuffled = arr.slice(0); // Copy by value
    for (var i = arr.length-1; i > 0; i--) {
        // 1 <= i <= n-1
        var j = Math.floor(Math.random()*(i+1)); // 0 <= j <= i
        // Swap i and j, copying by value
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
}

class SquareCanvas {
  constructor(size) {
    this.canvas = document.createElement("canvas");
    this.canvas.width  = size;
    this.canvas.height = size;
    this.ctx = this.canvas.getContext("2d");
  }
}

function loadImage(fn, cb) {
  var img = new Image();
  img.onload = function() {
    let canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 512;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    let imgData = canvas.toDataURL();
    cb(imgData);
  };
  img.src = fn;
}

function pixellate(imgData, miniSize, finalSize, fade, cb) {
  var scale = finalSize / miniSize;
  var mini = new SquareCanvas(miniSize);
  var fnl = new SquareCanvas(finalSize);
  var img = new Image();
  img.onload = function() {
    mini.ctx.drawImage(img, 0, 0, miniSize, miniSize);
    fnl.ctx.drawImage(mini.canvas, 0, 0, finalSize, finalSize);
    var src = mini.ctx.getImageData(0, 0, miniSize, miniSize);
    var dest = fnl.ctx.getImageData(0, 0, finalSize, finalSize);

    var idx1, idx2, x, y, oy;
    for (let j = 0; j < miniSize; j++) {
      oy = j * miniSize;
      y = j * scale;
      for (let i = 0; i < miniSize; i++) {
        idx1 = (i + oy) * 4;
        x = i * scale;
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            idx2 = (x+dx + (y+dy)*miniSize*scale) * 4;
            dest.data[idx2]   = src.data[idx1] * fade;
            dest.data[idx2+1] = src.data[idx1+1] * fade;
            dest.data[idx2+2] = src.data[idx1+2] * fade;
            dest.data[idx2+3] = 255;
          }
        }
      }
    }
    fnl.ctx.putImageData(dest, 0, 0);
    let pxdData = fnl.canvas.toDataURL("image/jpeg", 0.6);
    cb(pxdData);
  };
  img.src = imgData;
}

class MemoryGame extends Component {
  constructor(props) {
    super(props);

    let imageCount = Math.floor(this.props.difficulty * this.props.difficulty / 2);
    let needsExtraImage = this.props.difficulty % 2 === 1;
    let extraImageCount = needsExtraImage ? 1 : 0;

    let imgGrid = [];
    let offset = Math.floor(Math.random() * TileImageCount);
    for (let i = 0; i < imageCount; i++) {
      imgGrid.push((i + offset) % TileImageCount);
      imgGrid.push((i + offset) % TileImageCount);
    }
    if (needsExtraImage) imgGrid.push((imageCount + offset) % TileImageCount);
    imgGrid = shuffle(imgGrid);

    let hiddenGrid = new Array(2*imageCount + extraImageCount).fill(true);
    let solvedGrid = new Array(2*imageCount + extraImageCount).fill(false);

    this.state = {
      imgGrid: imgGrid,
      imgs: null,
      imgsPixellated: false,
      readyToPlay: false,
      hiddenGrid: hiddenGrid,
      solvedGrid: solvedGrid
    };

    this.handleBegin = this.handleBegin.bind(this);

    // Generate pixellated images
    var numImagesProcessed = 0;
    var processedImages = new Array(TileImageCount);
    var processingLoops = new Array(TileImageCount);
    for (let i = 0; i < TileImageCount; i++) {
      let frames = new Array(AnimationFrameCount);
      let frameCount = 0;
      loadImage(tileImageLocs[i], imgData => {
        for (let j = 0; j < AnimationFrameCount; j++) {
          pixellate(imgData, 512 >> j, 512, 1 - 0.1*j, pxd => {
            frames[j] = pxd;
            frameCount++;
          });
        }
      });
      processingLoops[i] = setInterval(() => {
        if (frameCount >= frames.length) {
          clearInterval(processingLoops[i]);
          processedImages[i] = frames;
          numImagesProcessed++;
        }
      }, 10);
    }

    var waitForImageProcessing = setInterval(() => {
      if (numImagesProcessed >= TileImageCount) {
        clearInterval(waitForImageProcessing);
        this.setState({imgs: processedImages, imgsPixellated: true});
      }
    }, 10);
  }

  handleBegin() {
    this.setState({ready: true});
  }

  render() {
    if (this.state.imgsPixellated) {
      let diff = this.props.difficulty;
      let tiles = this.state.imgGrid
        .map((img, i) => {
          let tileId = "tile-" + i;
          return (<MemoryGameTile key={tileId} imgs={this.state.imgs} imgIndex={img} hidden={this.state.hiddenGrid} solved={this.state.solvedGrid} ready={this.state.ready} />)
        });
      let rows = new Array(diff).fill(0)
        .map((_, i) => {
          return (
            <div className="row justify-content-center" key={"row" + i}>
              {tiles.slice(i*diff, (i+1)*diff)}
            </div>
          )
        });
      if (this.state.ready) {
        return (
          <div>
            {rows}
          </div>
        );
      } else {
        return (
          <div>
            {rows}
            <div className="text-center">
              <button className="btn btn-primary" onClick={this.handleBegin}>Begin</button>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div>
          <h2 className="text-center mt-3">Loading&hellip;</h2>
        </div>
      );
    }
  }
}

export default MemoryGame;
