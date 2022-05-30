import { useState, useEffect, useRef } from 'react';

export const Countdown = (props) => {
  const [countTime, setCountTime] = useState(900000)
  const [displayTime, setDisplayTime] = useState(countTime);
  const [running, setRunning] = useState(false);
  const startRef = useRef(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    let timer = running ? setTimeout(() => {
      setDisplayTime(countTime - Date.now() + startRef.current - offsetRef.current);
    }, 100) : null;
    return () => clearTimeout(timer);
  }, [displayTime, running]);

  const startStop = () => {
    if (running) {
      setRunning(false);
      offsetRef.current = offsetRef.current + Date.now() - startRef.current;
    } else {
      startRef.current = Date.now();
      setRunning(true);
    }
  };

  const reset = () => {
    setCountTime(0);
    setDisplayTime(0);
    setRunning(false);
    startRef.current = 0;
    offsetRef.current = 0;
  };

  const countTime10mUP = () => {
    setDisplayTime(displayTime + 600000);
    setCountTime(displayTime + 600000);
  };
  const countTime01mUP = () => {
    setDisplayTime(displayTime + 60000);
    setCountTime(displayTime + 60000);
  };
  const countTime10sUP = () => {
    setDisplayTime(displayTime + 10000);
    setCountTime(displayTime + 10000);
  };

  const pad2 = (x) => (x < 10 ? '0' : '') + x;
  const timeToString = (time) => {
    time = Math.floor(time / 100);
    const subseconds = time % 10;
    time = Math.floor(time / 10);
    const seconds = time % 60;
    time = Math.floor(time / 60);
    const minutes = time % 60;
    return `${pad2(minutes)}:${pad2(seconds)}.${subseconds}`;
  };

  return (
    <div className="countdowntimer">
      <div ClassName="countdowntimer-out">{timeToString(displayTime)}</div>
      <div className="stopwatch-button-list">
        <button type="button" onClick={startStop}>{running ? 'ストップ' : 'スタート'}</button>
        <button type="button" onClick={countTime10mUP} disabled={running || displayTime >= 3600000 - 600000}>+10分</button>
        <button type="button" onClick={countTime01mUP} disabled={running || displayTime >= 3600000 - 60000}>+01分</button>
        <button type="button" onClick={countTime10sUP} disabled={running || displayTime >= 3600000 - 10000}>+10秒</button>
        <button type="button" onClick={reset}>リセット</button>
      </div>
    </div>
  );
};
