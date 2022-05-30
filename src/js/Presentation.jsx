import { useState, useEffect, useRef } from 'react';

export const Presentation = (props) => {
  const [countTime, setCountTime] = useState(180000)
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
      setCountTime(180000);
      setDisplayTime(180000);
      setRunning(false);
      startRef.current = 0;
      offsetRef.current = 0;
    } else {
      startRef.current = Date.now();
      setRunning(true);
    }
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
    <div className="countdown">
      <div className="countdown-name">{"3分プレゼン"}</div>
      <div className="countdown-out">{(displayTime < 0) ? '- ' + timeToString(Math.abs(displayTime)) : timeToString(displayTime)}</div>
      <div className="countdown-button-list">
        <button type="button" onClick={startStop}>{running ? 'リセット' : 'スタート'}</button>
      </div>
    </div>
  );
};
