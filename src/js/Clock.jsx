import { useState, useEffect } from 'react';

export const Clock = () => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    setTimeout(() => {
      setCurrentTime(Date.now());
    }, 500);
  }, [currentTime]);
  const timeToText = (time) => {
    return Intl.DateTimeFormat('ja-JP',
      { hour: 'numeric', minute: 'numeric', second: 'numeric' })
      .format(time);
  };
  return (
    <div className="clock">{timeToText(currentTime)}</div>
  );
};