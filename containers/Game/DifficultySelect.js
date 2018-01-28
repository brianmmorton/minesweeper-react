import React from 'react';
import { difficulties } from './constants';

export default ({ onChange, value }) => (
  <select onChange={onChange} value={value}>
    {difficulties.map(difficulty =>
      <option key={difficulty.value} value={difficulty.value}>
        {difficulty.label}
      </option>
    )}
  </select>
);
