import React, { Component } from 'react';

// function getColClass(difficulty) {
//   switch (difficulty) {
//     case 1:
//       return " col-12";
//     case 2:
//       return " col-6";
//     case 3:
//       return " col-4";
//     case 4:
//       return " col-3";
//     case 5:
//       return " col-2";
//     case 6:
//       return " col-2";
//     default:
//       return "";
//   }
// }

class MemoryGameTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeIndex: 0,
      fadeDir: 1,
      fadeLock: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleFadeLoop = this.handleFadeLoop.bind(this);
  }

  handleClick() {
    if (this.state.fadeLock) return;
    this.setState({fadeLock: true});
    this.handleFadeLoop()
  }

  handleFadeLoop() {
    if (this.state.fadeDir === 1 && this.state.fadeIndex < 10) {
      setTimeout(() => {
        this.setState({fadeIndex: this.state.fadeIndex+1});
        if (this.state.fadeIndex+1 < 10) {
          this.handleFadeLoop();
        } else {
          this.setState({fadeDir: -1, fadeLock: false});
        }
      }, 83);
      return;
    }
    if (this.state.fadeDir === -1 && this.state.fadeIndex > 0) {
      setTimeout(() => {
        this.setState({fadeIndex: this.state.fadeIndex-1});
        if (this.state.fadeIndex-1 > 0) {
          this.handleFadeLoop();
        } else {
          this.setState({fadeDir: 1, fadeLock: false});
        }
      }, 83);
      return;
    }
  }

  render() {
    return (
      <div className="tile col">
        <img src={this.props.imgs[this.props.imgIndex][this.state.fadeIndex]} onClick={this.handleClick} alt="Memory Tile" />
      </div>
    );
  }
}

export default MemoryGameTile;
