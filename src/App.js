import React, { Component } from 'react';
import MemoryGame from "./MemoryGame";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      difficulty: 3
    };
  }

  render() {
    return (
      <div className="app-root">
        <header>
          <div className="container text-center mt-2 pt-2 pb-2">
            <h1>Memory Game</h1>
          </div>
        </header>
        <main className="container">
          <MemoryGame difficulty={this.state.difficulty} />
        </main>
        <footer>
          <div className="container text-center">
            &copy; 2017 Kai Wells
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
