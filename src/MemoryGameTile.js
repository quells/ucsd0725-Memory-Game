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

// const FrameTime = 50;

class MemoryGameTile extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   fadeIndex: 0,
    //   fadeDir: 1,
    //   fadeLock: false
    // };

    this.handleClick = this.handleClick.bind(this);
    this.handleFadeLoop = this.handleFadeLoop.bind(this);
  }

  handleClick() {
    if (!this.props.ready) return;
    if (this.state.fadeLock) return;
    this.setState({fadeLock: true});
    this.handleFadeLoop()
  }

  handleFadeLoop() {

  }

  render() {
    let isHidden = this.props.hidden[this.props.positionIndex];
    let isSolved = this.props.solved[this.props.positionIndex];
    let text = this.props.imgIndex;
    if (this.props.ready && !isSolved && isHidden) text = "?";
    return (
      <div className="tile col">
        <button className="alert alert-warning" onClick={e => this.props.clickHandler(this.props.positionIndex)}>{text}</button>
      </div>
    );
  }
}

export default MemoryGameTile;
