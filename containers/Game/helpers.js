import { MINE, CELL } from './constants';

export class Timer {
  constructor () {
    this.time = 0;
    this.updateFunctions = {};
    this.id = Math.random() + '';
  }

  start () {
    clearTimeout(this.TIMEOUT);
    this.TIMEOUT = setTimeout(() => {
      this.time += 1;
      this.start();
      this.updateFunctions['update'] && this.updateFunctions['update'](this.time);
    }, 1000);
  }

  stop () {
    clearTimeout(this.TIMEOUT);
  }

  on (key, cb) {
    this.updateFunctions[key] = cb;
  }
}

export function generateRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getAdjacentCells (rows, ri, ci) {
  const currentRow = rows[ri];
  const lastRow = rows[ri - 1] || [];
  const nextRow = rows[ri + 1] || [];

  return [
    currentRow[ci - 1],
    currentRow[ci + 1],
    lastRow[ci],
    lastRow[ci - 1],
    lastRow[ci + 1],
    nextRow[ci],
    nextRow[ci - 1],
    nextRow[ci + 1],
  ];
}

export const getKey = (ri, ci) => `row:${ri}-cell:${ci}`;

export function getCellsToOpen (_data, _ri, _ci) {
  let cellsToOpen = [[_ri, _ci]];

  if (_data[_ri][_ci].mineCount !== 0) {
    return cellsToOpen;
  }

  const data = [..._data];
  const adjacentCells = getAdjacentCells(data, _ri, _ci);

  for (const adjacentCell of adjacentCells) {
    if (adjacentCell) {
      if (adjacentCell.hasBeenChecked) {
        continue;
      }

      data[adjacentCell.ri][adjacentCell.ci].hasBeenChecked = true;

      if (adjacentCell.mineCount === 0) {
        cellsToOpen = cellsToOpen.concat(getCellsToOpen(data, adjacentCell.ri, adjacentCell.ci))
      }
      else {
        cellsToOpen.push([adjacentCell.ri, adjacentCell.ci]);
      }
    }
  }

  return cellsToOpen;
}

export function getMineCount (rows, ri, ci) {
  let mineCount = 0;

  for (const cell of getAdjacentCells(rows, ri, ci)) {
    if (cell && cell.type === MINE) {
      mineCount += 1;
    }
  }

  return mineCount;
}

export function generateData ({ width, height, mines }) {
  const data = Array.apply(null, { length: height })
    .map((d, i) =>
      Array.apply(null, { length: width }).map((d, i) => i)
    ); // --> [[0, 1, 2, 3, ... width], [0, 1, 2, 3, ... width], ...height]

  const mineLocations = Array.apply(null, { length: mines })
    .map((d, i) => generateRandomInt(1, width * height));

  const rows = [];
  let location = 1;

  for (let ri = 0; ri < data.length; ri++) {
    const columns = [];

    for (let ci = 0; ci < data[ri].length; ci++) {
      const column = {
        ri,
        ci,
        key: getKey(ri, ci),
        isOpen: false,
        isFlagged: false,
        mineCount: 0,
        location,
      }

      if (mineLocations.includes(location)) {
        column.type = MINE;
      }
      else {
        column.type = CELL;
      }

      columns.push(column);
      location += 1;
    }

    rows.push(columns);
  }

  for (let ri = 0; ri < rows.length; ri++) {
    const row = rows[ri];

    for (let ci = 0; ci < row.length; ci++) {
      const column = row[ci];

      if (column.type !== MINE) {
        column.mineCount = getMineCount(rows, ri, ci);
      }
    }
  }

  return rows;
}
