import { useState, useEffect, useRef } from 'react';

export const Stopwatch = (props) => {
  const [displayTime, setDisplayTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [lapList, setLapList] = useState([]);
  const startRef = useRef(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    let timer = running ? setTimeout(() => {
      setDisplayTime(Date.now() - startRef.current + offsetRef.current);
    }, 100) : null;
    return () => clearTimeout(timer);
  }, [displayTime, running]);
  const reset = () => {
    setDisplayTime(0);
    setRunning(false);
    startRef.current = 0;
    offsetRef.current = 0;
    setLapList([]);
  };
  const startStop = () => {
    if (running) {
      setRunning(false);
      offsetRef.current = offsetRef.current + Date.now() - startRef.current;
    } else {
      startRef.current = Date.now();
      setRunning(true);
    }
  };
  const lap = () => {
    setLapList([...lapList, displayTime]);
  };
  const pad2 = (x) => (x < 10 ? '0' : '') + x;
  const timeToString = (time) => {
    time = Math.floor(time / 100);
    const subseconds = time % 10;
    time = Math.floor(time / 10);
    const seconds = time % 60;
    time = Math.floor(time / 60);
    const minutes = time % 60;
    const hours = Math.floor(time / 60);
    return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}.${subseconds}`;
  };
  return (
    <div className="stopwatch">
      <div className="stopwatch-name">{"ストップウォッチver.2"}</div>
      <div className="stopwatch-out">{timeToString(displayTime)}</div>
      <div className="stopwatch-button-list">
        <button type="button" onClick={startStop}>
          {running ? 'ストップ' : 'スタート'}</button>
        <button type="button" onClick={reset}>リセット</button>
        <button type="button" onClick={lap} disabled={!running}>ラップ</button>
      </div>
      {lapList.length === 0 ? null :
        <div className="stopwatch-lap">
          <div className="stopwatch-lap-label">
            <span className="stopwatch-lap-num">{"lap"}</span>
            <span className="stopwatch-lap-laptime">{"time"}</span>
            <span className="stopwatch-lap-total">{"total"}</span>
          </div>
          <div className="stopwatch-lap-list">
            {(lapList.map((lap, index) => (
              <div className="stopwatch-lap-entry" key={index}>
                <span className="stopwatch-lap-num">{index + 1}</span>
                <span className="stopwatch-laptime">
                  {timeToString(lap - (index === 0 ? 0 : lapList[index - 1]))}
                </span>
                <span className="stopwatch-splittime">{timeToString(lap)}</span>
              </div>
            ))).reverse()}
          </div>
        </div>
      }
    </div>
  );
};
