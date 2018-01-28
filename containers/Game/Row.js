import React from 'react';
import Cell from './Cell';

export default ({ difficulty, cellWidth, columns, onCellLeftClick, onCellRightClick, }) => (
  <div className='row'>
    <style jsx>{`
      .row {
        display: flex;
      }
    `}</style>
    {columns.map((cell, index) =>
      <div key={`column-${index}`} className='column'>
        <Cell
          onLeftClick={() => onCellLeftClick(index, cell)}
          onRightClick={() => onCellRightClick(index, cell)}
          cell={cell}
          width={cellWidth}
        />
      </div>
    )}
  </div>
);
