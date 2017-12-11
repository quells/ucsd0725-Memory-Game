import React, { Component } from "react";
import MemoryGameTile from "./MemoryGameTile";

function Shuffle(arr) {
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

const TileImageCount = 20;

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
    imgGrid = Shuffle(imgGrid);

    this.state = {
      imgGrid: imgGrid,
      imgs: new Array(imageCount + extraImageCount)
    };
  }

  render() {
    let diff = this.props.difficulty;
    let tiles = this.state.imgGrid
      .map((img, i) => {
        let tileId = "tile-" + i;
        return <MemoryGameTile key={tileId} imgIndex={img} />
      });
    let rows = new Array(diff).fill(0)
      .map((_, i) => {
        return (
          <div className="row justify-content-center" key={"row" + i}>
            {tiles.slice(i*diff, (i+1)*diff)}
          </div>
        )
      })
    return (
      <div>
        {rows}
      </div>
    );
  }
}

export default MemoryGame;
