import { useState, useEffect } from 'react';
import { Counter } from './Counter';
import { Stopwatch } from './Stopwatch';

export const S1 = (props) => {
  const counter = () => {
    <Counter />
  };
  const stopwatch = () => {
    <Stopwatch />
  };
  return (
    <div className="select">
      <div className="select-button-list">
        <button type="button" onClick={counter}>カウンター</button>
        <button type="button" onClick={stopwatch}>ストップウォッチ</button>
      </div>
    </div>
  );
}

