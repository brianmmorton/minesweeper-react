export const CELL_WIDTH = 25;
export const CELL_HEIGHT = 20;
export const CELL_BORDER_WIDTH = 2;
export const MINE = 'mine';
export const CELL = 'cell';

export const difficulties = [
  {
    value: 'beginner',
    label: 'Beginner (10 x 10)',
    height: 10,
    width: 10,
    mines: 10,
  },
  {
    value: 'intermediate',
    label: 'Intermediate (16 x 16)',
    height: 16,
    width: 16,
    mines: 40,
  },
  {
    value: 'expert',
    label: 'Expert (16 x 30)',
    height: 16,
    width: 30,
    mines: 99,
  },
]
