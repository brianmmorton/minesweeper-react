import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  CELL_BORDER_WIDTH,
  MINE,
  CELL,
} from './constants';

export default class Cell extends Component {

  static propTypes = {
    width: PropTypes.number.isRequired,
    cell: PropTypes.shape({
      location: PropTypes.number,
      mineCount: PropTypes.number.isRequired,
      type: PropTypes.oneOf([MINE, CELL]).isRequired,
      isOpen: PropTypes.bool.isRequired,
    }),
    onLeftClick: PropTypes.func.isRequired,
    onRightClick: PropTypes.func.isRequired,
  }

  _handleClick = (e) => {
    if (this.props.cell.isOpen) {
      return;
    }

    if (e.type === 'click') {
      this.props.onLeftClick(e);
    }
    else if (e.type === 'contextmenu') {
      e.preventDefault();
      this.props.onRightClick(e);
    }
  }

  render () {
    const { width, } = this.props;
    const { mineCount, type, isOpen, isFlagged } = this.props.cell;

    return (
      <div
        onClick={this._handleClick}
        onContextMenu={this._handleClick}
        className={`cell ${isOpen && 'cell-open'}`}>
        <style jsx>{`
          .cell {
            width: ${width}px;
            height: ${width}px;
            background: #FAFAFA;
            border: ${CELL_BORDER_WIDTH}px outset #EAEAEA;
            text-align: center;
          }

          .cell-open {
            border-style: solid;
          }

          .cell:hover {
            background: #E0E0E0;
          }
        `}</style>

        {(() => {
          if (isFlagged) {
            return <img src='/static/flag.png' width={width - 2} />
          }

          if (!isOpen) {
            return null;
          }

          if (type === MINE) {
            return <img src='/static/bomb.png' width={width - 2} />
          }

          if (mineCount === 0) {
            return null;
          }
          if (mineCount === 1) {
            return <span style={{ color: 'blue' }}>{mineCount}</span>
          }
          else if (mineCount === 2) {
            return <span style={{ color: 'green' }}>{mineCount}</span>
          }
          else if (mineCount === 3) {
            return <span style={{ color: 'red' }}>{mineCount}</span>
          }
          else if (mineCount === 4) {
            return <span style={{ color: 'burghandy' }}>{mineCount}</span>
          }

          return <span style={{ color: 'black' }}>{mineCount}</span>
        })()}
      </div>
    )
  }
}
