import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app-root">
        <header className="primary">
          <div className="container text-center mt-3">
            <h1>Memory Game</h1>
          </div>
        </header>
        <main>
          Remember this!
        </main>
        <footer>
          Memory Game
        </footer>
      </div>
    );
  }
}

export default App;
