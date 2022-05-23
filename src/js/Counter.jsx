import { useState } from 'react';
export const Counter = (props) => {
  const [count, setCount] = useState(0);
  const countUp = () => {
    setCount(count + 1);
  };
  const countDown = () => {
    setCount(count - 1);
  };
  const countReset = () => {
    setCount(props.initial);
  };
  return (
    <div className="counter">
      <div className="counter-out">{count}</div>
      <div className="counter-button-list">
        <button type="button" onClick={countUp} disabled={count >= props.max}>アップ</button>
        <button type="button" onClick={countDown} disabled={count <= props.min}>ダウン</button>
        <button type="button" onClick={countReset}>リセット</button>
      </div>
    </div>
  );
}

Counter.defaultProps = {
  initial: 0,
  max: Number.MAX_SAFE_INTEGER,
  min: Number.MIN_SAFE_INTEGER
}
