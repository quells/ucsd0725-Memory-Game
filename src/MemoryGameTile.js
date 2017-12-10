import React, { Component } from 'react';

function getColClass(difficulty) {
  switch (difficulty) {
    case 1:
      return " col-12";
    case 2:
      return " col-6";
    case 3:
      return " col-4";
    case 4:
      return " col-3";
    case 5:
      return " col-2";
    case 6:
      return " col-2";
    default:
      return "";
  }
}

class MemoryGameTile extends Component {
  render() {
    return (
      <div className={"tile col" + getColClass(this.props.difficulty)}>
        {this.props.imgIndex}
      </div>
    );
  }
}

export default MemoryGameTile;
