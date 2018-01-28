import React, { Component } from 'react';
import { generateData, getCellsToOpen, getKey, Timer } from './helpers';
import { CELL_WIDTH, CELL_BORDER_WIDTH, MINE, difficulties } from './constants';
import Row from './Row';
import Time from './Time';
import DifficultySelect from './DifficultySelect';

export default class Game extends Component {

  constructor (props) {
    super(props);

    this.timer = new Timer();

    this.state = {
      cellWidth: CELL_WIDTH,
      difficulty: difficulties[0],
      data: generateData(difficulties[0]),
      gameOver: false,
    }
  }

  _handleChangeDifficulty = (e) => {
    const difficulty = difficulties.filter(d => d.value === e.target.value).pop();
    this.setState({
      difficulty,
      data: generateData(difficulty),
    });
    this.timer.stop();
    this.timer = new Timer();
  }

  _resetGame = () => {
    this.setState({
      data: generateData(this.state.difficulty),
      gameOver: false,
    });
    this.timer.stop();
    this.timer = new Timer();
  }

  _updateCells (cb, data) {
    return this.state.data.map((columns, ri) => {
      return columns.map((cell, ci) => {
        if (cb(cell)) {
          return typeof data === 'function'
            ? { ...cell, ...data(cell) }
            : { ...cell, ...data, }
        }
        return cell;
      })
    })
  }

  _getColumns = () => this.state.data.reduce((p, c) => p.concat(c), [])

  _handleCellLeftClick = (_ri, _ci) => {
    if (this.state.gameOver) {
      return;
    }

    const columns = this._getColumns();

    if (columns.filter(d => d.isOpen).length === 0) {
      this.timer.start();
    }

    const cell = this.state.data[_ri][_ci];

    if (cell.isFlagged) {
      return;
    }

    if (cell.type === MINE) {
      this.timer.stop();
      this.setState({
        gameOver: true,
        data: this._updateCells(c => c.type === MINE, { isOpen: true, isFlagged: false, }),
      });

      return;
    }

    /*
      If you have flagged all of the mines, you win
    */
    if (columns.filter(d => !d.isOpen).length === this.state.difficulty.mines) {
      this.timer.stop();
      this.setState({
        gameOver: true,
      });
      return;
    }

    /*
      Recursively go through cells to find ones to open.
      If it is flagged, leave it as flagged and closed
    */
    const rowsToOpen = getCellsToOpen(this.state.data, _ri, _ci).map(([ri, ci]) => getKey(ri, ci));
    this.setState({
      data: this._updateCells(c => rowsToOpen.includes(c.key), c => ({ isOpen: !c.isFlagged, }))
    });
  }

  _handleCellRightClick = (_ri, _ci) => {
    this.setState({
      data: this._updateCells(c => c.ri === _ri && c.ci === _ci, c => ({ isFlagged: !c.isFlagged }))
    });
  }

  _zoomIn = () => {
    if (this.state.cellWidth > CELL_WIDTH * 2) return;
    this.setState({
      cellWidth: this.state.cellWidth + 5,
    });
  }

  _zoomOut = () => {
    if (this.state.cellWidth < CELL_WIDTH) return;
    this.setState({
      cellWidth: this.state.cellWidth - 5,
    });
  }

  render () {
    const { cellWidth, difficulty, data } = this.state;
    const columns = this.state.data.reduce((p, c) => p.concat(c), []);

    /*
      Width equal to the number of columns in grid, times the width of each cell.
      Make sure to add in the borders because that would make the width x pixels wider
    */
    const width = difficulty.width * cellWidth + difficulty.width * (CELL_BORDER_WIDTH * 2);

    return (
      <div className='game-container'>

        <style jsx>{`
          .game-container {
            margin: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          }
          .minesweeper {
            border: 1px solid #EAEAEA;
            width: ${width}px;
            margin-top: 15px;
          }
          .flex {
            display: flex;
          }
          .controls {
            width: ${width}px;
            justify-content: space-between;
            align-items: center;
          }
          .zoom-controls {
            justify-content: center;
            margin-top: 14px;
          }
        `}</style>

        <div className='flex controls'>
          <div className='flex'>
            <DifficultySelect value={difficulty.value} onChange={this._handleChangeDifficulty} />
            <div className='flex zoom'>
              <button onClick={this._zoomOut}>-</button>
              <button onClick={this._zoomIn}>+</button>
            </div>
          </div>
          <button onClick={this._resetGame}>Reset</button>
        </div>

        <div className='minesweeper'>
          {data.map((columns, ri) =>
            <Row
              key={`row-${ri}`}
              columns={columns}
              difficulty={difficulty}
              cellWidth={cellWidth}
              onCellLeftClick={(ci, cell) => this._handleCellLeftClick(ri, ci)}
              onCellRightClick={(ci, cell) => this._handleCellRightClick(ri, ci)}
            />
          )}
        </div>

        {/*
          To avoid rerending the whole game,
          store time in separate component, linked by a listener for updates from the Timer class
        */}
        <Time timer={this.timer} />
        {difficulty.mines - this._getColumns().filter(d => d.isFlagged).length} mines

        {this.state.gameOver && <h1>Game Over!</h1>}
      </div>
    )
  }
}
