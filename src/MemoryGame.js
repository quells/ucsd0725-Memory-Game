import React, { Component } from "react";
import MemoryGameTile from "./MemoryGameTile";
import axios from "axios";

const loremPixelURL = "https://cors-anywhere.herokuapp.com/lorempixel.com/400/400/";

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

    let getImages = [];
    // for (let i = 0; i < imageCount + extraImageCount; i++) {
    //   getImages.push(axios.get(loremPixelURL));
    // }
    // var self = this;
    // axios.all(getImages)
    //   .then(axios.spread(function() {
    //     let imgs = [];
    //     for (let i = 0; i < arguments.length; i++) {
    //       let imgResponse = arguments[i];
    //       if (imgResponse.status !== 200) {
    //         console.log("Response not OK");
    //         console.log(imgResponse);
    //         return;
    //       }
    //       imgs.push(imgResponse.data);
    //     }
    //     self.setState({imgs: imgs});
    //   }))
    // TODO: display images
  }

  render() {
    let tiles = this.state.imgGrid
      .map((idx, i) => [idx, i])
      .map(arr => <MemoryGameTile key={"tile-" + arr[1]} difficulty={this.props.difficulty} imgIndex={arr[0]}/>);
    return (
      <div className="row">
        {tiles}
      </div>
    );
  }
}

export default MemoryGame;
