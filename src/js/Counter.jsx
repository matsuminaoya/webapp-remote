import { useState } from 'react';

export const Counter = (props) => {
  const [count, setCount] = useState(0);
  const count01Up = () => {
    setCount(count + 1);
  };
  const count10Up = () => {
    setCount(count + 10);
  };
  const count01Down = () => {
    setCount(count - 1);
  };
  const count10Down = () => {
    setCount(count - 10);
  };
  const countReset = () => {
    setCount(props.initial);
  };
  return (
    <div className="counter">
      <div className="counter-name">{"カウンタ"}</div>
      <div className="counter-out">{count}</div>
      <div className="counter-button-list">
        <button type="button" onClick={count10Up} disabled={count >= props.max}>10アップ</button>
        <button type="button" onClick={count01Up} disabled={count >= props.max}>1アップ</button>
        <button type="button" onClick={countReset}>リセット</button>
        <button type="button" onClick={count01Down} disabled={count <= props.min}>1ダウン</button>
        <button type="button" onClick={count10Down} disabled={count <= props.min}>10ダウン</button>
      </div>
    </div>
  );
}

Counter.defaultProps = {
  initial: 0,
  max: Number.MAX_SAFE_INTEGER,
  min: Number.MIN_SAFE_INTEGER
}
