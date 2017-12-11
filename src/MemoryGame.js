import React, { Component } from "react";
import MemoryGameTile from "./MemoryGameTile";

class MemoryGame extends Component {
  constructor(props) {
    super(props);

    let imageCount = Math.floor(this.props.difficulty * this.props.difficulty / 2);
    let needsExtraImage = this.props.difficulty % 2 === 1;
    let extraImageCount = needsExtraImage ? 1 : 0;

    let imgGrid = [];
    for (let i = 0; i < imageCount; i++) {
      imgGrid.push(i);
      imgGrid.push(i);
    }
    if (needsExtraImage) imgGrid.push(imageCount);
    // TODO: shuffle images

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
