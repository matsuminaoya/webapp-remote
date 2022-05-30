import { useState, useEffect } from 'react';

export const Clock = () => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    setTimeout(() => {
      setCurrentTime(Date.now());
    }, 500);
  }, [currentTime]);
  options = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
    timeZone: 'Asia/Tokyo'
  };
  const timeToText_tyo = (time) => {
    return Intl.DateTimeFormat('en-US', options).format(time);
  };
  const timeToText_lon = (time) => {
    options.timeZone = "Europe/London"
    return Intl.DateTimeFormat('en-US', options).format(time);
  };
  const timeToText_nyc = (time) => {
    options.timeZone = "America/New_York"
    return Intl.DateTimeFormat('en-US', options).format(time);
  };
  return (
    <div className="clock">
      <div className="clock_tyo">{"TYO: " + "\t" + timeToText_tyo(currentTime)}</div>
      <div className="clock_lon">{"LON: " + "\t" + timeToText_lon(currentTime)}</div>
      <div className="clock_nyc">{"NYC: " + "\t" + timeToText_nyc(currentTime)}</div>
    </div>
  );
};
