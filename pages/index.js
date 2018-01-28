import React, { Component } from 'react';
import Game from '../containers/Game';

export default class App extends Component {
  render () {
    return (
      <div className='app'>
        <style jsx>{`
          .app {
            background: '#FFF';
            height: 100vh;
            width: 100%;
          }
          .center {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
        <div className='center'>
          <div style={{ width: '100%' }}>
            <h2 style={{ textAlign: 'center' }}>Mine Sweeper</h2>
            <Game />
          </div>
        </div>
      </div>
    )
  }
}
