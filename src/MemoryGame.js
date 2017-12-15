import React, { Component } from "react";
import MemoryGameTile from "./MemoryGameTile";

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

const TileImageCount = 20;

class MemoryGame extends Component {
  constructor(props) {
    super(props);

    let indexGrid = [];
    let hiddenGrid = [];
    let solvedGrid = [];

    this.state = {
      difficulty: this.props.difficulty,
      toSolveCount: 100,
      imgs: null,
      indexGrid: indexGrid,
      imgsLoaded: true,
      readyToPlay: false,
      hiddenGrid: hiddenGrid,
      solvedGrid: solvedGrid
    };

    this.handleBegin = this.handleBegin.bind(this);
    this.handleTileClick = this.handleTileClick.bind(this);
  }

  componentWillMount() {
    this.resetState(this.props.difficulty);
  }

  resetState(newDifficulty) {
    let imageCount = Math.floor(newDifficulty * newDifficulty / 2);
    let needsExtraImage = newDifficulty % 2 === 1;
    let extraImageCount = needsExtraImage ? 1 : 0;

    let indexGrid = [];
    let offset = Math.floor(Math.random() * TileImageCount);
    for (let i = 0; i < imageCount; i++) {
      indexGrid.push((i + offset) % TileImageCount);
      indexGrid.push((i + offset) % TileImageCount);
    }
    if (needsExtraImage) indexGrid.push((imageCount + offset) % TileImageCount);
    indexGrid = shuffle(indexGrid);

    let hiddenGrid = new Array(2*imageCount + extraImageCount).fill(true);
    let solvedGrid = new Array(2*imageCount + extraImageCount).fill(false);

    this.setState({
      readyToPlay: false,
      difficulty: newDifficulty,
      toSolveCount: 2*imageCount,
      indexGrid: indexGrid,
      hiddenGrid: hiddenGrid,
      solvedGrid: solvedGrid,
      imgsLoaded: true
    });
  }

  handleBegin() {
    this.setState({ready: true});
  }

  handleTileClick(i) {
    if (!this.state.ready) return;
    let showCount = this.state.hiddenGrid.reduce((acc, x) => {
      if (x) return acc;
      return acc + 1;
    }, 0);
    let hg = this.state.hiddenGrid;
    let ig = this.state.indexGrid;
    let sg = this.state.solvedGrid;
    switch (showCount) {
      case 0:
        hg[i] = false;
        this.setState({hiddenGrid: hg});
        break;
      case 1:
        hg[i] = false;
        let allShown = hg.map((v, i) => {
          return v ? null : ig[i]
        })
        let shown = allShown.reduce((acc, s) => {
          if (s === null) return acc;
          acc.push(s);
          return acc;
        }, []);
        if (shown[0] === shown[1]) {
          allShown.forEach((v, i) => {
            if (v === shown[0]) sg[i] = true;
          });
          hg = hg.fill(true);
          let solvedCount = sg.reduce((acc, s) => {
            if (s) return acc + 1;
            return acc;
          }, 0);
          if (solvedCount === this.state.toSolveCount) {
            this.resetState(this.state.difficulty+1);
          }
          // TODO: calc if solvedCount === imageCount for current difficulty
        }
        this.setState({hiddenGrid: hg, solvedGrid: sg});
        break;
      default:
        this.setState({hiddenGrid: hg.fill(true)});
    }
  }

  render() {
    if (this.state.imgsLoaded) {
      let diff = this.state.difficulty;
      let tiles = this.state.indexGrid
        .map((imgIndex, positionIndex) => {
          let tileId = "tile-" + positionIndex;
          return (
            <MemoryGameTile
              key={tileId}
              imgIndex={imgIndex} positionIndex={positionIndex}
              imgs={this.state.imgs}
              hidden={this.state.hiddenGrid}
              solved={this.state.solvedGrid}
              ready={this.state.ready}
              clickHandler={this.handleTileClick}
            />
          )
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
